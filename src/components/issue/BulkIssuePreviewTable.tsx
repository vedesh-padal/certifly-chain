import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from "@/components/ui/tooltip";

import { Play } from 'lucide-react';
import { BulkIssueStatusRow } from './BulkIssueStatusRow';
import { TrackedIssuanceTask, BatchProgress } from '@/types';


interface BulkIssuePreviewTableProps {
	// Use the combined tracked task data type
	tasks: TrackedIssuanceTask[];
	csvFileName: string;
	isBatchStarted: boolean;
	isBatchProcessing: boolean; // Loading state for the "Start Batch" button
	batchProgress: BatchProgress;
	hasPreviewRowErrors: boolean; // Flag from parent state
	onStartBatch: () => Promise<void>;
	onResetBatch: () => void;
}

export const BulkIssuePreviewTable: React.FC<BulkIssuePreviewTableProps> = ({
	tasks, // Renamed from previewData to tasks
	csvFileName,
	isBatchStarted,
	isBatchProcessing,
	batchProgress,
	hasPreviewRowErrors, // Receive this flag
	onStartBatch,
	onResetBatch,
}) => {

	return (
		<TooltipProvider delayDuration={100}>
			<Card className="glass-card">
				<CardHeader>
					<CardTitle>
						<div className="flex justify-between items-center">
							<span>Batch Preview & Status</span>
							{isBatchStarted && batchProgress.total > 0 && (
								<Badge variant="outline" className="ml-2">
									{batchProgress.processed} / {batchProgress.total} Processed {/* Use processed count */}
								</Badge>
							)}
						</div>
					</CardTitle>
					<CardDescription className="flex items-center justify-between">
						<span>Review the data and track issuance progress.</span>
						<span className="text-xs font-medium">{csvFileName}</span>
					</CardDescription>
					{hasPreviewRowErrors && (
						<p className="text-sm text-destructive font-medium">
							Please fix the errors highlighted below in your CSV and re-upload.
						</p>
					)}
				</CardHeader>
				<CardContent>
					<div className="border rounded-md h-[400px] overflow-y-auto relative">
						<Table>
							<TableHeader className="sticky top-0 bg-card/95 backdrop-blur-sm z-10">
								<TableRow>
									<TableHead className="w-12">#</TableHead>
									<TableHead className="w-24">Roll No</TableHead>
									<TableHead>Recipient Name</TableHead>
									<TableHead>Recipient Email</TableHead>
									<TableHead>Certificate Name</TableHead>
									<TableHead>Certificate Link/File</TableHead>
									<TableHead className="w-32">Task ID</TableHead>
									<TableHead className="w-24 text-right">Status</TableHead> {/* Align right */}
								</TableRow>
							</TableHeader>
							<TableBody>
								{tasks.length === 0 ? (
									<TableRow>
										<TableCell colSpan={8} className="h-24 text-center">
											Upload and preview a CSV file to see data here.
										</TableCell>
									</TableRow>
								) : (
									tasks.map((task) => (
										// Pass the whole task object to the row component
										<BulkIssueStatusRow key={task.taskId || task.rowNumber} taskData={task} />
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col sm:flex-row gap-3">
					<Button
						onClick={onStartBatch}
						// Disable if batch starting, already started, or has validation errors
						disabled={isBatchProcessing || isBatchStarted || hasPreviewRowErrors || tasks.length === 0}
						className="flex-1 w-full sm:w-auto"
					>
						{isBatchProcessing ? (
							<>
								<span className="mr-2">Starting Batch</span>
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
							</>
						) : (
							<>
								<Play className="mr-2 h-4 w-4" />
								Start Issuance Batch ({tasks.length} Records)
							</>
						)}
					</Button>
					<Button
						variant="outline"
						onClick={onResetBatch}
						className="flex-1 w-full sm:w-auto"
					>
						Cancel Batch / Clear Preview
					</Button>
				</CardFooter>
			</Card>
		</TooltipProvider>
	);
};