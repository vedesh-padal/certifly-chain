import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const BulkGuideCard: React.FC = () => {
	return (
		<>
			<Card className="glass-card">
				<CardHeader>
					<CardTitle>Bulk Issuance Guide</CardTitle>
					<CardDescription>
						How to use the bulk certificate issuance feature
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Step 1 */}
					<div className="flex gap-4">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">1</div>
						<div className="space-y-1">
							<p className="text-sm font-medium">Prepare Your CSV</p>
							<p className="text-xs text-muted-foreground">Create a CSV with required headers (Roll No, Name, Email, Cert Name, Cert Link).</p>
						</div>
					</div>
					{/* Step 2 */}
					<div className="flex gap-4">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">2</div>
						<div className="space-y-1">
							<p className="text-sm font-medium">Upload & Link (Optional)</p>
							<p className="text-xs text-muted-foreground">Upload CSV. Provide Drive Folder link if CSV uses filenames.</p>
						</div>
					</div>
					{/* Step 3 */}
					<div className="flex gap-4">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">3</div>
						<div className="space-y-1">
							<p className="text-sm font-medium">Preview Data</p>
							<p className="text-xs text-muted-foreground">Review the parsed data in the preview table for accuracy.</p>
						</div>
					</div>
					{/* Step 4 */}
					<div className="flex gap-4">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">4</div>
						<div className="space-y-1">
							<p className="text-sm font-medium">Start Batch</p>
							<p className="text-xs text-muted-foreground">Initiate the batch process to queue all certificates.</p>
						</div>
					</div>
					{/* Step 5 */}
					<div className="flex gap-4">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">5</div>
						<div className="space-y-1">
							<p className="text-sm font-medium">Monitor Progress</p>
							<p className="text-xs text-muted-foreground">Track the status of each certificate in real-time in the table.</p>
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
							Your CSV must include headers:
							<span className="font-mono text-[10px] ml-1">Roll No, Recipient Name, Recipient Email, Certificate Name/Type, Issue Date, Certificate Link</span>
							(Grade is optional). Ensure certificate links are correct or filenames match files in the linked Drive folder (<span className="font-mono text-[10px]">Roll No.pdf</span>).
						</p>
					</div>
				</div>
			</div>
		</>
	);
};