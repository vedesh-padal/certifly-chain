// src/features/verification/verificationSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import type { RootState } from '../../app/store';
import { FileInfo } from '../../types'; // Import FileInfo type

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Define the shape of the verification result from the backend
interface VerificationResult {
	isValid: boolean;
	hash: string | null;
	message?: string;
	details: { // Expect these fields from the updated backend response
		certificateName?: string;
		recipientName?: string;
		recipientEmail?: string; // If you decide to send it
		issuerName?: string;
		issueDate?: string; // Will be ISO string from backend
		// Add any other fields you expect in 'details'
	} | null;
}

// Define the state structure for this slice
interface VerificationState {
	fileInfo: FileInfo | null; // Info about the uploaded file
	isLoading: boolean;
	error: string | null;
	result: VerificationResult | null; // Store the backend result
}

const initialState: VerificationState = {
	fileInfo: null,
	isLoading: false,
	error: null,
	result: null,
};

// --- Helper to get token ---
const getToken = (getState: () => RootState): string | null => {
	return getState().auth.token;
};

// --- Async Thunk for Verification ---
export const verifyCertificateFile = createAsyncThunk(
	'verification/verifyFile',
	async (payload: { file: File }, { getState, rejectWithValue }) => {
		const token = getToken(getState as () => RootState);
		if (!token) return rejectWithValue('Not authenticated');

		const formData = new FormData();
		formData.append('certificate', payload.file); // Use 'certificate' field name

		try {
			const response = await axios.post<VerificationResult>(`${API_BASE_URL}/certificates/verify`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					// 'Content-Type': 'multipart/form-data' // Axios sets this automatically for FormData
				}
			});
			// Expecting backend to return { isValid: boolean, hash: string|null, message?: string }
			return response.data;
		} catch (error) {
			console.error("Verification API Error:", error);
			const message = error instanceof AxiosError
				? error.response?.data?.message || error.message
				: error instanceof Error ? error.message : 'Verification failed';
			return rejectWithValue(message);
		}
	}
);

// --- Verification Slice Definition ---
export const verificationSlice = createSlice({
	name: 'verification',
	initialState,
	reducers: {
		// Action to set file info when user selects a file
		setVerificationFile: (state, action: PayloadAction<File | null>) => {
			if (action.payload) {
				state.fileInfo = {
					name: action.payload.name,
					type: action.payload.type,
					size: action.payload.size,
				};
			} else {
				state.fileInfo = null;
			}
			// Reset previous result and error when a new file is selected
			state.result = null;
			state.error = null;
			state.isLoading = false; // Ensure loading is reset
		},
		// Action to clear the verification state completely
		resetVerificationState: (state) => {
			state.fileInfo = null;
			state.isLoading = false;
			state.error = null;
			state.result = null;
		},
		clearVerificationError: (state) => {
			state.error = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(verifyCertificateFile.pending, (state) => {
				state.isLoading = true;
				state.error = null;
				state.result = null; // Clear previous result on new attempt
			})
			.addCase(verifyCertificateFile.fulfilled, (state, action: PayloadAction<VerificationResult>) => {
				state.isLoading = false;
				state.result = action.payload; // Store the successful result
				state.error = null;
			})
			.addCase(verifyCertificateFile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string; // Store the error message
				state.result = null; // Clear result on error
			});
	},
});

// Export actions
export const { setVerificationFile, resetVerificationState, clearVerificationError } = verificationSlice.actions;

// Export selectors
export const selectVerificationState = (state: RootState) => state.verification;
export const selectVerificationFileInfo = (state: RootState) => state.verification.fileInfo;
export const selectVerificationIsLoading = (state: RootState) => state.verification.isLoading;
export const selectVerificationError = (state: RootState) => state.verification.error;
export const selectVerificationResult = (state: RootState) => state.verification.result;

// Export reducer
export default verificationSlice.reducer;