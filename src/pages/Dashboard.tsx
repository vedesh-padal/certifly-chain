import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CertificateCard } from '@/components/ui-custom/CertificateCard';
import { Certificate } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileCheck, Shield, Upload, Search, Scan, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// --- Import Shadcn Pagination Components ---
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
// --- End Pagination Imports ---

// --- Redux Imports ---
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { selectCurrentUser } from '@/features/auth/authSlice';
import {
	fetchIssuedCertificates,
	selectIssuedCertificates,
	selectDashboardIsLoading,
	selectDashboardError,
	selectDashboardPagination,
	clearDashboardError, // Action to clear error
	resetDashboardState, // Action to reset on logout/role change
	selectSearchQuery,
	setSearchQuery
} from '@/features/dashboard/dashboardSlice';
// --- End Redux Imports ---

import { CertificateMetadataFromDB } from '@/features/dashboard/dashboardSlice';	// interface for the DB props

const Dashboard: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { toast } = useToast();

	// --- Get State from Redux ---
	const currentUser = useSelector(selectCurrentUser);
	console.log("Dashboard rendering, currentUser:", currentUser);
	const issuedCertificates = useSelector(selectIssuedCertificates);
	const isLoading = useSelector(selectDashboardIsLoading); // Dashboard specific loading
	const dashboardError = useSelector(selectDashboardError);
	const { currentPage, totalPages, totalCount } = useSelector(selectDashboardPagination); // Destructure
	const currentSearchQuery = useSelector(selectSearchQuery); // Get search query from Redux
	// --- End Redux State ---

	// --- Local state for the search input field ---
	const [searchInput, setSearchInput] = useState('');

	// --- Effect to sync local search input with Redux state (e.g., on load/clear) ---
	useEffect(() => {
		setSearchInput(currentSearchQuery);
	}, [currentSearchQuery]);


	// --- Effect to fetch certificates for issuers ---
	useEffect(() => {
		if (currentUser?.role === 'issuer') {
			// Fetch will use currentSearchQuery from Redux state
			dispatch(fetchIssuedCertificates({ page: currentPage /*, query: currentSearchQuery */ }));
			// The thunk now reads searchQuery from state if args.query is undefined
		} else {
			dispatch(resetDashboardState());
		}

		// Removed cleanup for resetDashboardState to persist data on tab switch if desired
		// // Cleanup on unmount or when user changes (e.g., logout)
		// return () => {
		// 	dispatch(resetDashboardState());
		// };
	}, [dispatch, currentUser?.id, currentUser?.role, currentPage]); // Removed currentSearchQuery, thunk reads it

	// --- Effect to show error toasts for dashboard data fetching ---
	useEffect(() => {
		if (dashboardError) {
			toast({
				title: 'Error Fetching Dashboard Data',
				description: dashboardError,
				variant: 'destructive',
			});
			dispatch(clearDashboardError()); // Clear error after showing
		}
	}, [dashboardError, dispatch, toast]);


	const getActionButton = () => {
		if (!currentUser) return null;
		if (currentUser.role === 'issuer') {
			return (
				<Button asChild>
					<Link to="/issue" className="flex items-center gap-2">
						<Upload className="h-4 w-4" />
						Issue Certificate
					</Link>
				</Button>
			);
		} else { // Verifier
			return (
				<Button asChild>
					<Link to="/verify" className="flex items-center gap-2">
						<Shield className="h-4 w-4" />
						Verify Certificate
					</Link>
				</Button>
			);
		}
	};

	// --- Effect to fetch certificates (primarily for initial load and page changes) ---
	useEffect(() => {
		if (currentUser?.role === 'issuer') {
			// This effect now primarily handles initial load and pagination clicks
			// It will also run if currentSearchQuery changes due to external factors, which is fine.
			console.log("Dashboard: useEffect fetching. Page:", currentPage, "Query:", currentSearchQuery);
			dispatch(fetchIssuedCertificates({ page: currentPage, query: currentSearchQuery }));
		} else {
			dispatch(resetDashboardState());
		}
	}, [dispatch, currentUser?.id, currentUser?.role, currentPage, currentSearchQuery]); // Keep currentSearchQuery here too

	const handleSearchSubmit = useCallback((e?: React.FormEvent<HTMLFormElement>) => {
		e?.preventDefault();
		// First, update the searchQuery in Redux state and reset page to 1
		dispatch(setSearchQuery(searchInput));
		// Then, explicitly dispatch the fetch with the new search query
		// Note: setSearchQuery already resets currentPage to 1 in the reducer.
		console.log("Dashboard: handleSearchSubmit dispatching fetch with query:", searchInput);
		dispatch(fetchIssuedCertificates({ query: searchInput, page: 1 }));
	}, [dispatch, searchInput]);
	const handleRefresh = () => {
		if (currentUser?.role === 'issuer') {
			dispatch(fetchIssuedCertificates({ page: currentPage }));
		}
	};

	// ---  Handler for page change ---
	const handlePageChange = useCallback((newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages && currentUser?.role === 'issuer') {
			// Dispatch fetch for the new page
			// The useEffect above will also trigger due to currentPage change if we store it in Redux,
			// but dispatching directly here is more explicit for user action.
			// For now, we'll rely on the useEffect to re-fetch when currentPage changes.
			// To make this work, we need to update currentPage in Redux state.
			// Let's add an action to dashboardSlice for this or handle it in fetch.fulfilled.
			// For simplicity now, let's assume fetchIssuedCertificates.fulfilled updates currentPage.
			// The current fetchIssuedCertificates.fulfilled ALREADY updates currentPage.
			dispatch(fetchIssuedCertificates({ page: newPage }));
		}
	}, [dispatch, totalPages, currentUser?.role]);

	// // Let's ensure the main return of Dashboard also checks for currentUser before rendering content that depends on it.
	// if (!currentUser) {
	// 	// This should ideally be caught by DashboardLayout's loading/auth check
	// 	// If DashboardLayout is working correctly, currentUser should be populated here.
	// 	console.log("Dashboard: currentUser is null, rendering minimal or nothing.");
	// 	return (
	// 		<DashboardLayout>
	// 			<div>Loading user data or redirecting...</div>
	// 		</DashboardLayout>
	// 	);
	// }

	// --- Function to render pagination items (helper for complex logic) ---
	const renderPaginationItems = () => {
		if (!totalPages || totalPages <= 1) return null;

		const items = [];
		const maxPagesToShow = 5; // Max page numbers to show directly
		const ellipsis = <PaginationItem key="ellipsis-item"><PaginationEllipsis /></PaginationItem>;

		// Previous Button
		items.push(
			<PaginationItem key="prev">
				<PaginationPrevious
					href="#" // Prevent page reload, handle click
					onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
					className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
				/>
			</PaginationItem>
		);

		if (totalPages <= maxPagesToShow + 2) { // Show all pages if not too many
			for (let i = 1; i <= totalPages; i++) {
				items.push(
					<PaginationItem key={i}>
						<PaginationLink
							href="#"
							onClick={(e) => { e.preventDefault(); handlePageChange(i); }}
							isActive={currentPage === i}
						>
							{i}
						</PaginationLink>
					</PaginationItem>
				);
			}
		} else {
			// Show first page
			items.push(
				<PaginationItem key={1}>
					<PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }} isActive={currentPage === 1}>1</PaginationLink>
				</PaginationItem>
			);

			// Ellipsis after first page if needed
			if (currentPage > maxPagesToShow - 2) {
				items.push(React.cloneElement(ellipsis, { key: "start-ellipsis" }));
			}

			// Middle pages
			let startPage = Math.max(2, currentPage - Math.floor((maxPagesToShow - 2) / 2));
			let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);

			if (currentPage < maxPagesToShow - 1) {
				endPage = Math.min(totalPages - 1, maxPagesToShow - 1)
			}
			if (currentPage > totalPages - (maxPagesToShow - 2)) {
				startPage = Math.max(2, totalPages - (maxPagesToShow - 2))
			}


			for (let i = startPage; i <= endPage; i++) {
				items.push(
					<PaginationItem key={i}>
						<PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i); }} isActive={currentPage === i}>{i}</PaginationLink>
					</PaginationItem>
				);
			}

			// Ellipsis before last page if needed
			if (currentPage < totalPages - (maxPagesToShow - 2)) {
				items.push(React.cloneElement(ellipsis, { key: "end-ellipsis" }));
			}

			// Show last page
			items.push(
				<PaginationItem key={totalPages}>
					<PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }} isActive={currentPage === totalPages}>{totalPages}</PaginationLink>
				</PaginationItem>
			);
		}

		// Next Button
		items.push(
			<PaginationItem key="next">
				<PaginationNext
					href="#"
					onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
					className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
				/>
			</PaginationItem>
		);
		return items;
	};


	if (!currentUser && !isLoading) { // If still no user after initial loading from authSlice
		console.log("Dashboard: currentUser is null and not loading auth, redirecting (should be handled by Layout).");
		// DashboardLayout should handle the redirect. This is a fallback.
		// To prevent rendering anything, you could return null or a minimal loader.
		return null;
	}
	if (!currentUser && isLoading) { // If auth is still loading
		return (
			<DashboardLayout>
				<div>Loading user session...</div>
			</DashboardLayout>
		)
	}


	return (
		<DashboardLayout>
			<div className="flex flex-col gap-8">
				{/* Header */}
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<h1 className="text-3xl font-bold tracking-tight">
							{currentUser?.role === 'issuer' ? 'Issuer Dashboard' : 'Verifier Dashboard'}
						</h1>
						<p className="text-muted-foreground">
							{currentUser?.role === 'issuer'
								? 'Issue and manage blockchain-verified certificates'
								: 'Verify the authenticity of certificates on the blockchain'}
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-4">
						{getActionButton()}
						<Button variant="outline" asChild>
							<Link to="/settings" className="flex items-center gap-2">
								View Profile
							</Link>
						</Button>
					</div>
				</div>

				{/* Certificate List Section (Only for Issuers for now) */}
				{currentUser?.role === 'issuer' && (
					<div className="glass-card p-6 rounded-lg">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold">Recent Certificates Issued</h2>

							{/* --- Search Form --- */}
							<form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
								<Input
									type="search"
									placeholder="Search by name, email, cert, hash..."
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									className="h-9 w-full sm:w-64"
								/>
								<Button type="submit" variant="ghost" size="icon" className="h-9 w-9" disabled={isLoading}>
									<Search className="h-4 w-4" />
								</Button>
								<Button type="button" variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading} className="flex items-center gap-1 h-9">
									<RefreshCw className={`h-4 w-4 ${isLoading && currentSearchQuery === searchInput ? 'animate-spin' : ''}`} />
									<span className="hidden sm:inline">Refresh</span>
								</Button>
							</form>
							{/* --- End Search Form --- */}

							{/* removed placeholder refresh, search previous */}
						</div>

						{isLoading && issuedCertificates.length === 0 ? ( // Show loading only if no data yet
							<div className="flex flex-col items-center justify-center py-12">
								<div className="h-10 w-10 animate-spin rounded-full border-4 border-muted-foreground/20 border-t-primary mb-4" />
								<p className="text-sm text-muted-foreground">Loading certificates...</p>
							</div>
						) : !isLoading && issuedCertificates.length === 0 ? (
							<div className="text-center py-12">
								<div className="flex justify-center mb-4">
									<div className="p-4 rounded-full bg-muted">
										<FileCheck className="h-8 w-8 text-muted-foreground" />
									</div>
								</div>
								<h3 className="text-lg font-medium mb-1">No certificates issued yet</h3>
								<p className="text-sm text-muted-foreground mb-4">
									You haven't issued any certificates.
								</p>
								{getActionButton()}
							</div>
						) : (
							// --- SCROLLABLE GRID OF RECENT ISSUED CERTIFICATES ---
							<div
								className="overflow-y-auto pr-2 custom-scrollbar" // Allow vertical scrolling, padding for scrollbar
								// Set a max-height. Adjust this value to show ~1.5 rows initially.
								// The exact value depends on your CertificateCard's height and gap.
								// Example: If a card + gap is ~200px, 1.5 rows is ~300px.
								// For a more dynamic approach, you might need JS, but fixed height is simpler.
								style={{ maxHeight: 'calc(20rem + 4rem)' }} // Approx height for 1.5 rows of cards + some gap
							// Example for a fixed pixel height: style={{ maxHeight: '550px' }}
							>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
									{issuedCertificates.map((cert: CertificateMetadataFromDB) => {
										const cardProps: Certificate = {
											id: cert._id || cert.id || cert.hash,
											name: cert.certificateName,
											recipientName: cert.recipientName,
											recipientEmail: cert.recipientEmail,
											issuerId: cert.issuerId,
											issuerName: cert.issuerName,
											issueDate: new Date(cert.issueDate).toLocaleDateString(),
											hash: cert.hash,
											verified: cert.status === 'issued'
										};
										return <CertificateCard key={cardProps.id} certificate={cardProps} />;
									})}
								</div>
							</div>
							// --- END MODIFICATION ---
						)}
						{totalPages > 1 && (
							<Pagination className="mt-8">
								<PaginationContent>
									{renderPaginationItems()}
								</PaginationContent>
							</Pagination>
						)}
						{/* --- End Pagination Controls --- */}
					</div>
				)}

				{/* Verifier Dashboard Content (Keep simple for now) */}
				{currentUser?.role === 'verifier' && (
					<div className="glass-card p-6 rounded-lg text-center">
						<Shield className="h-12 w-12 text-primary mx-auto mb-4" />
						<h2 className="text-xl font-semibold mb-2">Ready to Verify?</h2>
						<p className="text-muted-foreground mb-6">Upload a certificate to check its authenticity on the blockchain.</p>
						{getActionButton()}
					</div>
				)}


				{/* CAN COMPLETELY REMOVE THIS QUICK ACTIONS COMPONENT ACTUALLY */}
				<div className="glass-card p-6 rounded-lg">
					<h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
					{/* Adjust grid to be md:grid-cols-2 if only two items, or keep as is and let them space out */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Button variant="outline" className="h-auto flex flex-col items-center justify-center p-6 gap-3" asChild>
							<Link to={currentUser?.role === 'issuer' ? '/issue' : '/verify'}>
								{currentUser?.role === 'issuer' ? (
									<> <Upload className="h-6 w-6" /> <span>Issue Certificate</span> </>
								) : (
									<> <Shield className="h-6 w-6" /> <span>Verify Certificate</span> </>
								)}
							</Link>
						</Button>
						<Button variant="outline" className="h-auto flex flex-col items-center justify-center p-6 gap-3" disabled> {/* Disabled Search for now */}
							{/* <Link to="#"> // Link removed as it's disabled */}
							<Search className="h-6 w-6" />
							<span>Search Certificates</span>
							{/* </Link> */}
						</Button>
						{/* <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-6 gap-3" asChild>
							<Link to="#">
								<Scan className="h-6 w-6" />
								<span>Scan QR Code</span>
							</Link>
						</Button> */}
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default Dashboard;
