// src/pages/Issue.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUp, Sheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import the new sub-components
import { SingleIssueForm } from '@/components/issue/SingleIssueForm';
import { BulkIssueCsvUpload } from '@/components/issue/BulkIssueCsvUpload';
import { BulkIssuePreviewTable } from '@/components/issue/BulkIssuePreviewTable';
import { BatchProgressCard } from '@/components/issue/BatchProgressCard';
import { HowItWorksCard } from '@/components/issue/HowItWorksCard';
import { BulkGuideCard } from '@/components/issue/BulkGuideCard';

// Import types (assuming they are now centralized)
import { ResponseState, CsvRowData, TrackedIssuanceTask, IssuanceStatusUpdatePayload, BatchProgress, IssuanceJobStatus } from '@/types';
import { ResponseBox } from '@/components/ui-custom/ResponseBox';

// Mock WebSocket listener setup (replace with actual implementation later)
const useMockWebSocket = (
	isBatchStarted: boolean,
	batchId: string | null,
	initialPreviewData: CsvRowData[], // Use CsvRowData for initial state
	setTasks: React.Dispatch<React.SetStateAction<{ [taskId: string]: TrackedIssuanceTask }>>,
	setBatchProgress: React.Dispatch<React.SetStateAction<BatchProgress>>
) => {
	useEffect(() => {
		if (!isBatchStarted || !batchId || initialPreviewData.length === 0) {
			return; // Don't simulate if batch not started or no data
		}

		console.log("Setting up MOCK WebSocket listeners for batch:", batchId);
		const timeouts: NodeJS.Timeout[] = [];

		// Simulate receiving updates for each task
		initialPreviewData.forEach((row, index) => {
			// Generate the taskId the same way the backend does for correlation
			const taskId = `task_${batchId}_${row['Roll No']}`;

			// Simulate processing delay + random outcome
			const delay = (index + 1) * 1500 + Math.random() * 1000; // Staggered delay
			timeouts.push(setTimeout(() => {
				const isSuccess = Math.random() > 0.2; // 80% success rate

				const updatePayload: IssuanceStatusUpdatePayload = {
					taskId: taskId,
					batchId: batchId,
					status: isSuccess ? 'success' : 'failed',
					message: isSuccess ? 'Certificate issued successfully' : 'Failed: Mock transaction error',
					rowData: { // Include minimal rowData as backend does
						'Roll No': row['Roll No'],
						'Recipient Name': row['Recipient Name']
					},
					timestamp: new Date().toISOString(),
					txHash: isSuccess ? `0x${Math.random().toString(16).substring(2, 12)}` : undefined,
					hash: isSuccess ? `0x${Math.random().toString(16).substring(2, 66)}` : undefined,
					error: isSuccess ? undefined : 'Mock transaction rejected',
					walletAddress: isSuccess ? `0xWallet${index % 2}` : undefined,
				};

				console.log("Simulating WS message:", updatePayload);

				// Update the specific task state
				setTasks(prevTasks => {
					// Find the existing task data (which was created from CsvRowData)
					const existingTask = Object.values(prevTasks).find(t => t['Roll No'] === row['Roll No'] && t.batchId === batchId);
					if (!existingTask) return prevTasks; // Should not happen if initialized correctly

					return {
						...prevTasks,
						[taskId]: { // Use taskId as the key
							...existingTask, // Keep original row data
							taskId: updatePayload.taskId, // Ensure taskId is set
							status: updatePayload.status,
							message: updatePayload.message,
							hash: updatePayload.hash,
							txHash: updatePayload.txHash,
							error: updatePayload.error,
							walletAddress: updatePayload.walletAddress,
							lastUpdated: updatePayload.timestamp,
						}
					};
				});

				// Update overall batch progress
				setBatchProgress(prev => ({
					...prev,
					processed: prev.processed + 1, // Increment processed count
					success: prev.success + (isSuccess ? 1 : 0),
					failed: prev.failed + (isSuccess ? 0 : 1),
				}));

			}, delay));
		});

		// Cleanup timeouts on unmount or when batch changes
		return () => {
			console.log("Cleaning up MOCK WebSocket listeners for batch:", batchId);
			timeouts.forEach(clearTimeout);
		};

	}, [isBatchStarted, batchId, initialPreviewData, setTasks, setBatchProgress]); // Rerun simulation if batch changes
};


