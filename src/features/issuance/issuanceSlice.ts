// src/features/issuance/issuanceSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store'; // Import RootState for selectors
import {
	ResponseState,
	CsvRowData,
	TrackedIssuanceTask,
	IssuanceStatusUpdatePayload,
	BatchProgress,
	IssuanceState,
	FileInfo
} from '../../types'; // Import centralized types

// Define the initial state using the CORRECTED IssuanceState interface
const initialState: IssuanceState = {
	// Single Issuance State
	singleFile: null, // Initialize matching type
	singleFileName: null,
	singleFileType: null,
	singleFormData: {
		recipientEmail: '',
		recipientName: '',
		certificateName: '',
	},
	singleResponseState: { isLoading: false, isSuccess: false, isError: false, message: '' },
	singleLastTaskId: null,

	// Bulk Issuance State
	csvFile: null, // Initialize matching type
	csvFileName: null,
	googleDriveLink: '',
	isPreviewLoading: false,
	previewData: [],
	previewError: null,
	hasPreviewRowErrors: false,

	isBatchStarting: false,
	isBatchStarted: false, // Initialize the new state field
	startBatchError: null,
	currentBatchId: null,

	trackedTasks: {},
	batchProgress: {
		total: 0,
		processed: 0,
		success: 0,
		failed: 0,
	},
};

// --- Async Thunks (Placeholders - Implement API calls later) ---

// Thunk for handling CSV Preview API call
export const previewCsvFile = createAsyncThunk(
	'issuance/previewCsv',
	async (formData: FormData, { rejectWithValue }) => {
		// TODO: Replace with actual API call to POST /api/certificates/bulk-issue-preview
		console.log('Thunk: previewCsvFile executing with FormData');
		try {
			await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
			// Simulate successful response with mock data
			const mockData: CsvRowData[] = Array.from({ length: 8 + Math.floor(Math.random() * 10) }, (_, i) => ({
				rowNumber: i + 1,
				'Roll No': `R${1000 + i}`,
				'Recipient Name': `Bulk Student ${i + 1}`,
				'Recipient Email': `bulk${i + 1}@test.com`,
				'Certificate Name/Type': i % 2 === 0 ? 'Bulk Cert Alpha' : 'Bulk Cert Beta',
				'Issue Date': `2025-0${i % 9 + 1}-1${i % 3 + 0}`,
				// 'Certificate Link': i === 3 ? 'INVALID_LINK' : i % 3 === 0 ? `R${1000 + i}.pdf` : `https://drive.google.com/file/d/FAKE_ID_${i}/view`,
				'Certificate Link': `https://drive.google.com/file/d/FAKE_ID_1/view`,
				Grade: ['A', 'B+', 'A-', 'C', 'B'][i % 5],
				// _validationError: i === 3 ? "Invalid Certificate Link format." : undefined,
			}));
			const hasErrors = mockData.some(row => row._validationError);
			console.log('Thunk: previewCsvFile mock success');
			// Return data expected by the 'fulfilled' reducer
			return { data: mockData, hasRowErrors: hasErrors };
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to preview CSV';
			console.error('Thunk: previewCsvFile error', error);
			return rejectWithValue(message);
		}
	}
);

// Thunk for handling Start Batch API call
export const startIssuanceBatch = createAsyncThunk(
	'issuance/startBatch',
	async (payload: { batchData: CsvRowData[], folderLink: string, fileName: string | undefined }, { rejectWithValue }) => {
		// TODO: Replace with actual API call to POST /api/certificates/bulk-issue-start
		console.log('Thunk: startIssuanceBatch executing with payload:', payload);
		try {
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
			// Simulate successful response from backend
			const mockBatchId = `batch_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`;
			const mockTaskIds = payload.batchData.map(row => `task_${mockBatchId}_${row['Roll No']}`);
			console.log('Thunk: startIssuanceBatch mock success');
			return { batchId: mockBatchId, taskIds: mockTaskIds, totalTasks: payload.batchData.length };
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to start batch';
			console.error('Thunk: startIssuanceBatch error', error);
			return rejectWithValue(message);
		}
	}
);

// Thunk for handling Single Issue API call
export const submitSingleIssue = createAsyncThunk(
	'issuance/submitSingle',
	async (payload: { formData: FormData }, { rejectWithValue }) => {
		// TODO: Replace with actual API call to POST /api/certificates/issue
		console.log('Thunk: submitSingleIssue executing with FormData');
		// Note: Accessing FormData content directly in JS is tricky for logging
		// You'd typically log on the server side after receiving it.
		try {
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
			// Simulate successful response from backend
			const mockTaskId = `task_single_${Date.now()}`;
			console.log('Thunk: submitSingleIssue mock success');
			return { taskId: mockTaskId }; // Return data needed by fulfilled reducer
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to queue single certificate';
			console.error('Thunk: submitSingleIssue error', error);
			return rejectWithValue(message);
		}
	}
);


