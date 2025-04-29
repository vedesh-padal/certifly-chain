
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UploadArea } from '@/components/ui-custom/UploadArea';
import { ResponseBox } from '@/components/ui-custom/ResponseBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Send, FileUp, Sheet, Play, AlertCircle } from 'lucide-react';
import { ResponseState } from '@/types';

// Interface for a single certificate issuance task
interface IssuanceTask {
  taskId?: string;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'waiting_wallet';
  message?: string;
  hash?: string;
  txHash?: string;
  error?: string;
}

// Interface for CSV row data
interface CsvRowData {
  rowNumber: number;
  rollNo: string;
  recipientName: string;
  recipientEmail: string;
  certificateName: string;
  certificateLink: string;
  task?: IssuanceTask;
}

const Issue: React.FC = () => {
  const { toast } = useToast();
  
  // State for single certificate issuance
  const [activeTab, setActiveTab] = useState<string>("single");
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

  // State for bulk certificate issuance
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [googleDriveLink, setGoogleDriveLink] = useState('');
  const [csvPreviewData, setCsvPreviewData] = useState<CsvRowData[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isBatchStarted, setIsBatchStarted] = useState(false);
  const [batchResponse, setBatchResponse] = useState<ResponseState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  });
  const [batchId, setBatchId] = useState<string | null>(null);
  const [batchProgress, setBatchProgress] = useState({
    total: 0,
    completed: 0,
    success: 0,
    failed: 0,
  });

  // Select file for single certificate issuance
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

  // Select CSV file for bulk issuance
  const handleCsvFileSelect = (selectedFile: File) => {
    setCsvFile(selectedFile);
    setShowPreview(false); // Reset preview when a new file is selected
    setCsvPreviewData([]);
  };

  // Placeholder function to handle previewing CSV data
  const handlePreviewCsv = async () => {
    if (!csvFile) {
      toast({
        title: 'Error',
        description: 'Please upload a CSV file first',
        variant: 'destructive',
      });
      return;
    }

    setIsPreviewLoading(true);
    
    try {
      // Simulate API call to parse CSV
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock CSV data for preview
      const mockData: CsvRowData[] = Array.from({ length: 15 }, (_, i) => ({
        rowNumber: i + 1,
        rollNo: `R00${i + 1}`,
        recipientName: `Student ${i + 1}`,
        recipientEmail: `student${i + 1}@example.com`,
        certificateName: i % 3 === 0 ? 'Bachelor of Science' : i % 3 === 1 ? 'Master of Arts' : 'Certificate of Completion',
        certificateLink: i % 4 === 0 ? 'Invalid link format' : `certificate_${i + 1}.pdf`,
        task: {
          status: 'pending',
          message: 'Waiting to start'
        }
      }));
      
      setCsvPreviewData(mockData);
      setShowPreview(true);
      
      // Show toast for successful preview
      toast({
        title: 'CSV Preview Ready',
        description: `${mockData.length} entries loaded for preview`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to parse CSV file',
        variant: 'destructive',
      });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Placeholder function to handle single certificate issuance
  const handleSingleIssuance = async (e: React.FormEvent) => {
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
        message: 'Certificate has been successfully queued for issuance with Task ID: TID-123456. You will be notified once the certificate is recorded on the blockchain.',
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

  // Placeholder function to handle bulk certificate issuance
  const handleStartBatch = async () => {
    if (csvPreviewData.length === 0) {
      toast({
        title: 'Error',
        description: 'No CSV data to process',
        variant: 'destructive',
      });
      return;
    }

    setBatchResponse({
      isLoading: true,
      isSuccess: false,
      isError: false,
      message: 'Starting batch issuance process...',
    });

    try {
      // Simulate API call to start batch
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock batch ID
      const mockBatchId = `BATCH-${Date.now().toString().substring(9)}`;
      setBatchId(mockBatchId);
      setIsBatchStarted(true);
      
      setBatchProgress({
        total: csvPreviewData.length,
        completed: 0,
        success: 0,
        failed: 0,
      });
      
      // Show success message
      setBatchResponse({
        isLoading: false,
        isSuccess: true,
        isError: false,
        message: `Batch issuance started with ID: ${mockBatchId}. Processing ${csvPreviewData.length} certificates.`,
      });

      // Simulate WebSocket updates for each row
      csvPreviewData.forEach((row, index) => {
        setTimeout(() => {
          // Create a copy of the current state
          setCsvPreviewData(prevData => {
            const newData = [...prevData];
            const isSuccess = Math.random() > 0.2; // 80% success rate for demo
            
            // Update task for this row
            newData[index] = {
              ...newData[index],
              task: {
                taskId: `TID-${mockBatchId}-${index}`,
                status: isSuccess ? 'success' : 'failed',
                message: isSuccess ? 'Certificate issued successfully' : 'Failed to issue certificate',
                txHash: isSuccess ? `0x${Math.random().toString(16).substring(2, 10)}` : undefined,
                error: isSuccess ? undefined : 'Transaction rejected',
              }
            };
            return newData;
          });

          // Update batch progress
          setBatchProgress(prev => ({
            ...prev,
            completed: prev.completed + 1,
            success: prev.success + (isSuccess ? 1 : 0),
            failed: prev.failed + (isSuccess ? 0 : 1),
          }));

        }, (index + 1) * 1000); // Stagger updates for demo
      });

    } catch (error) {
      setBatchResponse({
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: 'Failed to start batch issuance. Please try again.',
      });
    }
  };

  // Reset batch state
  const handleResetBatch = () => {
    setCsvFile(null);
    setGoogleDriveLink('');
    setShowPreview(false);
    setCsvPreviewData([]);
    setIsBatchStarted(false);
    setBatchId(null);
    setBatchResponse({
      isLoading: false,
      isSuccess: false,
      isError: false,
      message: '',
    });
    setBatchProgress({
      total: 0,
      completed: 0,
      success: 0,
      failed: 0,
    });
  };

  // Render status badge for bulk issuance rows
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600">Processing</Badge>;
      case 'waiting_wallet':
        return <Badge variant="secondary" className="bg-orange-500 hover:bg-orange-600">Waiting</Badge>;
      case 'success':
        return <Badge className="bg-success hover:bg-success/90">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const isFormComplete = file && recipientEmail && recipientName && certificateName;

  return (
    <DashboardLayout requiredRole="issuer">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Issue Certificate</h1>
          <p className="text-muted-foreground">
            Upload certificates to be hashed and stored on the blockchain
          </p>
        </div>
        
        <Tabs 
          defaultValue="single" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              <span>Single Certificate</span>
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Sheet className="h-4 w-4" />
              <span>Bulk Issue via CSV</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Single Certificate Tab Content */}
          <TabsContent value="single" className="space-y-8">
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
                    <form id="issue-form" onSubmit={handleSingleIssuance} className="space-y-4">
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
                      response.isSuccess ? "Certificate Queued" :
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
          </TabsContent>
          
          {/* Bulk Issuance via CSV Tab Content */}
          <TabsContent value="bulk" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Upload Batch File</CardTitle>
                    <CardDescription>
                      Upload a CSV file containing certificate details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <UploadArea
                      onFileSelect={handleCsvFileSelect}
                      accept=".csv"
                      label="Upload CSV File"
                      sublabel="Drag and drop or click to browse"
                      isLoading={isPreviewLoading}
                    />
                    
                    {csvFile && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="drive-folder-link">Google Drive Folder Link (Optional)</Label>
                          <Input
                            id="drive-folder-link"
                            placeholder="https://drive.google.com/drive/folders/..."
                            value={googleDriveLink}
                            onChange={(e) => setGoogleDriveLink(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Provide this link if your CSV 'Certificate Link' column contains filenames instead of direct file URLs.
                          </p>
                        </div>
                        
                        <Button 
                          onClick={handlePreviewCsv} 
                          className="w-full"
                          disabled={!csvFile || isPreviewLoading}
                        >
                          {isPreviewLoading ? (
                            <>
                              <span className="mr-2">Parsing CSV</span>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload & Preview CSV
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {showPreview && csvFile && (
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>
                        <div className="flex justify-between items-center">
                          <span>Batch Preview & Status</span>
                          {isBatchStarted && batchProgress.total > 0 && (
                            <Badge variant="outline" className="ml-2">
                              {batchProgress.completed} / {batchProgress.total} Processed
                            </Badge>
                          )}
                        </div>
                      </CardTitle>
                      <CardDescription className="flex items-center justify-between">
                        <span>Review the parsed data and track issuance progress</span>
                        <span className="text-xs font-medium">{csvFile.name}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-md h-[400px] overflow-y-auto">
                        <Table>
                          <TableHeader className="sticky top-0 bg-card z-10">
                            <TableRow>
                              <TableHead className="w-12">#</TableHead>
                              <TableHead className="w-20">Roll No</TableHead>
                              <TableHead>Recipient Name</TableHead>
                              <TableHead>Recipient Email</TableHead>
                              <TableHead>Certificate Name</TableHead>
                              <TableHead>Certificate Link</TableHead>
                              <TableHead className="w-32">Task ID</TableHead>
                              <TableHead className="w-24">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {csvPreviewData.map((row) => (
                              <TableRow key={row.rowNumber} className={row.certificateLink.includes('Invalid') ? 'bg-destructive/5' : ''}>
                                <TableCell>{row.rowNumber}</TableCell>
                                <TableCell>{row.rollNo}</TableCell>
                                <TableCell>{row.recipientName}</TableCell>
                                <TableCell>{row.recipientEmail}</TableCell>
                                <TableCell>{row.certificateName}</TableCell>
                                <TableCell className={row.certificateLink.includes('Invalid') ? 'text-destructive' : ''}>
                                  {row.certificateLink}
                                </TableCell>
                                <TableCell>{row.task?.taskId || '-'}</TableCell>
                                <TableCell>
                                  {row.task ? renderStatusBadge(row.task.status) : <Badge variant="outline">Pending</Badge>}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-3">
                      <Button
                        onClick={handleStartBatch}
                        disabled={isPreviewLoading || isBatchStarted}
                        className="flex-1"
                      >
                        {batchResponse.isLoading ? (
                          <>
                            <span className="mr-2">Starting</span>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Start Issuance Batch
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleResetBatch} 
                        className="flex-1"
                      >
                        Cancel Batch / Clear Preview
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
              
              <div className="flex flex-col gap-6">
                {(batchResponse.isLoading || batchResponse.isSuccess || batchResponse.isError) && (
                  <ResponseBox
                    isLoading={batchResponse.isLoading}
                    isSuccess={batchResponse.isSuccess}
                    isError={batchResponse.isError}
                    message={batchResponse.message}
                    title={
                      batchResponse.isLoading ? "Processing Batch" :
                      batchResponse.isSuccess ? "Batch Initiated" :
                      "Batch Failed"
                    }
                  />
                )}
                
                {isBatchStarted && batchProgress.total > 0 && (
                  <Card className="glass-card bg-muted/10">
                    <CardHeader>
                      <CardTitle>Batch Processing Status</CardTitle>
                      <CardDescription>
                        Real-time status of your certificate batch
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Batch ID:</span>
                        <span className="font-mono text-sm">{batchId}</span>
                      </div>
                      
                      <div className="w-full bg-muted/30 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
                          style={{ width: `${(batchProgress.completed / batchProgress.total) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>{batchProgress.completed} of {batchProgress.total} Completed</span>
                        <span>{Math.round((batchProgress.completed / batchProgress.total) * 100)}%</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2 p-3 rounded-md bg-success/10 border border-success/20">
                          <div className="h-3 w-3 rounded-full bg-success"></div>
                          <span className="text-sm font-medium">Success: {batchProgress.success}</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                          <div className="h-3 w-3 rounded-full bg-destructive"></div>
                          <span className="text-sm font-medium">Failed: {batchProgress.failed}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Bulk Issuance Guide</CardTitle>
                    <CardDescription>
                      How to use the bulk certificate issuance feature
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        1
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Prepare Your CSV</p>
                        <p className="text-xs text-muted-foreground">
                          Create a CSV with columns: Roll No, Recipient Name, Recipient Email, Certificate Name, Certificate Link
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        2
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Upload & Preview</p>
                        <p className="text-xs text-muted-foreground">
                          Upload your CSV and optionally link to a Google Drive folder containing certificate files
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        3
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Review the Data</p>
                        <p className="text-xs text-muted-foreground">
                          Check the parsed data in the preview table and ensure all information is correct
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        4
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Start the Batch</p>
                        <p className="text-xs text-muted-foreground">
                          Initiate the batch process to issue all certificates in one go
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        5
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Monitor Progress</p>
                        <p className="text-xs text-muted-foreground">
                          Track the status of each certificate in real-time as they are processed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium mb-1">CSV Format Requirements</h3>
                      <p className="text-xs text-muted-foreground">
                        Your CSV must include headers and contain at least the following columns: 
                        <span className="font-mono text-[10px] ml-1">Roll No, Recipient Name, Recipient Email, Certificate Name, Certificate Link</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Issue;
