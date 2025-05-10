import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios'
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// --- Helper to get token ---
const getToken = (getState: () => RootState): string | null => {
	// Assuming token is stored in authSlice state
	return getState().auth.token;
};


// --- Async Thunks ---
// ... (previewCsvFile, startIssuanceBatch - keep placeholders for now) ...

// Thunk for handling CSV Preview API call
export const previewCsvFile = createAsyncThunk(
	'issuance/previewCsv',
	// Payload expects FormData containing the csvFile
	async (payload: { formData: FormData }, { getState, rejectWithValue }) => {
		const token = getToken(getState as () => RootState);
		if (!token) return rejectWithValue('Not authenticated');

		console.log('Thunk: previewCsvFile executing...');
		try {
			// Make actual API call
			const response = await axios.post<{ message: string; data: CsvRowData[]; fileName: string; hasRowErrors: boolean }>(
				`${API_BASE_URL}/certificates/bulk-issue-preview`,
				payload.formData, // Send FormData
				{
					headers: {
						Authorization: `Bearer ${token}`,
						// Axios sets Content-Type for FormData
					}
				}
			);

			// Check response structure (backend sends data array directly)
			if (!response.data || !Array.isArray(response.data.data)) {
				throw new Error('Invalid response structure from CSV preview API');
			}

			console.log('Thunk: previewCsvFile API call successful', response.data);
			// Return the relevant data for the fulfilled reducer
			return {
				data: response.data.data,
				hasRowErrors: response.data.hasRowErrors
			};

		} catch (error) {
			console.error('Thunk: previewCsvFile API error', error);
			const message = error instanceof AxiosError
				? error.response?.data?.message || error.message
				: error instanceof Error ? error.message : 'Failed to preview CSV';
			return rejectWithValue(message);
		}
	}
);

// Thunk for handling Start Batch API call
export const startIssuanceBatch = createAsyncThunk(
	'issuance/startBatch',
	// Payload matches what the component sends
	async (payload: { batchData: CsvRowData[], folderLink: string | null, fileName: string | undefined }, { getState, rejectWithValue }) => {
		const token = getToken(getState as () => RootState);
		if (!token) return rejectWithValue('Not authenticated');

		console.log('Thunk: startIssuanceBatch executing...');
		try {
			// Make actual API call, sending JSON body
			const response = await axios.post<{ message: string; batchId: string; taskIds: string[] }>(
				`${API_BASE_URL}/certificates/bulk-issue-start`,
				{ // Send JSON payload
					batchData: payload.batchData,
					folderLink: payload.folderLink || null, // Send null if empty string
					fileName: payload.fileName
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json', // Explicitly set for JSON
					}
				}
			);

			// Check response structure
			if (response.status !== 202 || !response.data.batchId || !response.data.taskIds) {
				throw new Error('Invalid response structure from start batch API');
			}

			console.log('Thunk: startIssuanceBatch API call successful', response.data);
			// Return data needed by fulfilled reducer
			return {
				batchId: response.data.batchId,
				taskIds: response.data.taskIds,
				totalTasks: response.data.taskIds.length // Calculate total from response
			};

		} catch (error) {
			console.error('Thunk: startIssuanceBatch API error', error);
			const message = error instanceof AxiosError
				? error.response?.data?.message || error.message
				: error instanceof Error ? error.message : 'Failed to start batch';
			return rejectWithValue(message);
		}
	}
);

// Thunk for handling Single Issue API call
export const submitSingleIssue = createAsyncThunk(
	'issuance/submitSingle',
	// Payload now expects FormData directly
	async (payload: { formData: FormData }, { getState, rejectWithValue }) => {
		const token = getToken(getState as () => RootState);
		if (!token) return rejectWithValue('Not authenticated');

		console.log('Thunk: submitSingleIssue executing...');
		// Log FormData entries (for debugging - browser only)
		// for (let [key, value] of payload.formData.entries()) {
		//     console.log(`FormData Entry: ${key}`, value);
		// }

		try {
			// Make the actual API call
			const response = await axios.post<{ status: string; taskId: string }>(
				`${API_BASE_URL}/certificates/issue`,
				payload.formData, // Send FormData directly
				{
					headers: {
						Authorization: `Bearer ${token}`,
						// 'Content-Type': 'multipart/form-data' // Axios sets this automatically for FormData
					}
				}
			);

			// Check response status code (Axios throws for non-2xx)
			// Expecting 202 Accepted from backend
			if (response.status !== 202 || !response.data.taskId) {
				throw new Error('Invalid response structure from single issue API');
			}

			console.log('Thunk: submitSingleIssue API call successful', response.data);
			// Return data needed by fulfilled reducer
			return { taskId: response.data.taskId };

		} catch (error) {
			console.error('Thunk: submitSingleIssue API error', error);
			const message = error instanceof AxiosError
				? error.response?.data?.message || error.message
				: error instanceof Error ? error.message : 'Failed to queue single certificate';
			return rejectWithValue(message);
		}
	}
);


