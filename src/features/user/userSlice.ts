// src/features/user/userSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import type { RootState } from '../../app/store';
import { User } from '../../types'; // Import User type if needed for payload
// Import auth action to update user data globally after profile update
import { loginUser } from '../auth/authSlice'; // We can reuse loginUser.fulfilled logic

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface UserSettingsState {
	// Loading states for specific actions
	isProfileUpdating: boolean;
	isPasswordUpdating: boolean;
	isNotificationsUpdating: boolean;
	isEmailChangeInitiating: boolean; // If implementing email change fully
	// Error states for specific actions
	profileUpdateError: string | null;
	passwordUpdateError: string | null;
	notificationsUpdateError: string | null;
	emailChangeError: string | null; // If implementing email change fully
}

const initialState: UserSettingsState = {
	isProfileUpdating: false,
	isPasswordUpdating: false,
	isNotificationsUpdating: false,
	isEmailChangeInitiating: false,
	profileUpdateError: null,
	passwordUpdateError: null,
	notificationsUpdateError: null,
	emailChangeError: null,
};

// --- Helper to get token ---
// We need the token to make authenticated requests
const getToken = (getState: () => RootState): string | null => {
	return getState().auth.token;
};

// --- Async Thunks for Settings Updates ---

// Update Profile (Name, Organization)
export const updateUserProfile = createAsyncThunk(
	'user/updateProfile',
	async (profileData: { name?: string; organization?: string }, { getState, rejectWithValue, dispatch }) => {
		const token = getToken(getState as () => RootState);
		if (!token) return rejectWithValue('Not authenticated');
		try {
			const response = await axios.put(`${API_BASE_URL}/users/me/profile`, profileData, {
				headers: { Authorization: `Bearer ${token}` }
			});
			// Backend returns { message, user }
			if (response.data.user) {
				// Dispatch fulfilled action of loginUser to update user data globally
				// This avoids duplicating user update logic in multiple slices
				dispatch(loginUser.fulfilled({ user: response.data.user, token }, '', { usernameOrEmail: '', password: '' })); // Pass necessary payload
			}
			return response.data.message || 'Profile updated successfully'; // Return success message
		} catch (error) {
			const message = error instanceof AxiosError
				? error.response?.data?.message || error.message
				: error instanceof Error ? error.message : 'Failed to update profile';
			return rejectWithValue(message);
		}
	}
);

// Update Password
export const updateUserPassword = createAsyncThunk(
	'user/updatePassword',
	async (passwordData: { currentPassword: string; newPassword: string }, { getState, rejectWithValue }) => {
		const token = getToken(getState as () => RootState);
		if (!token) return rejectWithValue('Not authenticated');
		try {
			// Don't send confirmPassword, backend only needs current and new
			const payload = { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword };
			const response = await axios.put(`${API_BASE_URL}/users/me/password`, payload, {
				headers: { Authorization: `Bearer ${token}` }
			});
			// Backend returns { message }
			return response.data.message || 'Password updated successfully';
		} catch (error) {
			const message = error instanceof AxiosError
				? error.response?.data?.message || error.message
				: error instanceof Error ? error.message : 'Failed to update password';
			return rejectWithValue(message);
		}
	}
);

// Update Notification Preferences
export const updateUserNotifications = createAsyncThunk(
	'user/updateNotifications',
	async (prefsData: { issuance?: boolean; verification?: boolean; accountUpdates?: boolean }, { getState, rejectWithValue, dispatch }) => {
		const token = getToken(getState as () => RootState);
		if (!token) return rejectWithValue('Not authenticated');
		try {
			const response = await axios.put(`${API_BASE_URL}/users/me/notifications`, prefsData, {
				headers: { Authorization: `Bearer ${token}` }
			});
			// Backend returns { message, user }
			if (response.data.user) {
				// Dispatch fulfilled action of loginUser to update user data globally
				dispatch(loginUser.fulfilled({ user: response.data.user, token }, '', { usernameOrEmail: '', password: '' }));
			}
			return response.data.message || 'Notification settings updated';
		} catch (error) {
			const message = error instanceof AxiosError
				? error.response?.data?.message || error.message
				: error instanceof Error ? error.message : 'Failed to update notifications';
			return rejectWithValue(message);
		}
	}
);

// Placeholder for Email Change Thunk (if implementing fully later)
// export const initiateEmailChange = createAsyncThunk(...)


// --- User Slice Definition ---
export const userSlice = createSlice({
	name: 'userSettings', // Changed name to avoid conflict if we add user data here later
	initialState,
	reducers: {
		// Reducer to clear specific errors if needed
		clearProfileUpdateError: (state) => { state.profileUpdateError = null; },
		clearPasswordUpdateError: (state) => { state.passwordUpdateError = null; },
		clearNotificationsUpdateError: (state) => { state.notificationsUpdateError = null; },
		// clearEmailChangeError: (state) => { state.emailChangeError = null; },
	},
	extraReducers: (builder) => {
		builder
			// Update Profile
			.addCase(updateUserProfile.pending, (state) => {
				state.isProfileUpdating = true;
				state.profileUpdateError = null;
			})
			.addCase(updateUserProfile.fulfilled, (state) => {
				state.isProfileUpdating = false;
				// User data updated via authSlice.loginUser.fulfilled dispatch
			})
			.addCase(updateUserProfile.rejected, (state, action) => {
				state.isProfileUpdating = false;
				state.profileUpdateError = action.payload as string;
			})
			// Update Password
			.addCase(updateUserPassword.pending, (state) => {
				state.isPasswordUpdating = true;
				state.passwordUpdateError = null;
			})
			.addCase(updateUserPassword.fulfilled, (state) => {
				state.isPasswordUpdating = false;
				// No user data change needed here
			})
			.addCase(updateUserPassword.rejected, (state, action) => {
				state.isPasswordUpdating = false;
				state.passwordUpdateError = action.payload as string;
			})
			// Update Notifications
			.addCase(updateUserNotifications.pending, (state) => {
				state.isNotificationsUpdating = true;
				state.notificationsUpdateError = null;
			})
			.addCase(updateUserNotifications.fulfilled, (state) => {
				state.isNotificationsUpdating = false;
				// User data updated via authSlice.loginUser.fulfilled dispatch
			})
			.addCase(updateUserNotifications.rejected, (state, action) => {
				state.isNotificationsUpdating = false;
				state.notificationsUpdateError = action.payload as string;
			});
		// Add cases for initiateEmailChange if implemented
	},
});

// Export actions
export const {
	clearProfileUpdateError,
	clearPasswordUpdateError,
	clearNotificationsUpdateError,
	// clearEmailChangeError
} = userSlice.actions;

// Export selectors for loading/error states
export const selectUserSettingsState = (state: RootState) => state.userSettings;
export const selectIsProfileUpdating = (state: RootState) => state.userSettings.isProfileUpdating;
export const selectProfileUpdateError = (state: RootState) => state.userSettings.profileUpdateError;
// ... add selectors for other loading/error states ...
export const selectIsPasswordUpdating = (state: RootState) => state.userSettings.isPasswordUpdating;
export const selectPasswordUpdateError = (state: RootState) => state.userSettings.passwordUpdateError;
export const selectIsNotificationsUpdating = (state: RootState) => state.userSettings.isNotificationsUpdating;
export const selectNotificationsUpdateError = (state: RootState) => state.userSettings.notificationsUpdateError;


// Export reducer
export default userSlice.reducer;