// --- Create Slice ---
export const issuanceSlice = createSlice({
	name: 'issuance',
	initialState,
	// Reducers for synchronous actions
	reducers: {
		// Single Issuance Reducers
		setSingleFile: (state, action: PayloadAction<File | null>) => {
			if (action.payload) {
				// Don't store the full File object in Redux state
				state.singleFile = { name: action.payload.name, type: action.payload.type, size: action.payload.size }; // Store info
				state.singleFileName = action.payload.name;
				state.singleFileType = action.payload.type;
			} else {
				state.singleFile = null;
				state.singleFileName = null;
				state.singleFileType = null;
			}
		},
		setSingleFormData: (state, action: PayloadAction<{ field: keyof IssuanceState['singleFormData']; value: string }>) => {
			state.singleFormData[action.payload.field] = action.payload.value;
		},
		resetSingleIssueState: (state) => {
			state.singleFile = null;
			state.singleFileName = null;
			state.singleFileType = null;
			state.singleFormData = initialState.singleFormData;
			state.singleResponseState = initialState.singleResponseState;
			state.singleLastTaskId = null;
		},
		clearSingleResponse: (state) => {
			state.singleResponseState = initialState.singleResponseState;
		},

		// Bulk Issuance Reducers
		setCsvFile: (state, action: PayloadAction<File | null>) => {
			if (action.payload) {
				state.csvFile = { name: action.payload.name, type: action.payload.type, size: action.payload.size };
				state.csvFileName = action.payload.name;
			} else {
				state.csvFile = null;
				state.csvFileName = null;
			}
			// Reset related bulk state
			state.googleDriveLink = '';
			state.previewData = [];
			state.previewError = null;
			state.hasPreviewRowErrors = false;
			state.trackedTasks = {};
			state.isBatchStarted = false; // Reset this too
			state.isBatchStarting = false;
			state.currentBatchId = null;
			state.batchProgress = initialState.batchProgress;
		},
		setGoogleDriveLink: (state, action: PayloadAction<string>) => {
			state.googleDriveLink = action.payload;
		},
		clearPreviewData: (state) => {
			state.previewData = [];
			state.previewError = null;
			state.hasPreviewRowErrors = false;
			state.trackedTasks = {};
			state.isBatchStarted = false;
			state.isBatchStarting = false;
			state.currentBatchId = null;
			state.batchProgress = initialState.batchProgress;
		},
		// Reducer to handle WebSocket updates
		updateTaskStatus: (state, action: PayloadAction<IssuanceStatusUpdatePayload>) => {
			const { taskId, status, message, hash, txHash, error, timestamp, batchId, rowData } = action.payload;
			if (state.trackedTasks[taskId]) {
				const taskBeforeUpdate = state.trackedTasks[taskId];
				const wasAlreadyProcessed = taskBeforeUpdate.status === 'success' || taskBeforeUpdate.status === 'failed';

				// Update task details
				taskBeforeUpdate.status = status;
				taskBeforeUpdate.message = message;
				taskBeforeUpdate.hash = hash ?? taskBeforeUpdate.hash;
				taskBeforeUpdate.txHash = txHash ?? taskBeforeUpdate.txHash;
				taskBeforeUpdate.error = error ?? null;
				taskBeforeUpdate.lastUpdated = timestamp;

				// Update batch progress only if transitioning to a final state
				const isNowProcessed = status === 'success' || status === 'failed';
				if (isNowProcessed && !wasAlreadyProcessed) {
					state.batchProgress.processed += 1;
					if (status === 'success') state.batchProgress.success += 1;
					if (status === 'failed') state.batchProgress.failed += 1;
				}
			} else {
				// This case might happen if the WS message arrives before the startBatch thunk finishes
				// Or if the initial state wasn't populated correctly. Log a warning.
				logger.warn(`Received WebSocket update for unknown taskId: ${taskId}. Ignoring or creating entry.`);
				// Optionally create a basic entry if needed, but ideally initial state is set by startBatch.fulfilled
				// state.trackedTasks[taskId] = { /* ... create from payload ... */ };
			}

			// // Update batch progress if the task reached a final state
			// if (status === 'success' || status === 'failed') {
			// 	// Avoid double counting if WS sends multiple final updates
			// 	const taskAlreadyProcessed = state.trackedTasks[taskId]?.status === 'success' || state.trackedTasks[taskId]?.status === 'failed';
			// 	if (!taskAlreadyProcessed) { // Check previous status before incrementing
			// 		state.batchProgress.processed += 1;
			// 		if (status === 'success') state.batchProgress.success += 1;
			// 		if (status === 'failed') state.batchProgress.failed += 1;
			// 	}
			// }
		},
		resetBulkIssueState: (state) => {
			// Reset all bulk fields
			state.csvFile = null;
			state.csvFileName = null;
			state.googleDriveLink = '';
			state.isPreviewLoading = false;
			state.previewData = [];
			state.previewError = null;
			state.hasPreviewRowErrors = false;
			state.isBatchStarting = false;
			state.startBatchError = null;
			state.currentBatchId = null;
			state.isBatchStarted = false; // Reset this
			state.trackedTasks = {};
			state.batchProgress = initialState.batchProgress;
		},
	},
	// Handle async thunk lifecycle actions
	extraReducers: (builder) => {
		builder
			// --- Single Issue Thunk ---
			.addCase(submitSingleIssue.pending, (state) => {
				state.singleResponseState = { isLoading: true, isSuccess: false, isError: false, message: 'Queueing certificate...' };
			})
			.addCase(submitSingleIssue.fulfilled, (state, action) => {
				state.singleResponseState = { isLoading: false, isSuccess: true, isError: false, message: `Certificate queued. Task ID: ${action.payload.taskId}` };
				state.singleLastTaskId = action.payload.taskId;
			})
			.addCase(submitSingleIssue.rejected, (state, action) => {
				state.singleResponseState = { isLoading: false, isSuccess: false, isError: true, message: action.payload as string ?? 'Failed to queue certificate.' };
			})

			// --- CSV Preview Thunk ---
			.addCase(previewCsvFile.pending, (state) => {
				state.isPreviewLoading = true;
				state.previewError = null;
				state.previewData = [];
				state.hasPreviewRowErrors = false;
			})
			.addCase(previewCsvFile.fulfilled, (state, action) => {
				state.isPreviewLoading = false;
				state.previewData = action.payload.data;
				state.hasPreviewRowErrors = action.payload.hasRowErrors;
				state.previewError = null;
			})
			.addCase(previewCsvFile.rejected, (state, action) => {
				state.isPreviewLoading = false;
				state.previewError = action.payload as string ?? 'Failed to preview CSV.';
				state.previewData = [];
				state.hasPreviewRowErrors = false;
			})

			// --- Start Batch Thunk ---
			.addCase(startIssuanceBatch.pending, (state) => {
				state.isBatchStarting = true; // Set starting flag
				state.startBatchError = null;
				state.currentBatchId = null;
				state.isBatchStarted = false; // Ensure not marked as started yet
				state.trackedTasks = {};
				state.batchProgress = initialState.batchProgress;
			})
			.addCase(startIssuanceBatch.fulfilled, (state, action) => {
				state.isBatchStarting = false; // Clear starting flag
				state.startBatchError = null;
				state.currentBatchId = action.payload.batchId;
				state.isBatchStarted = true; // Mark batch as active now
				state.batchProgress = {
					total: action.payload.totalTasks,
					processed: 0, success: 0, failed: 0,
				};
				// Initialize trackedTasks
				const initialTasks: { [taskId: string]: TrackedIssuanceTask } = {};
				state.previewData.forEach((row, index) => {
					const taskId = action.payload.taskIds[index];
					if (taskId) {
						initialTasks[taskId] = {
							...row,
							taskId: taskId,
							batchId: action.payload.batchId, // Add batchId
							status: 'queued',
							message: 'Queued for processing',
							lastUpdated: new Date().toISOString(),
							hash: null, txHash: null, error: null, walletAddress: null,
						};
					}
				});
				state.trackedTasks = initialTasks;
			})
			.addCase(startIssuanceBatch.rejected, (state, action) => {
				state.isBatchStarting = false; // Clear starting flag
				state.startBatchError = action.payload as string ?? 'Failed to start batch.';
				state.currentBatchId = null;
				state.isBatchStarted = false; // Ensure not marked as started
			});
	},
});

