
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'issuer' | 'verifier';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children,
  requiredRole
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show loading state
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background dark:bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // User doesn't have the required role, redirect to dashboard
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
