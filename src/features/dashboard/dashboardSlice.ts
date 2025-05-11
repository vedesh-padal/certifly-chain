import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios'; // Use global axios
import type { RootState } from '../../app/store';
import { Certificate as CertificateCardPropType } from '../../types';

// Define API Base URL (as you are doing in other slices)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// This is the actual shape of data from backend/stored in this slice
export interface CertificateMetadataFromDB {
	_id: string; // MongoDB ID
	id?: string; // Sometimes Mongoose adds 'id' virtual
	hash: string;
	certificateName: string;
	recipientName: string;
	recipientEmail: string;
	issuerId: string;
	issuerName: string;
	issueDate: string; // ISO Date string
	status: 'issued' | 'revoked';
	blockchainTransactionHash: string;
	// Add other fields from your CertificateMetadata model
	originalFileName?: string;
	grade?: string;
	batchId?: string;
	createdAt?: string;
	updatedAt?: string;
}

interface IssuedCertificatesResponse {
	message: string;
	data: CertificateMetadataFromDB[];
	currentPage: number;
	totalPages: number;
	totalCount: number;
}

interface DashboardState {
	issuedCertificates: CertificateMetadataFromDB[];
	isLoading: boolean;
	error: string | null;
	currentPage: number;
	totalPages: number;
	totalCount: number;
}

// Define an interface for the thunk argument
interface FetchCertificatesArgs {
	page?: number;
	limit?: number;
}

const initialState: DashboardState = {
	issuedCertificates: [],
	isLoading: false,
	error: null,
	currentPage: 1,
	totalPages: 1,
	totalCount: 0,
};

// --- Helper to get token (if not using interceptor) ---
const getToken = (getState: () => RootState): string | null => {
	return getState().auth.token;
};

// --- Async Thunk for Fetching Issued Certificates ---
export const fetchIssuedCertificates = createAsyncThunk(
	'dashboard/fetchIssued',
	async (args: FetchCertificatesArgs | undefined, { getState, rejectWithValue }) => {
		const token = getToken(getState as () => RootState);
		if (!token) {
			return rejectWithValue('Not authenticated');
		}

		// Use defaults if args or its properties are not provided
		const params = {
			page: args?.page || 1,
			limit: args?.limit || 9,
		};

		try {
			console.log('Thunk: fetchIssuedCertificates executing with params:', params);
			// Use global axios, API_BASE_URL, and manually add headers
			const response = await axios.get<IssuedCertificatesResponse>(
				`${API_BASE_URL}/certificates/issued-by-me`,
				{
					params, // Send pagination as query parameters
					headers: {
						Authorization: `Bearer ${token}`,
					}
				}
			);

			if (!response.data || !Array.isArray(response.data.data)) {
				throw new Error('Invalid response structure from issued certificates API');
			}
			console.log('Thunk: fetchIssuedCertificates API call successful', response.data);
			return response.data;
		} catch (error) {
			console.error('Thunk: fetchIssuedCertificates API error', error);
			const err = error as AxiosError<{ message?: string }>; // Type assertion
			const message = err.response?.data?.message || err.message || 'Failed to fetch issued certificates';
			return rejectWithValue(message);
		}
	}
);
// --- Dashboard Slice Definition ---
export const dashboardSlice = createSlice({
	name: 'dashboard',
	initialState,
	reducers: {
		// Action to clear dashboard state, e.g., on logout
		resetDashboardState: (state) => {
			state.issuedCertificates = [];
			state.isLoading = false;
			state.error = null;
			state.currentPage = 1;
			state.totalPages = 1;
			state.totalCount = 0;
		},
		clearDashboardError: (state) => {
			state.error = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIssuedCertificates.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchIssuedCertificates.fulfilled, (state, action: PayloadAction<IssuedCertificatesResponse>) => {
				state.isLoading = false;
				state.issuedCertificates = action.payload.data;
				state.currentPage = action.payload.currentPage;
				state.totalPages = action.payload.totalPages;
				state.totalCount = action.payload.totalCount;
				state.error = null;
			})
			.addCase(fetchIssuedCertificates.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
				state.issuedCertificates = []; // Clear data on error
			});
	},
});

// Export actions
export const { resetDashboardState, clearDashboardError } = dashboardSlice.actions;

// Export selectors
export const selectDashboardState = (state: RootState) => state.dashboard;
export const selectIssuedCertificates = (state: RootState) => state.dashboard.issuedCertificates;
export const selectDashboardIsLoading = (state: RootState) => state.dashboard.isLoading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;
export const selectDashboardPagination = (state: RootState) => ({
	currentPage: state.dashboard.currentPage,
	totalPages: state.dashboard.totalPages,
	totalCount: state.dashboard.totalCount,
});

// Export reducer
export default dashboardSlice.reducer;