import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
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
	searchQuery: string;
}

// Define an interface for the thunk argument
interface FetchCertificatesArgs {
	page?: number;
	limit?: number;
	query?: string;
}

const initialState: DashboardState = {
	issuedCertificates: [],
	isLoading: false,
	error: null,
	currentPage: 1,
	totalPages: 1,
	totalCount: 0,
	searchQuery: '', //	Initialize search query
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
		if (!token) return rejectWithValue('Not authenticated');

		const state = getState() as RootState; // Get current state
		const queryToUse = args?.query !== undefined ? args.query : state.dashboard.searchQuery; // Use passed query or state query

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const params: any = { // Use 'any' for params object for flexibility
			page: args?.page || 1,
			limit: args?.limit || 9,
		};
		if (queryToUse.trim() !== '') {
			params.query = queryToUse.trim(); // Add query param only if not empty
		}


		try {
			console.log('Thunk: fetchIssuedCertificates executing with params:', params);
			// Use global axios, API_BASE_URL, and manually add headers

			// API endpoint is now /api/certificates/search if query is present,
			// or /api/certificates/issued-by-me if query is empty.
			// Our backend /search endpoint handles empty query by returning all, so we can always use /search.
			const endpoint = `/certificates/search`; // Always use search endpoint


			const response = await axios.get<IssuedCertificatesResponse>(
				`${API_BASE_URL}${endpoint}`,
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
		setSearchQuery: (state, action: PayloadAction<string>) => {
			state.searchQuery = action.payload;
			state.currentPage = 1; // Reset to first page on new search
		},
		// Action to clear dashboard state, e.g., on logout
		resetDashboardState: (state) => {
			// Keep initialState reference for resetting
			Object.assign(state, initialState);
		},
		clearDashboardError: (state) => {
			state.error = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIssuedCertificates.pending, (state, action) => {
				state.isLoading = true;
				state.error = null;
				// If a new search query is part of the meta args, update it
				if (action.meta.arg?.query !== undefined) {
					state.searchQuery = action.meta.arg.query;
					state.currentPage = 1; // Reset page for new search
				}
			})
			.addCase(fetchIssuedCertificates.fulfilled, (state, action: PayloadAction<IssuedCertificatesResponse>) => {
				state.isLoading = false;
				state.issuedCertificates = action.payload.data;
				state.currentPage = action.payload.currentPage;
				state.totalPages = action.payload.totalPages;
				state.totalCount = action.payload.totalCount;
				// Update searchQuery if needed based on what was used in the thunk
				// No need to expect fetchedWithQuery in payload
				state.error = null;
			})
			.addCase(fetchIssuedCertificates.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
				// Don't clear certificates on error if just a search/pagination failed,
				// user might want to see previous results. Clear if it's an initial load error.
				// state.issuedCertificates = [];
			});
	},
});

// Export actions
export const { setSearchQuery, resetDashboardState, clearDashboardError } = dashboardSlice.actions;

// Export selectors
export const selectDashboardState = (state: RootState) => state.dashboard;
export const selectIssuedCertificates = (state: RootState) => state.dashboard.issuedCertificates;
export const selectDashboardIsLoading = (state: RootState) => state.dashboard.isLoading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

// Use createSelector for memoized selectors to avoid unnecessary re-renders
export const selectDashboardPagination = createSelector(
	[(state: RootState) => state.dashboard.currentPage,
	(state: RootState) => state.dashboard.totalPages,
	(state: RootState) => state.dashboard.totalCount],
	(currentPage, totalPages, totalCount) => ({
		currentPage,
		totalPages,
		totalCount
	})
);

export const selectSearchQuery = (state: RootState) => state.dashboard.searchQuery;

export default dashboardSlice.reducer;