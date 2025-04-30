// // src/app/store.ts
// import { configureStore } from '@reduxjs/toolkit';
// // Import the reducer from the slice file
// import issuanceReducer from '../features/issuance/issuanceSlice';
// // import authReducer from '../features/auth/authSlice'; // Keep placeholder for future auth slice

// export const store = configureStore({
// 	reducer: {
// 		// Register the issuance reducer under the 'issuance' key
// 		issuance: issuanceReducer,
// 		// auth: authReducer, // Add auth reducer later
// 		// Remove or keep placeholder if no other reducers yet
// 		// placeholder: (state = {}) => state,
// 	},
// 	// Optional: Configure middleware
// 	// middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
// 	// Optional: Enable Redux DevTools Extension integration
// 	devTools: process.env.NODE_ENV !== 'production',
// });

// // Infer the `RootState` and `AppDispatch` types from the store itself
// // RootState will now correctly include the 'issuance' state
// export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: { issuance: IssuanceState, auth?: AuthState }
// export type AppDispatch = typeof store.dispatch;

// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
// ---> 1. VERIFY THIS IMPORT PATH IS CORRECT <---
import issuanceReducer from '../features/issuance/issuanceSlice';
// import authReducer from '../features/auth/authSlice'; // Placeholder

export const store = configureStore({
	reducer: {
		// ---> 2. VERIFY THIS LINE EXISTS AND IS CORRECT <---
		issuance: issuanceReducer, // Key 'issuance', Value is the imported reducer

		// auth: authReducer, // Add later
		// Remove placeholder if 'issuance' is the only reducer now
	},
	devTools: process.env.NODE_ENV !== 'production',
});

// Types will be inferred correctly once the reducer is registered
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;