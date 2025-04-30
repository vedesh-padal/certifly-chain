// src/components/issue/BulkIssueCsvUpload.tsx
import React from 'react';
import { UploadArea } from '@/components/ui-custom/UploadArea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { FileInfo } from '@/types';

interface BulkIssueCsvUploadProps {
	csvFileInfo: FileInfo | null; // <-- Change prop name and type
	googleDriveLink: string;
	isPreviewLoading: boolean;
	onCsvFileSelect: (file: File | null) => void;
	onGoogleDriveLinkChange: (value: string) => void;
	onPreviewCsv: () => Promise<void>;
}

export const BulkIssueCsvUpload: React.FC<BulkIssueCsvUploadProps> = ({
	csvFileInfo,
	googleDriveLink,
	isPreviewLoading,
	onCsvFileSelect,
	onGoogleDriveLinkChange,
	onPreviewCsv,
}) => {
	return (
		<Card className="glass-card">
			<CardHeader>
				<CardTitle>Upload Batch File</CardTitle>
				<CardDescription>
					Upload a CSV file containing certificate details
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<UploadArea
					onFileSelect={onCsvFileSelect}
					accept=".csv"
					label="Upload CSV File"
					sublabel="Drag and drop or click to browse (.csv only)"
					isLoading={isPreviewLoading}
				// Assuming UploadArea shows the selected file name internally
				/>

				{/* Show Drive link input only after CSV is selected */}
				{csvFileInfo && (
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="drive-folder-link">Google Drive Folder Link (Optional)</Label>
							<Input
								id="drive-folder-link"
								placeholder="https://drive.google.com/drive/folders/..."
								value={googleDriveLink}
								onChange={(e) => onGoogleDriveLinkChange(e.target.value)}
								disabled={isPreviewLoading} // Disable while previewing
							/>
							<p className="text-xs text-muted-foreground">
								Provide this link if your CSV 'Certificate Link' column contains filenames instead of direct file URLs. Ensure the folder is shared with the service account.
							</p>
						</div>

						<Button
							onClick={onPreviewCsv}
							className="w-full"
							disabled={!csvFileInfo || isPreviewLoading} // Disable if no file or already loading
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
	);
};