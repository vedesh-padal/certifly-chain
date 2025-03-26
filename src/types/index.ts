
export type UserRole = 'issuer' | 'verifier';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name?: string;
  organization?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Certificate {
  id: string;
  name: string;
  recipientName: string;
  recipientEmail: string;
  issuerId: string;
  issuerName: string;
  issueDate: string;
  hash: string;
  verified?: boolean;
}

export interface ResponseState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

export interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  label?: string;
  sublabel?: string;
  isLoading?: boolean;
}
