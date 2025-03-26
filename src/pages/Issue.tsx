
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UploadArea } from '@/components/ui-custom/UploadArea';
import { ResponseBox } from '@/components/ui-custom/ResponseBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Send, AlertCircle } from 'lucide-react';
import { ResponseState } from '@/types';

const Issue: React.FC = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [certificateName, setCertificateName] = useState('');
  const [response, setResponse] = useState<ResponseState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  });

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Mock file name extraction
    if (selectedFile.name.includes('certificate')) {
      setCertificateName('Certificate of Achievement');
    } else if (selectedFile.name.includes('degree')) {
      setCertificateName('Bachelor of Science');
    } else if (selectedFile.name.includes('diploma')) {
      setCertificateName('Diploma in Computer Science');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please upload a certificate file',
        variant: 'destructive',
      });
      return;
    }
    
    if (!recipientEmail || !recipientName || !certificateName) {
      toast({
        title: 'Error',
        description: 'Please fill in all the required fields',
        variant: 'destructive',
      });
      return;
    }
    
    // Set loading state
    setResponse({
      isLoading: true,
      isSuccess: false,
      isError: false,
      message: 'Issuing certificate on the blockchain...',
    });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setResponse({
        isLoading: false,
        isSuccess: true,
        isError: false,
        message: 'Certificate has been successfully issued and recorded on the blockchain. The recipient will receive an email notification.',
      });
      
      // Reset form after success
      setTimeout(() => {
        setFile(null);
        setRecipientEmail('');
        setRecipientName('');
        setCertificateName('');
        
        setResponse({
          isLoading: false,
          isSuccess: false,
          isError: false,
          message: '',
        });
      }, 5000);
    } catch (error) {
      // Simulate error
      setResponse({
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: 'Failed to issue the certificate. Please try again.',
      });
    }
  };

  const isFormComplete = file && recipientEmail && recipientName && certificateName;

  return (
    <DashboardLayout requiredRole="issuer">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Issue Certificate</h1>
          <p className="text-muted-foreground">
            Upload a certificate to be hashed and stored on the blockchain
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Upload Certificate</CardTitle>
                <CardDescription>
                  Upload the certificate document you want to issue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UploadArea
                  onFileSelect={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                  label="Upload Certificate"
                  sublabel="Drag and drop or click to browse"
                />
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Certificate Details</CardTitle>
                <CardDescription>
                  Enter the recipient information and certificate details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="issue-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="certificate-name">Certificate Name</Label>
                    <Input
                      id="certificate-name"
                      placeholder="e.g. Bachelor of Science in Computer Science"
                      value={certificateName}
                      onChange={(e) => setCertificateName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recipient-name">Recipient Name</Label>
                    <Input
                      id="recipient-name"
                      placeholder="Full name of the certificate recipient"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recipient-email">Recipient Email</Label>
                    <Input
                      id="recipient-email"
                      type="email"
                      placeholder="Email address for notification"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      The recipient will receive an email notification when the certificate is issued
                    </p>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  form="issue-form" 
                  className="w-full" 
                  disabled={!isFormComplete || response.isLoading}
                >
                  {response.isLoading ? (
                    <>
                      <span className="mr-2">Issuing</span>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Issue Certificate
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="flex flex-col gap-6">
            {(response.isLoading || response.isSuccess || response.isError) && (
              <ResponseBox
                isLoading={response.isLoading}
                isSuccess={response.isSuccess}
                isError={response.isError}
                message={response.message}
                title={
                  response.isLoading ? "Processing" :
                  response.isSuccess ? "Certificate Issued" :
                  "Issue Failed"
                }
              />
            )}
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  The certificate issuance process explained
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
                      Upload the digital certificate document (PDF, JPG, PNG)
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Enter Details</p>
                    <p className="text-xs text-muted-foreground">
                      Add recipient information and certificate details
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
                      System computes a unique hash of the certificate content
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    4
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Blockchain Storage</p>
                    <p className="text-xs text-muted-foreground">
                      Hash is stored on the blockchain for permanent verification
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    5
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Notification</p>
                    <p className="text-xs text-muted-foreground">
                      Recipient receives an email with certificate information
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
                    Once a certificate is issued on the blockchain, it cannot be modified or deleted. 
                    Please ensure all information is accurate before issuing.
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

export default Issue;
