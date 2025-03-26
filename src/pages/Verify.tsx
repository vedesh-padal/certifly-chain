
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UploadArea } from '@/components/ui-custom/UploadArea';
import { ResponseBox } from '@/components/ui-custom/ResponseBox';
import { CertificateCard } from '@/components/ui-custom/CertificateCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertCircle, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Certificate, ResponseState } from '@/types';

const Verify: React.FC = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [response, setResponse] = useState<ResponseState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  });

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Reset previous verification
    setCertificate(null);
    setResponse({
      isLoading: false,
      isSuccess: false,
      isError: false,
      message: '',
    });
  };

  const handleVerify = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please upload a certificate to verify',
        variant: 'destructive',
      });
      return;
    }
    
    // Set loading state
    setResponse({
      isLoading: true,
      isSuccess: false,
      isError: false,
      message: 'Verifying certificate authenticity on the blockchain...',
    });
    
    try {
      // Simulate API call with random verification result
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Simulate verification results (random for demo purposes)
      const isVerified = Math.random() > 0.3;
      
      if (isVerified) {
        // Mock certificate data for successful verification
        const mockCertificate: Certificate = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name.includes('degree') ? 'Bachelor of Science in Computer Science' : 'Certificate of Completion',
          recipientName: 'John Doe',
          recipientEmail: 'john.doe@example.com',
          issuerId: '1',
          issuerName: 'Example University',
          issueDate: new Date().toISOString().split('T')[0],
          hash: '0x' + Math.random().toString(36).substring(2, 66),
          verified: true
        };
        
        setCertificate(mockCertificate);
        
        setResponse({
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: 'Certificate successfully verified! The certificate is authentic and has been issued by the claimed institution.',
        });
      } else {
        // Mock certificate data for failed verification
        const mockCertificate: Certificate = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name.includes('degree') ? 'Bachelor of Science in Computer Science' : 'Certificate of Completion',
          recipientName: 'John Doe',
          recipientEmail: 'john.doe@example.com',
          issuerId: '1',
          issuerName: 'Example University',
          issueDate: new Date().toISOString().split('T')[0],
          hash: '0x' + Math.random().toString(36).substring(2, 66),
          verified: false
        };
        
        setCertificate(mockCertificate);
        
        setResponse({
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: 'Certificate verification failed! This certificate has not been found on the blockchain or may have been tampered with.',
        });
      }
    } catch (error) {
      setResponse({
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: 'An error occurred during verification. Please try again.',
      });
    }
  };

  const resetVerification = () => {
    setFile(null);
    setCertificate(null);
    setResponse({
      isLoading: false,
      isSuccess: false,
      isError: false,
      message: '',
    });
  };

  return (
    <DashboardLayout requiredRole="verifier">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Verify Certificate</h1>
          <p className="text-muted-foreground">
            Upload a certificate to verify its authenticity on the blockchain
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Upload Certificate</CardTitle>
                <CardDescription>
                  Upload the certificate document you want to verify
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <UploadArea
                  onFileSelect={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                  label="Upload Certificate"
                  sublabel="Drag and drop or click to browse"
                  isLoading={response.isLoading}
                />
                
                <div className="flex gap-2">
                  <Button 
                    className="w-full" 
                    onClick={handleVerify}
                    disabled={!file || response.isLoading}
                  >
                    {response.isLoading ? (
                      <>
                        <span className="mr-2">Verifying</span>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Verify Certificate
                      </>
                    )}
                  </Button>
                  
                  {(response.isSuccess || response.isError) && (
                    <Button 
                      variant="outline" 
                      onClick={resetVerification}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {certificate && (
              <CertificateCard certificate={certificate} />
            )}
          </div>
          
          <div className="flex flex-col gap-6">
            {(response.isLoading || response.isSuccess || response.isError) && (
              <ResponseBox
                isLoading={response.isLoading}
                isSuccess={response.isSuccess}
                isError={response.isError}
                message={response.message}
                title={
                  response.isLoading ? "Verifying Certificate" :
                  response.isSuccess ? "Certificate is Authentic" :
                  "Certificate Verification Failed"
                }
              />
            )}
            
            {response.isSuccess && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-6 animate-fade-in">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
                    <Check className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-success">Verification Successful</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This certificate has been verified as authentic. It exists on the blockchain and has not been tampered with.
                    </p>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <p>• Certificate hash matches blockchain record</p>
                      <p>• Issuing institution verified</p>
                      <p>• Certificate data is intact</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {response.isError && !response.isLoading && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 animate-fade-in">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                    <X className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-destructive">Verification Failed</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This certificate could not be verified on the blockchain. It may be fraudulent or tampered with.
                    </p>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <p>• Certificate hash does not match any blockchain record</p>
                      <p>• Certificate may have been altered</p>
                      <p>• Certificate may not have been issued by a recognized institution</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>How Verification Works</CardTitle>
                <CardDescription>
                  The certificate verification process explained
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Upload Certificate</p>
                    <p className="text-xs text-muted-foreground">
                      Upload the digital certificate document you want to verify
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">OCR Processing</p>
                    <p className="text-xs text-muted-foreground">
                      Google Cloud Document AI extracts text from the certificate
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    3
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Hash Computation</p>
                    <p className="text-xs text-muted-foreground">
                      System computes the unique hash of the certificate content
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    4
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Blockchain Verification</p>
                    <p className="text-xs text-muted-foreground">
                      The hash is checked against the blockchain records
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    5
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Verification Result</p>
                    <p className="text-xs text-muted-foreground">
                      System confirms if the certificate is authentic or not
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Important Note</h3>
                  <p className="text-xs text-muted-foreground">
                    Only certificates that have been issued through the CertiChain platform 
                    can be verified. The system uses advanced OCR to extract information from 
                    various certificate formats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Verify;
