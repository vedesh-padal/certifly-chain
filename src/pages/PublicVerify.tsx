import React, { useEffect, useState } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import axios, { AxiosError } from 'axios'; // Use global axios
import { Shield, CheckCircle, XCircle, AlertTriangle, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui-custom/ThemeToggle';

// Define API Base URL (as you are doing in other slices/pages)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface PublicVerificationResponse {
	status: string;
	message: string;
	isValid: boolean;
	hash: string;
	details: {
		certificateName?: string;
		issuerName?: string;
		issueDate?: string;
		recipientName?: string;
	} | null;
}

const PublicVerifyPage: React.FC = () => {
	const [searchParams] = useSearchParams();
	const certificateId = searchParams.get('id');

	const [verificationData, setVerificationData] = useState<PublicVerificationResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!certificateId) {
			setError('No certificate identifier provided in the URL.');
			setIsLoading(false);
			return;
		}

		const verifyCertificate = async () => {
			setIsLoading(true);
			setError(null);
			setVerificationData(null);
			try {
				console.log(`PublicVerifyPage: Verifying ID: ${certificateId}`);
				// Use global axios and construct full URL
				const response = await axios.get<PublicVerificationResponse>(
					`${API_BASE_URL}/certificates/public-verify/${certificateId}`
					// No Authorization header needed for this public endpoint
				);
				setVerificationData(response.data);
			} catch (err) {
				console.error("Public Verification API Error:", err);
				const axiosErr = err as AxiosError<{ message?: string }>;
				setError(axiosErr.response?.data?.message || axiosErr.message || 'Failed to verify certificate.');
			} finally {
				setIsLoading(false);
			}
		};

		verifyCertificate();
	}, [certificateId]);

	const currentYear = new Date().getFullYear();

	return (
		<div className="flex flex-col min-h-screen bg-background text-foreground">
			{/* Simplified Header */}
			<header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
				<div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
					<RouterLink to="/" className="flex items-center gap-2">
						<Shield className="h-8 w-8 text-primary" />
						<span className="font-semibold text-xl tracking-tight">CertiChain</span>
					</RouterLink>
					<div className="flex items-center gap-2">
						<ThemeToggle variant="ghost" />
						<Button variant="outline" size="sm" asChild>
							<RouterLink to="/" className="flex items-center gap-1">
								<ArrowLeft className="h-4 w-4" /> Back to Home
							</RouterLink>
						</Button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-grow container mx-auto px-4 py-12 sm:py-16 flex items-center justify-center">
				<Card className="w-full max-w-lg glass-card shadow-xl">
					<CardHeader className="text-center">
						<ShieldCheck className="h-12 w-12 mx-auto mb-4 text-primary" />
						<CardTitle className="text-2xl sm:text-3xl">Certificate Verification</CardTitle>
						<CardDescription>
							Checking the authenticity of the provided certificate identifier.
						</CardDescription>
					</CardHeader>
					<CardContent className="mt-6">
						{isLoading && (
							<div className="flex flex-col items-center justify-center space-y-3 py-8">
								<Loader2 className="h-10 w-10 text-primary animate-spin" />
								<p className="text-muted-foreground">Verifying certificate...</p>
							</div>
						)}

						{error && !isLoading && (
							<div className="p-4 rounded-md bg-destructive/10 text-destructive text-center space-y-2">
								<AlertTriangle className="h-8 w-8 mx-auto mb-2" />
								<p className="font-semibold">Verification Error</p>
								<p className="text-sm">{error}</p>
							</div>
						)}

						{!isLoading && !error && verificationData && (
							<div className="space-y-6">
								{verificationData.isValid ? (
									<div className="p-6 rounded-md bg-success/10 text-success-foreground border border-success text-center">
										<CheckCircle className="h-10 w-10 mx-auto mb-3 text-success" />
										<h3 className="text-xl font-semibold text-success mb-1">Certificate is Authentic</h3>
										<p className="text-sm">{verificationData.message}</p>
									</div>
								) : (
									<div className="p-6 rounded-md bg-destructive/10 text-destructive-foreground border border-destructive text-center">
										<XCircle className="h-10 w-10 mx-auto mb-3 text-destructive" />
										<h3 className="text-xl font-semibold text-destructive mb-1">Verification Failed</h3>
										<p className="text-sm">{verificationData.message || "This certificate could not be verified or is invalid."}</p>
									</div>
								)}

								<div className="space-y-3 text-sm border-t pt-6">
									<h4 className="font-semibold text-lg mb-2 text-center">Certificate Details</h4>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Status:</span>
										<span className={`font-medium ${verificationData.isValid ? 'text-success' : 'text-destructive'}`}>
											{verificationData.isValid ? "Verified" : "Not Verified / Invalid"}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Certificate Name:</span>
										<span className="font-medium text-right">{verificationData.details?.certificateName || 'N/A'}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Recipient:</span>
										<span className="font-medium text-right">{verificationData.details?.recipientName || 'N/A'}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Issued By:</span>
										<span className="font-medium text-right">{verificationData.details?.issuerName || 'N/A'}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Issue Date:</span>
										<span className="font-medium text-right">
											{verificationData.details?.issueDate
												? new Date(verificationData.details.issueDate).toLocaleDateString()
												: 'N/A'}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Blockchain Hash:</span>
										<code className="text-xs font-mono bg-muted p-1 rounded break-all">{verificationData.hash || 'N/A'}</code>
									</div>
								</div>
							</div>
						)}
						{!isLoading && !error && !verificationData && certificateId && (
							<div className="p-4 rounded-md bg-yellow-500/10 text-yellow-700 text-center space-y-2">
								<AlertTriangle className="h-8 w-8 mx-auto mb-2" />
								<p className="font-semibold">No Data</p>
								<p className="text-sm">Could not retrieve verification data for the provided ID.</p>
							</div>
						)}
						{!certificateId && !isLoading && (
							<div className="p-4 rounded-md bg-destructive/10 text-destructive text-center space-y-2">
								<AlertTriangle className="h-8 w-8 mx-auto mb-2" />
								<p className="font-semibold">Missing Identifier</p>
								<p className="text-sm">No certificate identifier found in the URL. Please use a valid verification link.</p>
							</div>
						)}
					</CardContent>
				</Card>
			</main>

			{/* Simplified Footer */}
			<footer className="border-t py-8 bg-background">
				<div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
					<p>© {currentYear} CertiChain. All Rights Reserved.</p>
				</div>
			</footer>
		</div>
	);
};

export default PublicVerifyPage;