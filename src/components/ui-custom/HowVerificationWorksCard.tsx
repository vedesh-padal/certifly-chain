import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';





export const HowVerificationWorksCard: React.FC = () => {
	return (
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
	);
};