// --- Create Slice ---
export const issuanceSlice = createSlice({
	name: 'issuance',
	initialState, // Ensure initialState includes singleResponseState and singleLastTaskId
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
		// Reducer to handle WebSocket updates for BOTH single and bulk
		updateTaskStatus: (state, action: PayloadAction<IssuanceStatusUpdatePayload>) => {
			const { taskId, status, message, hash, txHash, error, timestamp, batchId, rowData } = action.payload;

			// --- Update Single Issue State ---
			// Check if the update is for the last submitted single task
			if (state.singleLastTaskId === taskId) {
				console.log(`Updating singleResponseState for taskId: ${taskId}`);
				state.singleResponseState = {
					// Update loading based on intermediate statuses
					isLoading: status === 'processing' || status === 'queued' || status === 'waiting_wallet' || status === 'retry_queued',
					isSuccess: status === 'success',
					isError: status === 'failed',
					// Construct a comprehensive message
					message: `${message}${txHash ? ` (Tx: ${txHash.substring(0, 10)}...)` : ''}${error ? ` Error: ${error}` : ''}`
				};
				// Optionally clear singleLastTaskId if it reaches a final state?
				// if (status === 'success' || status === 'failed') {
				//     state.singleLastTaskId = null; // Or keep it to show last status
				// }
			}

			// --- Update Bulk Tracked Task State ---
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
				state.singleLastTaskId = null;
			})
			.addCase(submitSingleIssue.fulfilled, (state, action: PayloadAction<{ taskId: string }>) => {
				state.singleResponseState = { isLoading: false, isSuccess: true, isError: false, message: `Certificate queued. Task ID: ${action.payload.taskId}` };
				state.singleLastTaskId = action.payload.taskId;
			})
			.addCase(submitSingleIssue.rejected, (state, action) => {
				state.singleResponseState = { isLoading: false, isSuccess: false, isError: true, message: action.payload as string ?? 'Failed to queue certificate.' };
				state.singleLastTaskId = null;
			})

			// --- CSV Preview Thunk ---
			.addCase(previewCsvFile.pending, (state) => {
				state.isPreviewLoading = true;
				state.previewError = null;
				state.previewData = [];
				state.hasPreviewRowErrors = false;
			})
			.addCase(previewCsvFile.fulfilled, (state, action: PayloadAction<{ data: CsvRowData[], hasRowErrors: boolean }>) => {
				state.isPreviewLoading = false;
				state.previewData = action.payload.data; // Store parsed data
				state.hasPreviewRowErrors = action.payload.hasRowErrors; // Store error flag
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
				state.isBatchStarting = true;
				state.startBatchError = null;
				state.currentBatchId = null;
				state.isBatchStarted = false;
				state.trackedTasks = {};
				state.batchProgress = initialState.batchProgress;
			})
			// Update fulfilled case payload type
			.addCase(startIssuanceBatch.fulfilled, (state, action: PayloadAction<{ batchId: string; taskIds: string[]; totalTasks: number }>) => {
				state.isBatchStarting = false;
				state.startBatchError = null;
				state.currentBatchId = action.payload.batchId;
				state.isBatchStarted = true;
				state.batchProgress = {
					total: action.payload.totalTasks, // Use total from payload
					processed: 0, success: 0, failed: 0,
				};
				// Initialize trackedTasks based on previewData and received taskIds
				const initialTasks: { [taskId: string]: TrackedIssuanceTask } = {};
				// Use previewData from state which should still hold the data
				state.previewData.forEach((row) => {
					// Find the corresponding taskId (backend guarantees order or provides mapping?)
					// Assuming order matches for now, or backend needs to return taskId mapped to row number/Roll No
					// Let's refine taskId generation/mapping if needed. Using Roll No for now.
					const taskId = action.payload.taskIds.find(id => id.endsWith(row['Roll No']));

					if (taskId) {
						initialTasks[taskId] = {
							...row,
							taskId: taskId,
							batchId: action.payload.batchId,
							status: 'queued',
							message: 'Queued for processing',
							lastUpdated: new Date().toISOString(),
							hash: null, txHash: null, error: null, walletAddress: null,
						};
					} else {
						console.warn(`Could not find matching taskId for Roll No: ${row['Roll No']} in startBatch response.`);
					}
				});
				state.trackedTasks = initialTasks;
			})
			.addCase(startIssuanceBatch.rejected, (state, action) => {
				state.isBatchStarting = false;
				state.startBatchError = action.payload as string ?? 'Failed to start batch.';
				state.currentBatchId = null;
				state.isBatchStarted = false;
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