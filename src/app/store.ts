import { configureStore } from '@reduxjs/toolkit';
import issuanceReducer from '../features/issuance/issuanceSlice';
import authReducer from '../features/auth/authSlice';
import userSettingsReducer from '../features/user/userSlice';
import verificationReducer from '../features/verification/verificationSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
	reducer: {
		issuance: issuanceReducer,
		auth: authReducer,
		userSettings: userSettingsReducer,
		verification: verificationReducer,
		dashboard: dashboardReducer,
	},
	devTools: process.env.NODE_ENV !== 'production',
});

// Types will be inferred correctly once the reducer is registered
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;