// src/pages/Issue.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUp, Sheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUp, Sheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// --- Redux Imports ---
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store'; // Import types from store
import {
	// Import Actions
	setSingleFile,
	setSingleFormData,
	resetSingleIssueState,
	clearSingleResponse,
	setCsvFile,
	setGoogleDriveLink,
	clearPreviewData,
	resetBulkIssueState,
	updateTaskStatus, // Keep this for WebSocket handling later
	// Import Async Thunks
	submitSingleIssue,
	previewCsvFile,
	startIssuanceBatch,
	// Import Selectors (optional but clean)
	selectIssuanceState,
} from '@/features/issuance/issuanceSlice';
// --- End Redux Imports ---

// Import Sub-components
import { SingleIssueForm } from '@/components/issue/SingleIssueForm';
import { BulkIssueCsvUpload } from '@/components/issue/BulkIssueCsvUpload';
import { BulkIssuePreviewTable } from '@/components/issue/BulkIssuePreviewTable';
import { BatchProgressCard } from '@/components/issue/BatchProgressCard';
import { HowItWorksCard } from '@/components/issue/HowItWorksCard';
import { BulkGuideCard } from '@/components/issue/BulkGuideCard';

// Import Types
import { TrackedIssuanceTask, IssuanceStatusUpdatePayload, IssuanceState } from '@/types'; // Keep necessary types
import { ResponseBox } from '@/components/ui-custom/ResponseBox';

// --- Mock WebSocket Hook (Keep for now, will connect to Redux later) ---
// const useMockWebSocket = (
// 	isBatchStarted: boolean,
// 	batchId: string | null,
// 	initialPreviewDataLength: number, // Need length to simulate correct number
// 	dispatch: AppDispatch // Pass dispatch to the hook
// ) => {
// 	useEffect(() => {
// 		if (!isBatchStarted || !batchId || initialPreviewDataLength === 0) return;

// 		console.log("Setting up MOCK WebSocket listeners for batch:", batchId);
// 		const timeouts: NodeJS.Timeout[] = [];

// 		// Simulate receiving updates for each task based on length
// 		for (let i = 0; i < initialPreviewDataLength; i++) {
// 			const mockRollNo = `R${1000 + i}`; // Reconstruct Roll No assumption
// 			const taskId = `task_${batchId}_${mockRollNo}`; // Reconstruct taskId
// 			const delay = (i + 1) * 1500 + Math.random() * 1000;

// 			timeouts.push(setTimeout(() => {
// 				const isSuccess = Math.random() > 0.2;
// 				const updatePayload: IssuanceStatusUpdatePayload = {
// 					taskId: taskId,
// 					batchId: batchId,
// 					status: isSuccess ? 'success' : 'failed',
// 					message: isSuccess ? 'Mock: Issued successfully' : 'Mock: Failed transaction',
// 					rowData: { 'Roll No': mockRollNo, 'Recipient Name': `Mock Student ${i + 1}` },
// 					timestamp: new Date().toISOString(),
// 					txHash: isSuccess ? `0x${Math.random().toString(16).substring(2, 12)}` : undefined,
// 					hash: isSuccess ? `0x${Math.random().toString(16).substring(2, 66)}` : undefined,
// 					error: isSuccess ? undefined : 'Mock transaction rejected',
// 					walletAddress: isSuccess ? `0xWallet${i % 2}` : undefined,
// 				};
// 				console.log("Simulating WS message:", updatePayload);
// 				// Dispatch action to update Redux state
// 				dispatch(updateTaskStatus(updatePayload));
// 			}, delay));
// 		}

// 		return () => {
// 			console.log("Cleaning up MOCK WebSocket listeners for batch:", batchId);
// 			timeouts.forEach(clearTimeout);
// 		};
// 		// Depend on length instead of the full data array
// 	}, [isBatchStarted, batchId, initialPreviewDataLength, dispatch]);
// };
// --- End Mock WebSocket Hook ---


