import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { connectSocket, disconnectSocket } from './lib/socketService';

// --- Redux Imports ---
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, AppDispatch } from './app/store';
import { fetchUserOnLoad, selectIsAuthenticated, selectAuthToken } from './features/auth/authSlice'
// --- End Redux Imports ---

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Issue from "./pages/Issue";
import Verify from "./pages/Verify";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";


// Inner component to allow using dispatch hook
const AppContent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const queryClient = new QueryClient();
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const token = useSelector(selectAuthToken);

	useEffect(() => {
		// Attempt to fetch user based on stored token on initial app load
		console.log("App.tsx: Dispatching fetchUserOnLoad on initial mount");
		dispatch(fetchUserOnLoad());
	}, [dispatch]);

	// --- Effect for Socket Connection Management ---
	useEffect(() => {
		if (isAuthenticated && token) {
			console.log("App.tsx: User authenticated, connecting socket...");
			connectSocket(token); // Connect with the current token
		} else {
			console.log("App.tsx: User not authenticated, disconnecting socket...");
			disconnectSocket(); // Disconnect if not authenticated or no token
		}

		// Cleanup function for when component unmounts or dependencies change
		return () => {
			console.log("App.tsx: Cleaning up socket effect, disconnecting socket.");
			disconnectSocket();
		};
	}, [isAuthenticated, token]); // Re-run effect if auth status or token changes
	// --- End Socket Connection Management ---

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				{/* No AuthProvider needed */}
				<TooltipProvider>
					<Toaster />
					<Sonner />
					<BrowserRouter>
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/issue" element={<Issue />} />
							<Route path="/verify" element={<Verify />} />
							<Route path="/settings" element={<Settings />} />
							<Route path="/" element={<Login />} /> {/* Redirect root to login */}
							<Route path="*" element={<NotFound />} />
						</Routes>
					</BrowserRouter>
				</TooltipProvider>
			</ThemeProvider>
		</QueryClientProvider >
	);
}

const App = () => (
	<Provider store={store}>
		<AppContent />
	</Provider>
);

export default App;