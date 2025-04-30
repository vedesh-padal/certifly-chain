// src/types/index.ts

export type UserRole = 'issuer' | 'verifier';

export interface User {
	id: string;
	username: string;
	email: string;
	role: UserRole;
	name?: string;
	organization?: string;
	// Add notification preferences if needed by frontend state
	notifications?: {
		issuance?: boolean;
		verification?: boolean;
		accountUpdates?: boolean;
	};
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	token?: string; // Added token if managed in auth state
}

export interface Certificate {
	id: string;
	name: string;
	recipientName: string;
	recipientEmail: string;
	issuerId: string;
	issuerName: string;
	issueDate: string;
	hash: string;
	verified?: boolean; // Used on Verify page/Dashboard
}

export interface ResponseState {
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
	message: string;
}

export interface UploadAreaProps {
	onFileSelect: (file: File) => void;
	accept?: string;
	maxSize?: number;
	label?: string;
	sublabel?: string;
	isLoading?: boolean;
}

// --- NEW/UPDATED TYPES for Issuance ---

// Statuses emitted by the backend job processor
export type IssuanceJobStatus =
	| 'pending'
	| 'queued'
	| 'processing'
	| 'waiting_wallet'
	| 'retry_queued'
	| 'success'
	| 'failed';

// Data structure for a single row parsed from CSV (used in preview)
// Matches the structure returned by the /bulk-issue-preview endpoint
export interface CsvRowData {
	rowNumber: number;
	'Roll No': string;
	'Recipient Name': string;
	'Recipient Email': string;
	'Certificate Name/Type': string;
	'Issue Date'?: string; // Make optional if not always present/needed for display initially
	'Certificate Link': string;
	Grade?: string; // Optional
	_validationError?: string; // Error message from backend preview validation
}

// Represents the state of a single issuance task being tracked on the frontend
// This combines preview data with real-time status updates
export interface TrackedIssuanceTask extends CsvRowData { // Extends CsvRowData
	taskId: string | null; // Initially null, populated by backend start response or first WS update
	batchId: string | null;
	status: IssuanceJobStatus;
	message: string | null; // User-friendly message from backend WS update
	hash?: string | null;
	txHash?: string | null;
	error?: string | null; // Technical error message from backend WS update
	walletAddress?: string | null; // Optional: Wallet used
	lastUpdated: string | null; // Timestamp from WS update
}

// Payload structure received via WebSocket 'issuanceStatusUpdate' event
// This MUST match what the backend `emitStatus` helper sends
export interface IssuanceStatusUpdatePayload {
	taskId: string;
	batchId: string | null;
	status: IssuanceJobStatus;
	message: string;
	rowData?: { // Optional subset of original row data for context
		'Roll No'?: string;
		'Recipient Name'?: string;
	};
	timestamp: string; // ISO string date
	// Conditional fields
	hash?: string;
	txHash?: string;
	error?: string;
	walletAddress?: string;
}

// Represents the overall progress of a batch
export interface BatchProgress {
	total: number;      // Total jobs in the batch
	processed: number;  // Jobs that have reached a final state (success or failed)
	success: number;    // Jobs that succeeded
	failed: number;     // Jobs that permanently failed
}

export interface FileInfo {
	name: string;
	type: string;
	size: number;
}

// State slice for the issuance page (relevant parts for bulk)

// --- Updated IssuanceState ---
export interface IssuanceState {
	// Single Issuance State
	singleFile: FileInfo | null; // Use FileInfo type
	singleFileName: string | null; // Keep for convenience? Or remove if FileInfo is enough
	singleFileType: string | null; // Keep for convenience?
	singleFormData: {
		recipientEmail: string;
		recipientName: string;
		certificateName: string;
	};
	singleResponseState: ResponseState; // Use existing ResponseState type
	singleLastTaskId: string | null;

	// Bulk Issuance State
	csvFile: FileInfo | null; // Use FileInfo type
	csvFileName: string | null; // Keep for convenience?
	googleDriveLink: string;
	isPreviewLoading: boolean;
	previewData: CsvRowData[];
	previewError: string | null;
	hasPreviewRowErrors: boolean;

	isBatchStarting: boolean; // Loading state for the start API call
	isBatchStarted: boolean; // <-- ADDED: Tracks if batch is active
	startBatchError: string | null;
	currentBatchId: string | null;

	trackedTasks: { [taskId: string]: TrackedIssuanceTask };
	batchProgress: BatchProgress;
}