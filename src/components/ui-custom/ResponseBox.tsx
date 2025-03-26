
import React from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponseState } from '@/types';

interface ResponseBoxProps extends ResponseState {
  className?: string;
  title?: string;
}

export const ResponseBox: React.FC<ResponseBoxProps> = ({
  isLoading,
  isSuccess,
  isError,
  message,
  className,
  title
}) => {
  if (!isLoading && !isSuccess && !isError) {
    return null;
  }

  return (
    <div
      className={cn(
        "glass-card p-6 rounded-lg transition-all duration-300 animate-fade-in",
        isSuccess && "bg-success/5 border-success/20",
        isError && "bg-destructive/5 border-destructive/20",
        isLoading && "bg-muted/20 border-muted/30",
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          {isLoading && (
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          )}
          {isSuccess && (
            <CheckCircle className="h-12 w-12 text-success animate-scale-in" />
          )}
          {isError && (
            <AlertCircle className="h-12 w-12 text-destructive animate-scale-in" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          {title || (
            isLoading ? "Processing..." :
            isSuccess ? "Success!" :
            "Error!"
          )}
        </h3>
        
        <p className="text-sm text-muted-foreground max-w-md">
          {message || (
            isLoading ? "Please wait while we process your request..." :
            isSuccess ? "Operation completed successfully." :
            "An error occurred. Please try again."
          )}
        </p>
      </div>
    </div>
  );
};
