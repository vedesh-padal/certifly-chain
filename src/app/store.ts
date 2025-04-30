import { configureStore } from '@reduxjs/toolkit';
import issuanceReducer from '../features/issuance/issuanceSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
	reducer: {
		issuance: issuanceReducer,
		auth: authReducer,
	},
	devTools: process.env.NODE_ENV !== 'production',
});

// Types will be inferred correctly once the reducer is registered
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;