// src/components/issue/SingleIssueForm.tsx
import React from 'react';
import { UploadArea } from '@/components/ui-custom/UploadArea';
import { ResponseBox } from '@/components/ui-custom/ResponseBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, AlertCircle } from 'lucide-react'; // Added AlertCircle
import { FileInfo, ResponseState } from '@/types';
import { HowItWorksCard } from './HowItWorksCard'; // Import the HowItWorksCard

interface SingleIssueFormProps {
	fileInfo: FileInfo | null;
	recipientEmail: string;
	recipientName: string;
	certificateName: string;
	response: ResponseState;
	isFormComplete: boolean;
	onFileSelect: (file: File | null) => void;
	onRecipientEmailChange: (value: string) => void;
	onRecipientNameChange: (value: string) => void;
	onCertificateNameChange: (value: string) => void;
	onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const SingleIssueForm: React.FC<SingleIssueFormProps> = ({
	fileInfo,
	recipientEmail,
	recipientName,
	certificateName,
	response,
	isFormComplete,
	onFileSelect,
	onRecipientEmailChange,
	onRecipientNameChange,
	onCertificateNameChange,
	onSubmit,
}) => {
	return (
		// Use the grid layout provided by the parent Issue page structure
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

			{/* Column 1: Upload and Form */}
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
							onFileSelect={onFileSelect}
							accept=".pdf,.jpg,.jpeg,.png"
							label="Upload Certificate"
							sublabel="Drag and drop or click to browse"
						// Assuming UploadArea handles displaying its selected file state
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
						{/* Use a unique form ID */}
						<form id="single-issue-form" onSubmit={onSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="single-certificate-name">Certificate Name</Label>
								<Input
									id="single-certificate-name"
									placeholder="e.g. Bachelor of Science"
									value={certificateName}
									onChange={(e) => onCertificateNameChange(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="single-recipient-name">Recipient Name</Label>
								<Input
									id="single-recipient-name"
									placeholder="Full name of the recipient"
									value={recipientName}
									onChange={(e) => onRecipientNameChange(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="single-recipient-email">Recipient Email</Label>
								<Input
									id="single-recipient-email"
									type="email"
									placeholder="Email address for notification"
									value={recipientEmail}
									onChange={(e) => onRecipientEmailChange(e.target.value)}
								/>
								<p className="text-xs text-muted-foreground">
									The recipient will receive an email notification.
								</p>
							</div>
						</form>
					</CardContent>
					<CardFooter>
						<Button
							type="submit"
							form="single-issue-form" // Associate button with the form
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

			{/* Column 2: Response Box, How It Works, and Note */}
			<div className="flex flex-col gap-6">
				{/* Conditionally render ResponseBox based on state */}
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

				<HowItWorksCard />

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
	);
};