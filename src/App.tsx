import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext"; // Keep AuthProvider for now
import { ThemeProvider } from "@/contexts/ThemeContext";

// --- Redux Imports ---
import { Provider } from 'react-redux'; // Import Provider
import { store } from './app/store'; // Import your configured store
// --- End Redux Imports ---

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Issue from "./pages/Issue";
import Verify from "./pages/Verify";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
	<Provider store={store}>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				{/* Keep existing providers */}
				<AuthProvider>
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
				</AuthProvider>
			</ThemeProvider>
		</QueryClientProvider>
	</Provider>
);

export default App;