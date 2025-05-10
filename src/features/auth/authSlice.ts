import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import type { RootState } from '../../app/store';
import { User, UserRole, AuthState } from '../../types'; // Use AuthState from types


// --- Helper Functions for localStorage ---
const getTokenFromStorage = (): string | null => localStorage.getItem('authToken');
const getUserFromStorage = (): User | null => {
	const storedUser = localStorage.getItem('authUser');
	try { return storedUser ? JSON.parse(storedUser) : null; }
	catch (e) { console.error("Failed to parse stored user", e); return null; }
};
const setAuthStorage = (token: string, user: User) => {
	localStorage.setItem('authToken', token);
	localStorage.setItem('authUser', JSON.stringify(user));
};
const clearAuthStorage = () => {
	localStorage.removeItem('authToken');
	localStorage.removeItem('authUser');
};
// --- End Helper Functions ---


// Define the initial state using AuthState interface
// Initialize based on localStorage content
const initialToken = getTokenFromStorage();
const initialUser = getUserFromStorage();
const initialState: AuthState = {
	user: initialUser,
	token: initialToken, // Store token in state as well
	isAuthenticated: !!(initialToken && initialUser), // True if both exist initially
	isLoading: true, // Set to false initially, thunks will handle loading
	error: null,
};

// Define API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// --- Async Thunks using Axios ---

// Login User Thunk
export const loginUser = createAsyncThunk(
	'auth/loginUser',
	async (credentials: { usernameOrEmail: string; password: string }, { rejectWithValue }) => {
		try {
			const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
			const { user, token } = response.data;
			if (!user || !token) throw new Error('Invalid response structure from login API');
			setAuthStorage(token, user);
			return { user, token };
		} catch (error) { // Type error as unknown first
			console.error("Login API Error:", error);
			let message = 'Login failed';
			if (axios.isAxiosError(error)) { // Check if it's an Axios error
				message = error.response?.data?.message || error.message;
			} else if (error instanceof Error) { // Check if it's a standard Error
				message = error.message;
			}
			return rejectWithValue(message);
		}
	}
);

// Register User Thunk
export const registerUser = createAsyncThunk(
	'auth/registerUser',
	async (userData: { username: string; email: string; password: string; role: UserRole; name?: string; organization?: string }, { rejectWithValue }) => {
		try {
			const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
			const { user, token } = response.data;
			if (!user || !token) throw new Error('Invalid response structure from register API');
			setAuthStorage(token, user);
			return { user, token };
		} catch (error) { // Type error as unknown
			console.error("Register API Error:", error);
			let message = 'Registration failed';
			if (axios.isAxiosError(error)) {
				message = error.response?.data?.message || error.message;
			} else if (error instanceof Error) {
				message = error.message;
			}
			return rejectWithValue(message);
		}
	}
);

// Optional: Thunk to fetch user profile if token exists (e.g., on app load)
export const fetchUserOnLoad = createAsyncThunk(
	'auth/fetchUserOnLoad',
	async (_, { getState, rejectWithValue }) => {
		const token = (getState() as RootState).auth.token;
		if (!token) {
			return rejectWithValue('No token found');
		}
		try {
			const response = await axios.get(`${API_BASE_URL}/users/me`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (!response.data.user) throw new Error('User data not found in response');
			localStorage.setItem('authUser', JSON.stringify(response.data.user));
			return response.data.user;
		} catch (error) { // Type error as unknown
			console.error("Fetch User Error:", error);
			let message = 'Failed to fetch user profile';
			if (axios.isAxiosError(error)) {
				message = error.response?.data?.message || error.message;
			} else if (error instanceof Error) {
				message = error.message;
			}
			clearAuthStorage();
			return rejectWithValue(message);
		}
	}
);


// --- Auth Slice Definition ---
export const authSlice = createSlice({
	name: 'auth',
	initialState,
	// Synchronous reducers
	reducers: {
		logout: (state) => {
			clearAuthStorage(); // Clear localStorage
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			state.isLoading = false;
			state.error = null;
			console.log("Auth state cleared on logout.");
		},
		// Maybe a reducer to clear errors manually
		clearAuthError: (state) => {
			state.error = null;
		}
	},
	// Handle async thunk lifecycle actions
	extraReducers: (builder) => {
		builder
			// Login User
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
				state.isLoading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.error = null;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
				state.error = action.payload as string; // Error message from rejectWithValue
			})
			// Register User
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
				state.isLoading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.error = null;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
				state.error = action.payload as string;
			})
			// Fetch User On Load (Optional)
			.addCase(fetchUserOnLoad.pending, (state) => {
				// state.isLoading = true; // Indicate loading during initial check
				// No need to set isLoading = true if initialState is true
				// state.isLoading = true;
			})
			.addCase(fetchUserOnLoad.fulfilled, (state, action: PayloadAction<User>) => {
				state.isLoading = false;
				state.isAuthenticated = true;
				state.user = action.payload;
				// Token should already be in state from initialState if fetch succeeded
				state.error = null;
			})
			.addCase(fetchUserOnLoad.rejected, (state, action) => {
				state.isLoading = false; // Finished loading check
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
				// Optionally store the fetch error, or just log it
				// state.error = action.payload as string;
				console.error("fetchUserOnLoad rejected:", action.payload);
			});
	},
});

// Export actions
export const { logout, clearAuthError } = authSlice.actions;

// Export selectors
export const selectAuthState = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Export reducer
export default authSlice.reducer;