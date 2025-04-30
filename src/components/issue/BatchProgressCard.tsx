// src/components/issue/BatchProgressCard.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
// Import the centralized type
import { BatchProgress } from '@/types';

interface BatchProgressCardProps {
	batchId: string | null;
	batchProgress: BatchProgress; // Use the imported type
}

export const BatchProgressCard: React.FC<BatchProgressCardProps> = ({
	batchId,
	batchProgress,
}) => {
	const progressPercentage = batchProgress.total > 0
		// Use processed count for the progress bar
		? Math.round((batchProgress.processed / batchProgress.total) * 100)
		: 0;

	if (!batchId || batchProgress.total === 0) {
		return null;
	}

	return (
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

				<Progress value={progressPercentage} className="w-full h-2.5" />

				<div className="flex justify-between text-sm">
					{/* Display processed count */}
					<span>{batchProgress.processed} of {batchProgress.total} Processed</span>
					<span>{progressPercentage}%</span>
				</div>

				<div className="grid grid-cols-2 gap-4 mt-4">
					<div className="flex items-center gap-2 p-3 rounded-md bg-green-100/80 dark:bg-green-900/30 border border-green-200 dark:border-green-700/50">
						<div className="h-3 w-3 rounded-full bg-green-500 dark:bg-green-400"></div>
						<span className="text-sm font-medium text-green-800 dark:text-green-200">Success: {batchProgress.success}</span>
					</div>
					<div className="flex items-center gap-2 p-3 rounded-md bg-red-100/80 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50">
						<div className="h-3 w-3 rounded-full bg-red-500 dark:bg-red-400"></div>
						<span className="text-sm font-medium text-red-800 dark:text-red-200">Failed: {batchProgress.failed}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};