const Issue: React.FC = () => {
	const { toast } = useToast();
	// --- Redux State Access ---
	const dispatch = useDispatch<AppDispatch>();
	// Select the entire issuance state slice
	const issuanceState = useSelector(selectIssuanceState);
	// Destructure state for easier access (or use specific selectors)
	const {
		singleFile, singleFileName, singleFileType, singleFormData, singleResponseState, singleLastTaskId,
		csvFile, csvFileName, googleDriveLink, isPreviewLoading, previewData, previewError, hasPreviewRowErrors,
		isBatchStarting, isBatchStarted, startBatchError, currentBatchId, trackedTasks, batchProgress
	} = issuanceState;
	// --- End Redux State Access ---

	// --- TEMPORARY: Need local state for File objects ---
	// This is because File objects cannot/should not be stored in Redux.
	// We dispatch actions to store FileInfo (name, type, size) in Redux,
	// but keep the actual File object here temporarily to pass to API calls.
	// --- Local State ONLY for actual File objects ---
	const [singleFileObject, setSingleFileObject] = useState<File | null>(null);
	const [bulkCsvFileObject, setBulkCsvFileObject] = useState<File | null>(null);
	// --- End Local State ---

	// Local UI state (like active tab) can remain here
	const [activeTab, setActiveTab] = useState<string>("single");

	// --- Derived State ---
	// Calculate based on Redux state
	const isSingleFormComplete: boolean = !!(singleFile && singleFormData.recipientEmail && singleFormData.recipientName && singleFormData.certificateName);

	// Memoized array for the table - selects directly from Redux state now
	const trackedTasksArray = useMemo((): TrackedIssuanceTask[] => {
		if (previewData.length > 0 && !isBatchStarted) {
			// Create initial display structure from preview data
			return previewData.map((row): TrackedIssuanceTask => ({
				...row,
				taskId: null,
				batchId: null,
				status: row._validationError ? 'failed' : 'pending',
				message: row._validationError || 'Ready for batch start',
				lastUpdated: null,
				hash: null, txHash: null, error: row._validationError || null, walletAddress: null,
			}));
		}
		// Use the tracked tasks from Redux state when batch is started
		return Object.values(trackedTasks);
	}, [previewData, isBatchStarted, trackedTasks]);




	// --- Handlers Dispatching Redux Actions ---

	// // Single Issuance Handlers
	// const handleSingleFileSelect = useCallback((selectedFile: File | null) => {
	// 	dispatch(setSingleFile(selectedFile));
	// 	// Optional: Auto-populate name based on file (can be done via another action/logic if needed)
	// 	if (selectedFile) {
	// 		if (selectedFile.name.includes('degree')) dispatch(setSingleFormData({ field: 'certificateName', value: 'Bachelor of Science' }));
	// 		else if (selectedFile.name.includes('diploma')) dispatch(setSingleFormData({ field: 'certificateName', value: 'Diploma' }));
	// 		else dispatch(setSingleFormData({ field: 'certificateName', value: 'Certificate' }));
	// 	} else {
	// 		dispatch(setSingleFormData({ field: 'certificateName', value: '' }));
	// 	}
	// }, [dispatch]);

	// const handleSingleFormChange = useCallback((field: keyof IssuanceState['singleFormData'], value: string) => {
	// 	dispatch(setSingleFormData({ field, value }));
	// }, [dispatch]);




	// const handleSingleSubmit = useCallback(async (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	if (!isSingleFormComplete || !singleFile) return; // Check file info exists in state

	// 	// Create FormData for the API call (actual File object is not in Redux)
	// 	// We need access to the original File object, which we removed from Redux state.
	// 	// SOLUTION: Keep the actual File object in local component state temporarily,
	// 	// only store FileInfo in Redux. Or, pass the File object directly to the thunk.
	// 	// Let's modify the thunk to accept the File object directly for simplicity now.

	// 	const formData = new FormData();
	// 	// Retrieve the actual File object - Requires keeping it in local state *in addition* to Redux FileInfo
	// 	// ** This highlights a limitation/choice point: Keep File locally or handle upload differently **
	// 	// For now, let's assume we *do* keep singleFileObject locally:
	// 	// --- TEMPORARY LOCAL STATE FOR FILE OBJECT ---
	// 	const [singleFileObject, setSingleFileObject] = useState<File | null>(null);
	// 	const handleSingleFileSelectRedux = useCallback((selectedFile: File | null) => {
	// 		dispatch(setSingleFile(selectedFile)); // Update Redux with FileInfo
	// 		setSingleFileObject(selectedFile); // Keep actual File locally
	// 		// ... auto-populate name logic ...
	// 	}, [dispatch]);

	// const handleSingleSubmit = useCallback(async (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	// Use Redux state for check, but local state for file object
	// 	if (!isSingleFormComplete || !singleFileObject) {
	// 		toast({ title: 'Error', description: 'Please complete the form and select a file.', variant: 'destructive' });
	// 		return;
	// 	}
	// 	const formData = new FormData();
	// 	formData.append('certificate', singleFileObject);
	// 	formData.append('recipientName', singleFormData.recipientName);
	// 	formData.append('recipientEmail', singleFormData.recipientEmail);
	// 	formData.append('certificateName', singleFormData.certificateName);

	// 	const resultAction = await dispatch(submitSingleIssue({ formData }));

	// 	if (submitSingleIssue.rejected.match(resultAction)) {
	// 		toast({ title: 'Queueing Failed', description: resultAction.payload as string, variant: 'destructive' });
	// 	} else if (submitSingleIssue.fulfilled.match(resultAction)) {
	// 		toast({ title: 'Success', description: `Certificate queued (Task ID: ${resultAction.payload.taskId})` });
	// 		setSingleFileObject(null); // Reset local file state
	// 		dispatch(resetSingleIssueState());
	// 	}
	// }, [isSingleFormComplete, singleFileObject, singleFormData, dispatch, toast]); // Added dispatch, singleFileObject, singleFormData


	// 	// --- END TEMPORARY LOCAL STATE ---

	// 	if (!singleFileObject) {
	// 		toast({ title: 'Error', description: 'File not available for submission.', variant: 'destructive' });
	// 		return;
	// 	}

	// 	formData.append('certificate', singleFileObject); // Append the actual file
	// 	formData.append('recipientName', singleFormData.recipientName);
	// 	formData.append('recipientEmail', singleFormData.recipientEmail);
	// 	formData.append('certificateName', singleFormData.certificateName);

	// 	// Dispatch the async thunk
	// 	const resultAction = await dispatch(submitSingleIssue({ formData }));

	// 	// Handle potential rejection explicitly (optional, extraReducers handle state)
	// 	if (submitSingleIssue.rejected.match(resultAction)) {
	// 		toast({ title: 'Queueing Failed', description: resultAction.payload as string, variant: 'destructive' });
	// 	} else if (submitSingleIssue.fulfilled.match(resultAction)) {
	// 		toast({ title: 'Success', description: `Certificate queued (Task ID: ${resultAction.payload.taskId})` });
	// 		// Reset local file state after successful queuing
	// 		setSingleFileObject(null);
	// 		// Reset Redux form state
	// 		dispatch(resetSingleIssueState()); // Reset Redux state including file info
	// 	}
	// }, [dispatch, isSingleFormComplete, singleFileObject, singleFormData, toast]); // Add singleFileObject dependency


	// // Bulk Issuance Handlers
	// const handleBulkCsvSelect = useCallback((selectedFile: File | null) => {
	// 	dispatch(setCsvFile(selectedFile)); // Dispatch action to update Redux state
	// }, [dispatch]);

	// const handleBulkDriveLinkChange = useCallback((value: string) => {
	// 	dispatch(setGoogleDriveLink(value));
	// }, [dispatch]);

	// const handleBulkPreview = useCallback(async () => {
	// 	if (!csvFile) return; // Check Redux state for file info

	// 	// Need the actual File object for the API call
	// 	// --- TEMPORARY LOCAL STATE FOR CSV FILE OBJECT ---
	// 	const [bulkCsvFileObject, setBulkCsvFileObject] = useState<File | null>(null);
	// 	const handleBulkCsvSelectRedux = useCallback((selectedFile: File | null) => {
	// 		dispatch(setCsvFile(selectedFile)); // Update Redux with FileInfo
	// 		setBulkCsvFileObject(selectedFile); // Keep actual File locally
	// 	}, [dispatch]);
	// 	// --- END TEMPORARY LOCAL STATE ---

	// 	if (!bulkCsvFileObject) {
	// 		toast({ title: 'Error', description: 'CSV File not available for preview.', variant: 'destructive' });
	// 		return;
	// 	}

	// 	const formData = new FormData();
	// 	formData.append('csvFile', bulkCsvFileObject);
	// 	// Optionally send drive link during preview if backend needs it?
	// 	// formData.append('folderLink', googleDriveLink);

	// 	// Dispatch the async thunk
	// 	const resultAction = await dispatch(previewCsvFile(formData));

	// 	if (previewCsvFile.rejected.match(resultAction)) {
	// 		toast({ title: 'Preview Error', description: resultAction.payload as string, variant: 'destructive' });
	// 	} else if (previewCsvFile.fulfilled.match(resultAction)) {
	// 		toast({ title: 'Preview Ready', description: `${resultAction.payload.data.length} records loaded.` });
	// 	}
	// }, [dispatch, csvFile, bulkCsvFileObject, toast]); // Add bulkCsvFileObject dependency

	// const handleBulkStart = useCallback(async () => {
	// 	if (previewData.length === 0 || hasPreviewRowErrors) {
	// 		toast({ title: 'Error', description: 'Cannot start batch. Please preview a valid CSV first.', variant: 'destructive' });
	// 		return;
	// 	}
	// 	// Dispatch the async thunk
	// 	const resultAction = await dispatch(startIssuanceBatch({
	// 		batchData: previewData, // Use previewData from Redux state
	// 		folderLink: googleDriveLink, // Use drive link from Redux state
	// 		fileName: csvFileName || undefined // Use file name from Redux state
	// 	}));

	// 	if (startIssuanceBatch.rejected.match(resultAction)) {
	// 		toast({ title: 'Batch Start Error', description: resultAction.payload as string, variant: 'destructive' });
	// 	} else if (startIssuanceBatch.fulfilled.match(resultAction)) {
	// 		toast({ title: 'Batch Started', description: `${previewData.length} certificates queued.` });
	// 		// No need to simulate WS updates here, the hook/real listener will handle it
	// 	}
	// }, [dispatch, previewData, googleDriveLink, csvFileName, hasPreviewRowErrors, toast]);

	// const handleBulkReset = useCallback(() => {
	// 	dispatch(resetBulkIssueState());
	// 	// Also reset local file state if used
	// 	setBulkCsvFileObject(null);
	// }, [dispatch]);

	// ==========================================================
	// code that avoid TS errors:  -- START

	// --- Handlers ---
	const handleSingleFileSelectRedux = useCallback((selectedFile: File | null) => {
		dispatch(setSingleFile(selectedFile));
		setSingleFileObject(selectedFile); // Keep actual File locally
		if (selectedFile) {
			if (selectedFile.name.includes('degree')) dispatch(setSingleFormData({ field: 'certificateName', value: 'Bachelor of Science' }));
			else if (selectedFile.name.includes('diploma')) dispatch(setSingleFormData({ field: 'certificateName', value: 'Diploma' }));
			else dispatch(setSingleFormData({ field: 'certificateName', value: 'Certificate' }));
		} else {
			dispatch(setSingleFormData({ field: 'certificateName', value: '' }));
		}
	}, [dispatch]); // Removed dispatch from deps array

	const handleSingleFormChange = useCallback((field: keyof IssuanceState['singleFormData'], value: string) => {
		dispatch(setSingleFormData({ field, value }));
	}, [dispatch]); // Removed dispatch from deps array

	const handleSingleSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		// Use Redux state for check, but local state for file object
		if (!isSingleFormComplete || !singleFileObject) {
			toast({ title: 'Error', description: 'Please complete the form and select a file.', variant: 'destructive' });
			return;
		}
		const formData = new FormData();
		formData.append('certificate', singleFileObject);
		formData.append('recipientName', singleFormData.recipientName);
		formData.append('recipientEmail', singleFormData.recipientEmail);
		formData.append('certificateName', singleFormData.certificateName);

		// *** FIX: Wrap formData in an object ***
		const resultAction = await dispatch(submitSingleIssue({ formData: formData }));

		if (submitSingleIssue.rejected.match(resultAction)) {
			toast({ title: 'Queueing Failed', description: resultAction.payload as string, variant: 'destructive' });
		} else if (submitSingleIssue.fulfilled.match(resultAction)) {
			toast({ title: 'Success', description: `Certificate queued (Task ID: ${resultAction.payload.taskId})` });
			setSingleFileObject(null); // Reset local file state
			// dispatch(resetSingleIssueState());
		}
	}, [isSingleFormComplete, singleFileObject, singleFormData, dispatch, toast]); // Added dispatch, singleFileObject, singleFormData


	const handleBulkCsvSelectRedux = useCallback((selectedFile: File | null) => {
		dispatch(setCsvFile(selectedFile));
		setBulkCsvFileObject(selectedFile); // Keep actual File locally
	}, [dispatch]); // Removed dispatch

	const handleBulkDriveLinkChange = useCallback((value: string) => {
		dispatch(setGoogleDriveLink(value));
	}, [dispatch]); // Removed dispatch

	const handleBulkPreview = useCallback(async () => {
		// Use Redux state for check, local state for file object
		if (!csvFile || !bulkCsvFileObject) {
			toast({ title: 'Error', description: 'Please select a CSV file.', variant: 'destructive' });
			return;
		}
		const formData = new FormData();
		formData.append('csvFile', bulkCsvFileObject);

		// *** FIX: Wrap formData in an object ***
		const resultAction = await dispatch(previewCsvFile({ formData: formData }));

		if (previewCsvFile.rejected.match(resultAction)) {
			toast({ title: 'Preview Error', description: resultAction.payload as string, variant: 'destructive' });
		} else if (previewCsvFile.fulfilled.match(resultAction)) {
			toast({ title: 'Preview Ready', description: `${resultAction.payload.data.length} records loaded.` });
		}
	}, [csvFile, bulkCsvFileObject, dispatch, toast]); // Added csvFile, bulkCsvFileObject, dispatch

	const handleBulkStart = useCallback(async () => {
		// Read state from Redux
		if (previewData.length === 0 || hasPreviewRowErrors) {
			toast({ title: 'Error', description: 'Cannot start batch. Please preview a valid CSV first.', variant: 'destructive' });
			return;
		}
		const resultAction = await dispatch(startIssuanceBatch({
			batchData: previewData,
			folderLink: googleDriveLink,
			fileName: csvFileName || undefined
		}));

		if (startIssuanceBatch.rejected.match(resultAction)) {
			toast({ title: 'Batch Start Error', description: resultAction.payload as string, variant: 'destructive' });
		} else if (startIssuanceBatch.fulfilled.match(resultAction)) {
			toast({ title: 'Batch Started', description: `${previewData.length} certificates queued.` });
		}
	}, [previewData, hasPreviewRowErrors, googleDriveLink, csvFileName, dispatch, toast]); // Added dependencies

	const handleBulkReset = useCallback(() => {
		dispatch(resetBulkIssueState());
		setBulkCsvFileObject(null); // Reset local file state
	}, [dispatch]); // Removed dispatch


	// ==========================================================
	// code that avoid TS errors:  -- START

	// --- Mock WebSocket Hook Setup ---
	// Pass previewData.length for simulation count
	// We pass dispatch so the hook can dispatch 'updateTaskStatus'
	// Note: This mock hook should be removed when real WebSockets are implemented
	// useMockWebSocket(isBatchStarted, currentBatchId, previewData.length, dispatch);
	// --- End Mock WebSocket Hook Setup ---


	// // Update local file object when Redux file info changes (e.g., on reset)
	// useEffect(() => { if (!singleFile) setSingleFileObject(null); }, [singleFile]);
	// useEffect(() => { if (!csvFile) setBulkCsvFileObject(null); }, [csvFile]);

	// // Modified file select handlers to update both Redux and local state
	// const handleSingleFileSelectRedux = useCallback((selectedFile: File | null) => {
	// 	dispatch(setSingleFile(selectedFile)); // Update Redux with FileInfo
	// 	setSingleFileObject(selectedFile); // Keep actual File locally
	// 	if (selectedFile) {
	// 		if (selectedFile.name.includes('degree')) dispatch(setSingleFormData({ field: 'certificateName', value: 'Bachelor of Science' }));
	// 		else if (selectedFile.name.includes('diploma')) dispatch(setSingleFormData({ field: 'certificateName', value: 'Diploma' }));
	// 		else dispatch(setSingleFormData({ field: 'certificateName', value: 'Certificate' }));
	// 	} else {
	// 		dispatch(setSingleFormData({ field: 'certificateName', value: '' }));
	// 	}
	// }, [dispatch]);

	// const handleBulkCsvSelectRedux = useCallback((selectedFile: File | null) => {
	// 	dispatch(setCsvFile(selectedFile)); // Update Redux with FileInfo
	// 	setBulkCsvFileObject(selectedFile); // Keep actual File locally
	// }, [dispatch]);
	// // --- END TEMPORARY LOCAL STATE ---


	return (
		<DashboardLayout requiredRole="issuer">
			<div className="flex flex-col gap-8">
				{/* Header */}
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold tracking-tight">Issue Certificate</h1>
					<p className="text-muted-foreground">
						Upload certificates to be hashed and stored on the blockchain
					</p>
				</div>

				{/* Tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="mb-6">
						{/* ... TabsTrigger ... */}
						<TabsTrigger value="single" className="flex items-center gap-2">
							<FileUp className="h-4 w-4" />
							<span>Single Certificate</span>
						</TabsTrigger>
						<TabsTrigger value="bulk" className="flex items-center gap-2">
							<Sheet className="h-4 w-4" />
							<span>Bulk Issue via CSV</span>
						</TabsTrigger>
					</TabsList>

					{/* Single Tab Content */}
					<TabsContent value="single" className="space-y-8">
						{/* Pass Redux state and dispatch actions via handlers */}
						<SingleIssueForm
							// Read state via useSelector results
							fileInfo={singleFile} // Pass FileInfo or null
							recipientEmail={singleFormData.recipientEmail}
							recipientName={singleFormData.recipientName}
							certificateName={singleFormData.certificateName}
							response={singleResponseState}
							isFormComplete={isSingleFormComplete}
							// Pass handlers that dispatch actions or manage local file state
							onFileSelect={handleSingleFileSelectRedux} // Use modified handler
							onRecipientEmailChange={(value) => handleSingleFormChange('recipientEmail', value)}
							onRecipientNameChange={(value) => handleSingleFormChange('recipientName', value)}
							onCertificateNameChange={(value) => handleSingleFormChange('certificateName', value)}
							onSubmit={handleSingleSubmit}
						/>
					</TabsContent>

					{/* Bulk Tab Content */}
					<TabsContent value="bulk" className="space-y-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Column 1 */}
							<div className="flex flex-col gap-6">
								<BulkIssueCsvUpload
									csvFileInfo={csvFile} // Pass FileInfo or null
									googleDriveLink={googleDriveLink}
									isPreviewLoading={isPreviewLoading}
									onCsvFileSelect={handleBulkCsvSelectRedux} // Use modified handler
									onGoogleDriveLinkChange={(value) => dispatch(setGoogleDriveLink(value))}
									onPreviewCsv={handleBulkPreview}
								/>

								{/* Use Redux state for conditional rendering and props */}
								{previewData.length > 0 && csvFile && ( // Check previewData length from Redux
									<BulkIssuePreviewTable
										tasks={trackedTasksArray} // Use memoized array from Redux state
										csvFileName={csvFileName || 'Unknown'} // Use name from Redux state
										isBatchStarted={isBatchStarted}
										isBatchProcessing={isBatchStarting} // Use correct loading state
										batchProgress={batchProgress}
										hasPreviewRowErrors={hasPreviewRowErrors}
										onStartBatch={handleBulkStart} // Use handler that dispatches thunk
										onResetBatch={handleBulkReset} // Use handler that dispatches action
									/>
								)}
							</div>

							{/* Column 2 */}
							<div className="flex flex-col gap-6">
								{/* Use Redux state for conditional rendering */}
								{(isBatchStarting || startBatchError) && ( // Show response for start API call
									<ResponseBox
										isLoading={isBatchStarting}
										isSuccess={false} // Not applicable here, use specific message
										isError={!!startBatchError}
										message={startBatchError || "Initiating batch..."} // Show error or loading message
										title={isBatchStarting ? "Starting Batch..." : "Batch Start Failed"}
									/>
								)}

								{isBatchStarted && ( // Show progress card if batch is active
									<BatchProgressCard
										batchId={currentBatchId}
										batchProgress={batchProgress}
									/>
								)}

								<BulkGuideCard />
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</DashboardLayout>
	);
};

export default Issue;
