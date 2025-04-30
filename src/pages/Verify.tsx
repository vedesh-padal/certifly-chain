import React, { useState, useEffect, useCallback } from 'react'; // Added useEffect, useCallback
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UploadArea } from '@/components/ui-custom/UploadArea';
import { ResponseBox } from '@/components/ui-custom/ResponseBox';
import { CertificateCard } from '@/components/ui-custom/CertificateCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertCircle, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// --- Redux Imports ---
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import {
	setVerificationFile,
	resetVerificationState,
	clearVerificationError,
	verifyCertificateFile,
	selectVerificationFileInfo,
	selectVerificationIsLoading,
	selectVerificationError,
	selectVerificationResult
} from '@/features/verification/verificationSlice';
// --- End Redux Imports ---
import { Certificate } from '@/types'; // Keep Certificate type for card prop
import { HowVerificationWorksCard } from '@/components/ui-custom/HowVerificationWorksCard';

const Verify: React.FC = () => {
	const { toast } = useToast();
	// --- Redux State Access ---
	const dispatch = useDispatch<AppDispatch>();
	const fileInfo = useSelector(selectVerificationFileInfo);
	const isLoading = useSelector(selectVerificationIsLoading);
	const error = useSelector(selectVerificationError);
	const result = useSelector(selectVerificationResult); // Contains { isValid, hash, message?, details? }
	// --- End Redux State Access ---

	// --- Local State ONLY for the actual File object ---
	const [verifyFileObject, setVerifyFileObject] = useState<File | null>(null);

	// --- Effect to show error toasts ---
	useEffect(() => {
		if (error) {
			toast({ title: 'Verification Failed', description: error, variant: 'destructive' });
			dispatch(clearVerificationError()); // Clear error after showing
		}
	}, [error, dispatch, toast]);

	// --- Handlers ---
	const handleFileSelect = useCallback((selectedFile: File | null) => {
		dispatch(setVerificationFile(selectedFile)); // Update Redux with FileInfo
		setVerifyFileObject(selectedFile); // Keep actual File locally
	}, [dispatch]);

	const handleVerify = useCallback(async () => {
		if (!verifyFileObject) {
			toast({ title: 'Error', description: 'Please upload a certificate to verify', variant: 'destructive' });
			return;
		}
		// Dispatch the thunk with the actual file object
		dispatch(verifyCertificateFile({ file: verifyFileObject }));
	}, [dispatch, verifyFileObject, toast]);

	const handleReset = useCallback(() => {
		dispatch(resetVerificationState()); // Reset Redux state
		setVerifyFileObject(null); // Reset local file state
	}, [dispatch]);

	// --- Effect to clear local file if Redux state resets ---
	useEffect(() => {
		if (!fileInfo) {
			setVerifyFileObject(null);
		}
	}, [fileInfo]);

	// --- Prepare data for CertificateCard (if result exists) ---
	// This part needs adaptation based on what details you want to show
	// and what the backend actually returns in result.details
	const certificateToDisplay: Certificate | null = result ? {
		id: result.hash || `temp-${Date.now()}`, // Use hash or temp ID
		name: fileInfo?.name || 'Uploaded Certificate', // Use original filename
		recipientName: result.details?.recipientName || 'N/A', // Example: Get from result.details if available
		recipientEmail: result.details?.recipientEmail || 'N/A',
		issuerId: result.details?.issuerId || 'N/A',
		issuerName: result.details?.issuerName || 'N/A',
		issueDate: result.details?.issueDate || 'N/A',
		hash: result.hash || 'N/A',
		verified: result.isValid, // Set verified status from result
	} : null;

	return (
		<DashboardLayout requiredRole="verifier">
			<div className="flex flex-col gap-8">
				{/* Header */}
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold tracking-tight">Verify Certificate</h1>
					<p className="text-muted-foreground"> Upload a certificate to verify its authenticity on the blockchain </p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Column 1: Upload and Result Card */}
					<div className="flex flex-col gap-6">
						<Card className="glass-card">
							<CardHeader> <CardTitle>Upload Certificate</CardTitle> <CardDescription> Upload the certificate document you want to verify </CardDescription> </CardHeader>
							<CardContent className="space-y-4">
								<UploadArea
									onFileSelect={handleFileSelect}
									accept=".pdf,.jpg,.jpeg,.png"
									label="Upload Certificate"
									sublabel="Drag and drop or click to browse"
									isLoading={isLoading} // Use Redux loading state
								// Pass fileInfo if UploadArea needs it for display
								// selectedFileName={fileInfo?.name}
								/>
								<div className="flex gap-2">
									<Button className="w-full" onClick={handleVerify} disabled={!verifyFileObject || isLoading} >
										{isLoading ? 'Verifying...' : <><Shield className="mr-2 h-4 w-4" /> Verify Certificate</>}
									</Button>
									{/* Show Reset button only if there's a file or result */}
									{(fileInfo || result) && (
										<Button variant="outline" onClick={handleReset} disabled={isLoading}> Reset </Button>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Display Certificate Card only if verification is done and successful */}
						{/* Modify this logic based on desired UX */}
						{result && certificateToDisplay && (
							<CertificateCard certificate={certificateToDisplay} />
						)}
					</div>

					{/* Column 2: Response Box and How It Works */}
					<div className="flex flex-col gap-6">
						{/* Show ResponseBox for loading, success, or error states */}
						{(isLoading || result || error) && (
							<ResponseBox
								isLoading={isLoading}
								isSuccess={!!result?.isValid} // Success only if result is valid
								isError={!!error || (result !== null && !result.isValid)} // Error if API failed OR result is invalid
								message={error || result?.message || (result?.isValid ? 'Certificate is authentic.' : 'Certificate is NOT valid or not found.')}
								title={
									isLoading ? "Verifying..." :
										result?.isValid ? "Verification Successful" :
											"Verification Result" // More neutral title for invalid result
								}
							/>
						)}

						{/* Optional: Specific result boxes (like in original Verify.tsx) */}
						{result && result.isValid && (
							<div className="bg-success/10 border border-success/20 rounded-lg p-6 animate-fade-in">
								<div className="flex gap-4">
									<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/20 text-success"> <Check className="h-6 w-6" /> </div>
									<div> <h3 className="text-lg font-semibold mb-2 text-success">Certificate is Authentic</h3> <p className="text-sm text-muted-foreground mb-4"> This certificate has been verified. Hash: <code className='text-xs'>{result.hash}</code> </p> </div>
								</div>
							</div>
						)}
						{result && !result.isValid && (
							<div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 animate-fade-in">
								<div className="flex gap-4">
									<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/20 text-destructive"> <X className="h-6 w-6" /> </div>
									<div> <h3 className="text-lg font-semibold mb-2 text-destructive">Verification Failed</h3> <p className="text-sm text-muted-foreground mb-4"> This certificate could not be verified on the blockchain. Hash calculated: <code className='text-xs'>{result.hash || 'N/A'}</code> </p> </div>
								</div>
							</div>
						)}

						<HowVerificationWorksCard />

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