// Export actions (reducers)
export const {
	setSingleFile, setSingleFormData, resetSingleIssueState, clearSingleResponse,
	setCsvFile, setGoogleDriveLink, clearPreviewData, updateTaskStatus, resetBulkIssueState
} = issuanceSlice.actions;

export const selectIssuanceState = (state: RootState) => state.issuance;
export const selectTrackedTasks = (state: RootState) => state.issuance.trackedTasks;
// Memoize complex selectors if needed using reselect library later
export const selectTrackedTasksArray = (state: RootState) => Object.values(state.issuance.trackedTasks);
export const selectBatchProgress = (state: RootState) => state.issuance.batchProgress;
export const selectPreviewData = (state: RootState) => state.issuance.previewData; // Example additional selector
export const selectIsPreviewLoading = (state: RootState) => state.issuance.isPreviewLoading; // Example
export const selectIsBatchStarting = (state: RootState) => state.issuance.isBatchStarting; // Example
export const selectIsBatchStarted = (state: RootState) => state.issuance.isBatchStarted; // Example
// ... add more selectors for specific pieces of state as needed ...

// Export the reducer
export default issuanceSlice.reducer;

// Add logger require at the top if not already present
const logger = { warn: console.warn, info: console.info, error: console.error, debug: console.debug }; // Simple console logger placeholder