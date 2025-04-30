// src/components/issue/BulkIssueStatusRow.tsx
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, XCircle, Clock, Loader2, AlertTriangle, HelpCircle } from 'lucide-react';
// Import the centralized types
import { TrackedIssuanceTask, IssuanceJobStatus } from '@/types';

interface BulkIssueStatusRowProps {
	// Expect the combined tracked task data
	taskData: TrackedIssuanceTask;
}

// Helper to render status badge with icon and tooltip
const renderStatusBadge = (taskData: TrackedIssuanceTask) => {
	const status: IssuanceJobStatus | 'validation_error' = taskData._validationError ? 'validation_error' : taskData.status;
	const message = taskData._validationError || taskData.message || 'Pending';
	const errorDetails = taskData.error;
	const txHash = taskData.txHash;

	let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
	let badgeClass = "";
	let IconComponent: React.ElementType | null = Clock;
	let statusText = "Pending"; // Default text

	switch (status) {
		case 'pending':
		case 'queued':
			badgeVariant = "secondary";
			IconComponent = Clock;
			statusText = "Queued";
			break;
		case 'processing':
			badgeVariant = "secondary";
			badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
			IconComponent = () => <Loader2 className="h-3 w-3 animate-spin" />;
			statusText = "Processing";
			break;
		case 'waiting_wallet':
			badgeVariant = "secondary";
			badgeClass = "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
			IconComponent = Clock;
			statusText = "Waiting";
			break;
		case 'retry_queued':
			badgeVariant = "secondary";
			badgeClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
			IconComponent = Clock;
			statusText = "Retrying";
			break;
		case 'success':
			badgeVariant = "default";
			badgeClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
			IconComponent = CheckCircle;
			statusText = "Success";
			break;
		case 'failed':
			badgeVariant = "destructive";
			IconComponent = XCircle;
			statusText = "Failed";
			break;
		case 'validation_error':
			badgeVariant = "destructive";
			IconComponent = AlertTriangle;
			statusText = "Invalid Row";
			break;
		default: // Should not happen with defined types
			IconComponent = HelpCircle;
			statusText = "Unknown";
			break;
	}

	// Construct tooltip content - use the message from the task state
	let tooltipContent = message || statusText; // Fallback to statusText
	if (txHash) tooltipContent += ` | Tx: ${txHash.substring(0, 10)}...`;
	if (errorDetails) tooltipContent += ` | Error: ${errorDetails}`;

	return (
		<TooltipProvider delayDuration={100}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge variant={badgeVariant} className={badgeClass}>
						{IconComponent && <IconComponent className="h-3 w-3 mr-1 flex-shrink-0" />}
						<span className="truncate">{statusText}</span>
					</Badge>
				</TooltipTrigger>
				<TooltipContent className="max-w-xs text-center" side="top">
					<p>{tooltipContent}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};


export const BulkIssueStatusRow: React.FC<BulkIssueStatusRowProps> = ({ taskData }) => {
	// Extract data using the correct keys from CsvRowData part of TrackedIssuanceTask
	const rollNo = taskData['Roll No'] || '-';
	const recipientName = taskData['Recipient Name'] || '-';
	const recipientEmail = taskData['Recipient Email'] || '-';
	const certificateName = taskData['Certificate Name/Type'] || '-';
	const certificateLink = taskData['Certificate Link'] || '-';
	const taskId = taskData.taskId || '-'; // Get taskId from the task part
	const hasValidationError = !!taskData._validationError;

	return (
		// Use taskData.rowNumber or taskId for the key if rowNumber isn't unique across batches
		<TableRow key={taskData.taskId || taskData.rowNumber} className={hasValidationError ? 'bg-destructive/5 hover:bg-destructive/10' : ''}>
			<TableCell className="font-medium">{taskData.rowNumber}</TableCell>
			<TableCell>{rollNo}</TableCell>
			<TableCell>{recipientName}</TableCell>
			<TableCell>{recipientEmail}</TableCell>
			<TableCell>{certificateName}</TableCell>
			<TableCell className={`text-xs truncate max-w-[150px] ${hasValidationError ? 'text-destructive' : ''}`}>
				{certificateLink.startsWith('http') ? (
					<a href={certificateLink} target="_blank" rel="noopener noreferrer" className="hover:underline" title={certificateLink}>
						{certificateLink}
					</a>
				) : (
					<span title={certificateLink}>{certificateLink}</span>
				)}
			</TableCell>
			<TableCell className="font-mono text-xs">{taskId}</TableCell>
			<TableCell className="text-right"> {/* Align status to the right */}
				{renderStatusBadge(taskData)}
			</TableCell>
		</TableRow>
	);
};