// src/pages/Issue.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUp, Sheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// --- Redux Imports ---
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store'; // Import types from store
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
