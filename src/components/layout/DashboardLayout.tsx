import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// --- Redux Imports ---
import { useSelector } from 'react-redux'; // Added useDispatch
import {
	selectIsAuthenticated,
	selectCurrentUser,
	selectAuthIsLoading,
} from '@/features/auth/authSlice';
// --- End Redux Imports ---
import { Navbar } from '@/components/layout/Navbar';

interface DashboardLayoutProps {
	children: React.ReactNode;
	requiredRole?: 'issuer' | 'verifier';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
	children,
	requiredRole
}) => {
	// --- Redux State/Dispatch ---
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const user = useSelector(selectCurrentUser);
	// Use the loading state from authSlice, especially for initial load check
	const isLoading = useSelector(selectAuthIsLoading);
	// --- End Redux State/Dispatch ---

	const location = useLocation(); // Get current location

	// // --- Optional: Dispatch fetchUserOnLoad on mount if not already authenticated ---
	// // This verifies the token with the backend on initial load or refresh
	// useEffect(() => {
	// 	// Only run if not authenticated initially and not currently loading
	// 	// This prevents re-fetching if state is already good from localStorage init
	// 	// Or, you could always dispatch it and let the thunk handle token presence check
	// 	if (!isAuthenticated && !isLoading) {
	// 		console.log("DashboardLayout: Not authenticated, attempting fetchUserOnLoad");
	// 		dispatch(fetchUserOnLoad());
	// 	}
	// }, [dispatch, isAuthenticated, isLoading]); // Dependencies

	// --- Loading State ---
	// Show loading ONLY during the initial load phase managed by Redux
	if (isLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center bg-background dark:bg-background">
				<div className="flex flex-col items-center gap-4">
					<div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
					<p className="text-sm text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	// --- Authentication Check ---
	// If still not authenticated after loading/fetch attempt, redirect to login
	if (!isAuthenticated) {
		console.log("DashboardLayout: Not authenticated after check, redirecting to login.");
		// Store the intended path to redirect back after login
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// --- Role Check ---
	// Ensure user object exists before checking role
	if (requiredRole && (!user || user.role !== requiredRole)) {
		console.log(`DashboardLayout: Role mismatch (User: ${user?.role}, Required: ${requiredRole}), redirecting to dashboard.`);
		// User doesn't have the required role, redirect to general dashboard
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<div className="flex min-h-screen flex-col bg-background dark:bg-background">
			<Navbar />
			<main className="flex-1 pt-16">
				<div className="container mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
					{children}
				</div>
			</main>
			<footer className="border-t py-4 text-center text-sm text-muted-foreground">
				<div className="container mx-auto px-4">
					<p>© {new Date().getFullYear()} CertiChain. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
};
