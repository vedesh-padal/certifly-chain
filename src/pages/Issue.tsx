import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckCircle, XCircle, Upload, File, Loader2, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { cn } from "@/lib/utils";

interface CertificateData {
  recipientName: string;
  recipientEmail: string;
  courseName: string;
  issueDate: string;
  expirationDate?: string;
  additionalData?: string;
}

const IssueCertificate = () => {
  const { api } = useAuth();
  const navigate = useNavigate();

  // State for single certificate issuance
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [courseName, setCourseName] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expirationDate, setExpirationDate] = useState<string | undefined>('');
  const [additionalData, setAdditionalData] = useState('');
  const [showResponseBox, setShowResponseBox] = useState(false);

  // State for batch certificate issuance
  const [excelData, setExcelData] = useState<CertificateData[]>([]);
  const [showBatchResponse, setShowBatchResponse] = useState(false);

  // Mutation hook for single certificate issuance
  const { mutate: issueCertificateMutation, data: response, isLoading, isError, error } = useMutation(
    async () => {
      if (!api) throw new Error("API client not initialized.");
      return api.issueCertificate({
        recipientName,
        recipientEmail,
        courseName,
        issueDate,
        expirationDate,
        additionalData,
      });
    },
    {
      onSuccess: () => {
        setShowResponseBox(true);
        setTimeout(() => {
          setShowResponseBox(false);
          setRecipientName('');
          setRecipientEmail('');
          setCourseName('');
          setIssueDate('');
          setExpirationDate('');
          setAdditionalData('');
        }, 3000);
      },
      onError: () => {
        setShowResponseBox(true);
        setTimeout(() => {
          setShowResponseBox(false);
        }, 5000);
      },
    }
  );

  // Mutation hook for batch certificate issuance
  const { mutate: issueBatchCertificatesMutation, data: batchResponse, isLoading: isBatchLoading, isError: isBatchError, error: batchError } = useMutation(
    async () => {
      if (!api) throw new Error("API client not initialized.");
      return api.issueBatchCertificates(excelData);
    },
    {
      onSuccess: () => {
        setShowBatchResponse(true);
        setTimeout(() => {
          setShowBatchResponse(false);
          setExcelData([]);
        }, 3000);
      },
      onError: () => {
        setShowBatchResponse(true);
        setTimeout(() => {
          setShowBatchResponse(false);
        }, 5000);
      },
    }
  );

  // Function to handle single certificate issuance
  const handleIssueCertificate = async () => {
    issueCertificateMutation();
  };

  // Function to handle batch certificate issuance
  const handleIssueBatchCertificates = async () => {
    issueBatchCertificatesMutation();
  };

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: CertificateData[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Map the JSON data to the CertificateData interface
      const headers = jsonData[0] as string[];
      const mappedData: CertificateData[] = (jsonData as any[]).slice(1).map(row => {
        const rowData: any = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        return {
          recipientName: rowData.recipientName || '',
          recipientEmail: rowData.recipientEmail || '',
          courseName: rowData.courseName || '',
          issueDate: rowData.issueDate || '',
          expirationDate: rowData.expirationDate || '',
          additionalData: rowData.additionalData || '',
        };
      });

      setExcelData(mappedData);
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Response Box Component
  const ResponseBox = ({ success, loading, error, errorMessage, successMessage }: {
    success: boolean | undefined;
    loading: boolean;
    error: boolean | undefined;
    errorMessage: string | undefined;
    successMessage: string;
  }) => {
    if (!showResponseBox && !showBatchResponse) return null;

    return (
      <Alert variant={success ? "default" : "destructive"}>
        {success && <CheckCircle className="h-4 w-4" />}
        {error && <XCircle className="h-4 w-4" />}
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <AlertTitle>{success ? "Success" : "Error"}</AlertTitle>
        <AlertDescription>
          {loading && "Loading..."}
          {success && successMessage}
          {error && errorMessage}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <DashboardLayout requiredRole="issuer">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Issue Certificate</h1>

        {/* Single Certificate Issuance Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Issue Single Certificate</CardTitle>
            <CardDescription>Fill in the details to issue a single certificate.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                type="text"
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input
                type="email"
                id="recipientEmail"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input
                type="text"
                id="courseName"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                type="date"
                id="issueDate"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
              <Input
                type="date"
                id="expirationDate"
                value={expirationDate || ''}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="additionalData">Additional Data (Optional)</Label>
              <Textarea
                id="additionalData"
                value={additionalData}
                onChange={(e) => setAdditionalData(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleIssueCertificate} disabled={isLoading}>
              {isLoading ? (
                <>
                  Issuing <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Issue Certificate"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Batch Certificate Issuance Form */}
        <Card>
          <CardHeader>
            <CardTitle>Issue Batch Certificates</CardTitle>
            <CardDescription>Upload an Excel file to issue multiple certificates at once.</CardDescription>
          </CardHeader>
          <CardContent>
            <div {...getRootProps()} className={cn("upload-area", isDragActive && "drag-active")}>
              <input {...getInputProps()} />
              <div className="text-center">
                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? "Drop the file here..." : "Drag 'n' drop an Excel file here, or click to select file"}
                </p>
              </div>
            </div>
            {excelData.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Uploaded Data:</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-collapse border-border rounded-md">
                    <thead>
                      <tr className="bg-secondary text-left">
                        <th className="px-4 py-2 border-b border-border">Recipient Name</th>
                        <th className="px-4 py-2 border-b border-border">Recipient Email</th>
                        <th className="px-4 py-2 border-b border-border">Course Name</th>
                        <th className="px-4 py-2 border-b border-border">Issue Date</th>
                        <th className="px-4 py-2 border-b border-border">Expiration Date</th>
                        <th className="px-4 py-2 border-b border-border">Additional Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {excelData.map((data, index) => (
                        <tr key={index} className="hover:bg-accent/50">
                          <td className="px-4 py-2 border-b border-border">{data.recipientName}</td>
                          <td className="px-4 py-2 border-b border-border">{data.recipientEmail}</td>
                          <td className="px-4 py-2 border-b border-border">{data.courseName}</td>
                          <td className="px-4 py-2 border-b border-border">{data.issueDate}</td>
                          <td className="px-4 py-2 border-b border-border">{data.expirationDate || '-'}</td>
                          <td className="px-4 py-2 border-b border-border">{data.additionalData || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleIssueBatchCertificates} disabled={isBatchLoading || excelData.length === 0}>
              {isBatchLoading ? (
                <>
                  Issuing Batch <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Issue Batch Certificates"
              )}
            </Button>
          </CardFooter>
        </Card>

        {showResponseBox && (
          <ResponseBox 
            success={response?.isSuccess} 
            loading={isLoading}
            error={isError}
            errorMessage={error?.message}
            successMessage="Certificate issued successfully!"
          />
        )}

        {showBatchResponse && (
          <ResponseBox 
            success={batchResponse?.isSuccess} 
            loading={isBatchLoading}
            error={isBatchError}
            errorMessage={batchError?.message}
            successMessage="Batch processing completed successfully!"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default IssueCertificate;
