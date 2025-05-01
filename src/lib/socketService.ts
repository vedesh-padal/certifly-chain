// src/lib/socketService.ts
import { io, Socket } from 'socket.io-client';
import { store } from '../app/store'; // Import the Redux store instance
import { updateTaskStatus } from '../features/issuance/issuanceSlice'; // Import the action dispatcher
import { IssuanceStatusUpdatePayload } from '../types'; // Import the payload type

// --- Use Vite's way to access env variables ---
// Access variable prefixed with VITE_ from import.meta.env
// Provide a default value for development if the variable isn't set
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket: Socket | null = null;

// Function to establish connection (call after login)
export const connectSocket = (token: string): void => {
	// Disconnect previous connection if exists
	if (socket && socket.connected) {
		console.warn('Socket already connected. Disconnecting previous one.');
		socket.disconnect();
	}

	console.log(`Attempting to connect WebSocket to ${SOCKET_URL}...`);

	// Create new socket instance with auth token
	socket = io(SOCKET_URL, {
		auth: { token },
		reconnectionAttempts: 5, // Limit reconnection attempts
		reconnectionDelay: 3000, // Wait 3s before retrying
		transports: ['websocket'], // Prefer WebSocket transport
	});

	// --- Standard Listeners ---
	socket.on('connect', () => {
		console.log(`WebSocket connected successfully! Socket ID: ${socket?.id}`);
	});

	socket.on('disconnect', (reason) => {
		console.log(`WebSocket disconnected. Reason: ${reason}`);
		// Handle potential cleanup or UI updates if needed
		if (reason === 'io server disconnect') {
			// The server explicitly disconnected the socket (e.g., invalid token on reconnect)
			// Might need to trigger logout or show message
			console.error('Server disconnected the socket.');
		}
		// Socket will automatically try to reconnect if possible based on options
	});

	socket.on('connect_error', (err) => {
		console.error(`WebSocket connection error: ${err.message}`);
		// Handle connection errors (e.g., server down, invalid token on initial connect)
		// Might need to prevent app functionality or logout user
	});

	// --- Custom Application Event Listeners ---
	socket.on('issuanceStatusUpdate', (data: IssuanceStatusUpdatePayload) => {
		console.log('Received issuanceStatusUpdate:', data);
		// Dispatch the action to the Redux store
		// We access the store directly here. Ensure this pattern is acceptable for your project.
		// Alternatively, pass dispatch function during initialization.
		store.dispatch(updateTaskStatus(data));
	});

	// Add other listeners as needed
	// socket.on('someOtherEvent', (data) => { ... });
};

// Function to disconnect socket (call on logout)
export const disconnectSocket = (): void => {
	if (socket && socket.connected) {
		console.log('Disconnecting WebSocket...');
		socket.disconnect();
		socket = null;
	} else {
		console.log('WebSocket already disconnected or not initialized.');
	}
};

// Optional: Function to check connection status
export const isSocketConnected = (): boolean => {
	return socket?.connected || false;
};

// Optional: Export the socket instance if direct access is needed (use carefully)
// export const getSocket = (): Socket | null => socket;