import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";

// --- Redux Imports ---
import { Provider, useDispatch } from 'react-redux';
import { store, AppDispatch } from './app/store';
import { fetchUserOnLoad } from './features/auth/authSlice'
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

	useEffect(() => {
		// Attempt to fetch user based on stored token on initial app load
		console.log("App.tsx: Dispatching fetchUserOnLoad on initial mount");
		dispatch(fetchUserOnLoad());
	}, [dispatch]);

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