const Issue: React.FC = () => {
	const { toast } = useToast();

	// === State Management ===
	// Shared state
	const [activeTab, setActiveTab] = useState<string>("single");

	// Single Issuance State
	const [singleFile, setSingleFile] = useState<File | null>(null);
	const [singleRecipientEmail, setSingleRecipientEmail] = useState('');
	const [singleRecipientName, setSingleRecipientName] = useState('');
	const [singleCertificateName, setSingleCertificateName] = useState('');
	const [singleResponse, setSingleResponse] = useState<ResponseState>({ isLoading: false, isSuccess: false, isError: false, message: '' });

	// Bulk Issuance State
	const [bulkCsvFile, setBulkCsvFile] = useState<File | null>(null);
	const [bulkDriveLink, setBulkDriveLink] = useState('');
	const [bulkPreviewData, setBulkPreviewData] = useState<CsvRowData[]>([]); // Holds raw preview data
	const [bulkHasPreviewRowErrors, setBulkHasPreviewRowErrors] = useState<boolean>(false);
	const [bulkShowPreview, setBulkShowPreview] = useState(false);
	const [bulkIsPreviewLoading, setBulkIsPreviewLoading] = useState(false);
	const [bulkIsBatchStarting, setBulkIsBatchStarting] = useState(false); // Loading for the start API call
	const [bulkIsBatchStarted, setBulkIsBatchStarted] = useState(false); // Tracks if batch processing is active
	const [bulkBatchId, setBulkBatchId] = useState<string | null>(null);
	const [bulkBatchResponse, setBulkBatchResponse] = useState<ResponseState>({ isLoading: false, isSuccess: false, isError: false, message: '' }); // For the start API call result
	const [bulkTrackedTasks, setBulkTrackedTasks] = useState<{ [taskId: string]: TrackedIssuanceTask }>({}); // Holds the state of each task for UI updates
	const [bulkBatchProgress, setBulkBatchProgress] = useState<BatchProgress>({ total: 0, processed: 0, success: 0, failed: 0 });

	// --- Derived State ---
	const isSingleFormComplete: boolean = Boolean(singleFile) && Boolean(singleRecipientEmail) && Boolean(singleRecipientName) && Boolean(singleCertificateName);

	// --- Handlers for Single Issuance ---
	const handleSingleFileSelect = useCallback((selectedFile: File) => {
		setSingleFile(selectedFile);
		// Mock name extraction (keep or remove as needed)
		if (selectedFile.name.includes('degree')) setSingleCertificateName('Bachelor of Science');
		else if (selectedFile.name.includes('diploma')) setSingleCertificateName('Diploma');
		else setSingleCertificateName('Certificate');
	}, []);

	const handleSingleSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isSingleFormComplete) return;

		setSingleResponse({ isLoading: true, isSuccess: false, isError: false, message: 'Queueing certificate...' });

		try {
			// TODO: Replace with actual API call using Redux Thunk later
			console.log("Submitting Single Issue:", { singleFile, singleCertificateName, singleRecipientName, singleRecipientEmail });
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

			const mockTaskId = `task_single_${Date.now()}`;
			// Simulate success response from backend queueing endpoint
			setSingleResponse({
				isLoading: false,
				isSuccess: true, // Indicates queuing was successful
				isError: false,
				message: `Certificate successfully queued for issuance. Task ID: ${mockTaskId}`,
			});
			toast({ title: 'Success', description: 'Certificate queued.' });

			// Reset form fields after successful queuing
			setSingleFile(null);
			setSingleRecipientEmail('');
			setSingleRecipientName('');
			setSingleCertificateName('');
			// Optionally clear the response message after a delay
			// setTimeout(() => setSingleResponse({ isLoading: false, isSuccess: false, isError: false, message: '' }), 5000);

		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'Failed to queue certificate.';
			setSingleResponse({ isLoading: false, isSuccess: false, isError: true, message: errorMsg });
			toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
		}
	}, [isSingleFormComplete, singleFile, singleCertificateName, singleRecipientName, singleRecipientEmail, toast]);

	// --- Handlers for Bulk Issuance ---
	const handleBulkCsvSelect = useCallback((selectedFile: File) => {
		setBulkCsvFile(selectedFile);
		setBulkShowPreview(false);
		setBulkPreviewData([]);
		setBulkTrackedTasks({}); // Clear tracked tasks
		setBulkIsBatchStarted(false); // Reset batch status
		setBulkBatchId(null);
		setBulkBatchResponse({ isLoading: false, isSuccess: false, isError: false, message: '' });
		setBulkBatchProgress({ total: 0, processed: 0, success: 0, failed: 0 });
	}, []);

	const handleBulkPreview = useCallback(async () => {
		if (!bulkCsvFile) return;
		setBulkIsPreviewLoading(true);
		setBulkShowPreview(false); // Hide previous preview if any
		setBulkPreviewData([]);
		setBulkTrackedTasks({});
		setBulkHasPreviewRowErrors(false);

		try {
			// TODO: Replace with actual API call to /bulk-issue-preview
			console.log("Previewing CSV:", bulkCsvFile.name);
			await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

			// Mock parsed data from backend
			const mockData: CsvRowData[] = Array.from({ length: 8 + Math.floor(Math.random() * 10) }, (_, i) => ({
				rowNumber: i + 1,
				'Roll No': `R${1000 + i}`, // Use correct header casing
				'Recipient Name': `Bulk Student ${i + 1}`,
				'Recipient Email': `bulk${i + 1}@test.com`,
				'Certificate Name/Type': i % 2 === 0 ? 'Bulk Cert Alpha' : 'Bulk Cert Beta',
				'Issue Date': `2025-0${i % 9 + 1}-1${i % 3 + 0}`,
				'Certificate Link': i === 3 ? 'INVALID_LINK' : i % 3 === 0 ? `R${1000 + i}.pdf` : `https://drive.google.com/file/d/FAKE_ID_${i}/view`,
				// 'Certificate Link': `https://drive.google.com/file/d/FAKE_ID_2/view`,
				Grade: ['A', 'B+', 'A-', 'C', 'B'][i % 5],
				// Add mock validation error for demonstration
				_validationError: i === 3 ? "Invalid Certificate Link format." : undefined,
				// _validationError: i === 1 ? "Invalid Certificate Link format." : undefined,
			}));

			setBulkPreviewData(mockData);
			setBulkHasPreviewRowErrors(mockData.some(row => row._validationError));
			setBulkShowPreview(true);
			toast({ title: 'Preview Ready', description: `${mockData.length} records loaded.` });

		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'Failed to preview CSV.';
			toast({ title: 'Preview Error', description: errorMsg, variant: 'destructive' });
		} finally {
			setBulkIsPreviewLoading(false);
		}
	}, [bulkCsvFile, toast]);

	const handleBulkStart = useCallback(async () => {
		if (bulkPreviewData.length === 0 || bulkHasPreviewRowErrors) {
			toast({ title: 'Error', description: 'Cannot start batch. Please preview a valid CSV first.', variant: 'destructive' });
			return;
		}

		setBulkIsBatchStarting(true);
		setBulkBatchResponse({ isLoading: true, isSuccess: false, isError: false, message: 'Initiating batch issuance...' });

		try {
			// TODO: Replace with actual API call to /bulk-issue-start
			console.log("Starting Bulk Batch:", { batchData: bulkPreviewData, folderLink: bulkDriveLink, fileName: bulkCsvFile?.name });
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

			// Mock response from backend
			const mockBatchId = `batch_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`;
			const mockTaskIds = bulkPreviewData.map(row => `task_${mockBatchId}_${row['Roll No']}`);

			setBulkBatchId(mockBatchId);
			setBulkIsBatchStarted(true); // Mark batch as active for processing/WS updates
			setBulkBatchProgress({ // Initialize progress
				total: bulkPreviewData.length,
				processed: 0,
				success: 0,
				failed: 0,
			});
			// Initialize tracked tasks state based on preview data
			const initialTasks: { [taskId: string]: TrackedIssuanceTask } = {};
			bulkPreviewData.forEach((row, index) => {
				const taskId = mockTaskIds[index]; // Use the generated taskId
				// Create initial tracked task state from preview data
				initialTasks[taskId] = {
					...row, // Spread the CsvRowData
					taskId: taskId,
					batchId: mockBatchId, // <-- ADD THIS LINE
					status: 'queued', // Start as queued
					message: 'Queued for processing',
					lastUpdated: new Date().toISOString(),
				};
			});
			setBulkTrackedTasks(initialTasks);


			setBulkBatchResponse({
				isLoading: false,
				isSuccess: true,
				isError: false,
				message: `Batch ${mockBatchId} started with ${bulkPreviewData.length} tasks queued.`,
			});
			toast({ title: 'Batch Started', description: `${bulkPreviewData.length} certificates queued.` });

			// NOTE: The actual processing simulation is now handled by the useMockWebSocket hook

		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'Failed to start batch issuance.';
			setBulkBatchResponse({ isLoading: false, isSuccess: false, isError: true, message: errorMsg });
			toast({ title: 'Batch Start Error', description: errorMsg, variant: 'destructive' });
		} finally {
			setBulkIsBatchStarting(false);
		}
	}, [bulkPreviewData, bulkDriveLink, bulkCsvFile?.name, toast, bulkHasPreviewRowErrors]);

	const handleBulkReset = useCallback(() => {
		setBulkCsvFile(null);
		setBulkDriveLink('');
		setBulkShowPreview(false);
		setBulkPreviewData([]);
		setBulkTrackedTasks({});
		setBulkIsBatchStarted(false);
		setBulkIsBatchStarting(false);
		setBulkBatchId(null);
		setBulkBatchResponse({ isLoading: false, isSuccess: false, isError: false, message: '' });
		setBulkBatchProgress({ total: 0, processed: 0, success: 0, failed: 0 });
		setBulkHasPreviewRowErrors(false);
		console.log("Bulk state reset");
	}, []);

	// --- Mock WebSocket Hook ---
	// Pass the raw preview data to the hook for simulation purposes
	useMockWebSocket(bulkIsBatchStarted, bulkBatchId, bulkPreviewData, setBulkTrackedTasks, setBulkBatchProgress);

	// --- Convert tracked tasks map to array for table rendering ---
	// Memoize this conversion for performance
	const trackedTasksArray = React.useMemo(() => {
		// If preview is shown but batch not started, use preview data directly
		if (bulkShowPreview && !bulkIsBatchStarted) {
			// Create initial task structure from preview data before batch starts
			return bulkPreviewData.map((row): TrackedIssuanceTask => {
				// *** FIX: Explicitly cast the status value ***
				const initialStatus: IssuanceJobStatus = row._validationError ? 'failed' : 'pending';
				return {
					...row, // Spread CsvRowData
					taskId: null,
					batchId: null,
					status: initialStatus, // Assign the correctly typed status
					message: row._validationError || 'Ready for batch start',
					lastUpdated: null,
					hash: null,
					txHash: null,
					error: row._validationError || null,
					walletAddress: null,
				};
			});
		}
		// Otherwise, use the tracked tasks state which gets updated by WS
		return Object.values(bulkTrackedTasks);
	}, [bulkShowPreview, bulkIsBatchStarted, bulkPreviewData, bulkTrackedTasks]);


	// --- FIX THE BUG ---
	// Correct the simulation logic inside handleStartBatch
	const handleStartBatchCorrected = useCallback(async () => {
		// ... (initial checks and setup as before) ...
		setBulkIsBatchStarting(true);
		setBulkBatchResponse({ isLoading: true, isSuccess: false, isError: false, message: 'Initiating batch issuance...' });

		try {
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

			const mockBatchId = `batch_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`;
			const mockTaskIds = bulkPreviewData.map(row => `task_${mockBatchId}_${row['Roll No']}`);

			setBulkBatchId(mockBatchId);
			setBulkIsBatchStarted(true);
			setBulkBatchProgress({ total: bulkPreviewData.length, processed: 0, success: 0, failed: 0 });

			const initialTasks: { [taskId: string]: TrackedIssuanceTask } = {};
			bulkPreviewData.forEach((row, index) => {
				const taskId = mockTaskIds[index];
				initialTasks[taskId] = {
					...row,	// Spread the CsvRowData
					taskId: taskId,
					batchId: mockBatchId, // <-- ADD THIS LINE
					status: 'queued',
					message: 'Queued for processing',
					lastUpdated: new Date().toISOString(),
				};
			});
			setBulkTrackedTasks(initialTasks);

			setBulkBatchResponse({ isLoading: false, isSuccess: true, isError: false, message: `Batch ${mockBatchId} started...` });
			toast({ title: 'Batch Started', description: `${bulkPreviewData.length} certificates queued.` });

			// --- Corrected Simulation Logic ---
			// This part should ideally be replaced by the useMockWebSocket hook,
			// but if keeping it here for testing, fix the 'isSuccess' reference.
			bulkPreviewData.forEach((row, index) => {
				const taskId = mockTaskIds[index]; // Get the correct taskId
				const delay = (index + 1) * 1000 + Math.random() * 500; // Shorter delay maybe
				setTimeout(() => {
					// *** FIX IS HERE ***
					const currentTaskIsSuccess = Math.random() > 0.2; // Use a locally scoped variable

					setBulkTrackedTasks(prevTasks => {
						// Ensure task exists before updating
						if (!prevTasks[taskId]) return prevTasks;
						return {
							...prevTasks,
							[taskId]: {
								...prevTasks[taskId], // Keep existing row data
								status: currentTaskIsSuccess ? 'success' : 'failed',
								message: currentTaskIsSuccess ? 'Certificate issued successfully' : 'Failed: Mock transaction error',
								txHash: currentTaskIsSuccess ? `0x${Math.random().toString(16).substring(2, 10)}` : undefined,
								error: currentTaskIsSuccess ? undefined : 'Mock transaction rejected',
								lastUpdated: new Date().toISOString(),
							}
						};
					});

					setBulkBatchProgress(prev => ({
						...prev,
						processed: prev.processed + 1,
						success: prev.success + (currentTaskIsSuccess ? 1 : 0),
						failed: prev.failed + (currentTaskIsSuccess ? 0 : 1),
					}));

				}, delay);
			});
			// --- End Corrected Simulation ---

		} catch (error) {
			setBulkBatchResponse({
				isLoading: false,
				isSuccess: false,
				isError: true,
				message: 'Failed to start batch issuance. Please try again.',
			});

		}
		finally { setBulkIsBatchStarting(false); }
	}, [bulkPreviewData, bulkDriveLink, bulkCsvFile?.name, toast, bulkHasPreviewRowErrors]);
	// --- End Bug Fix ---

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
				<Tabs
					defaultValue="single"
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full"
				>
					<TabsList className="mb-6">
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
						{/* Render SingleIssueForm, passing state and handlers */}
						<SingleIssueForm
							file={singleFile}
							recipientEmail={singleRecipientEmail}
							recipientName={singleRecipientName}
							certificateName={singleCertificateName}
							response={singleResponse}
							isFormComplete={isSingleFormComplete}
							onFileSelect={handleSingleFileSelect}
							onRecipientEmailChange={setSingleRecipientEmail}
							onRecipientNameChange={setSingleRecipientName}
							onCertificateNameChange={setSingleCertificateName}
							onSubmit={handleSingleSubmit} // Use the correct handler
						/>
						{/* HowItWorksCard is now rendered inside SingleIssueForm */}
					</TabsContent>

					{/* Bulk Tab Content */}
					<TabsContent value="bulk" className="space-y-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Column 1: Upload and Preview Table */}
							<div className="flex flex-col gap-6">
								<BulkIssueCsvUpload
									csvFile={bulkCsvFile}
									googleDriveLink={bulkDriveLink}
									isPreviewLoading={bulkIsPreviewLoading}
									onCsvFileSelect={handleBulkCsvSelect}
									onGoogleDriveLinkChange={setBulkDriveLink}
									onPreviewCsv={handleBulkPreview}
								/>

								{bulkShowPreview && bulkCsvFile && (
									<BulkIssuePreviewTable
										// Pass the memoized array of tracked tasks
										tasks={trackedTasksArray}
										csvFileName={bulkCsvFile.name}
										isBatchStarted={bulkIsBatchStarted}
										isBatchProcessing={bulkIsBatchStarting}
										batchProgress={bulkBatchProgress}
										hasPreviewRowErrors={bulkHasPreviewRowErrors}
										// Pass the corrected handler for starting
										onStartBatch={handleStartBatchCorrected}
										onResetBatch={handleBulkReset}
									/>
								)}
							</div>

							{/* Column 2: Batch Progress and Guide */}
							<div className="flex flex-col gap-6">
								{/* Show overall batch response (e.g., "Batch Started") */}
								{(bulkBatchResponse.isLoading || bulkBatchResponse.isSuccess || bulkBatchResponse.isError) && (
									<ResponseBox
										isLoading={bulkBatchResponse.isLoading}
										isSuccess={bulkBatchResponse.isSuccess}
										isError={bulkBatchResponse.isError}
										message={bulkBatchResponse.message}
										title={
											bulkBatchResponse.isLoading ? "Processing Batch Request" :
												bulkBatchResponse.isSuccess ? "Batch Update" :
													"Batch Request Failed"
										}
									/>
								)}

								{/* Show detailed progress card only when batch is active */}
								{bulkIsBatchStarted && (
									<BatchProgressCard
										batchId={bulkBatchId}
										batchProgress={bulkBatchProgress}
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