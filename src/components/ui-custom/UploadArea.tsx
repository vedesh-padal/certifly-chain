
import React, { useState, useRef } from 'react';
import { File, Upload, FileWarning } from 'lucide-react';
import { UploadAreaProps } from '@/types';
import { cn } from '@/lib/utils';

export const UploadArea: React.FC<UploadAreaProps> = ({
  onFileSelect,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = 5242880, // 5MB
  label = "Upload a file",
  sublabel = "Drag and drop or click to browse",
  isLoading = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      setError(`File size exceeds ${maxSize / 1048576}MB`);
      return false;
    }

    // Check file type
    const fileType = file.type;
    const allowedTypes = accept.split(',').map(type => 
      type.startsWith('.') ? type.substring(1) : type
    );
    
    const isValidType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      } else {
        return fileType.includes(type);
      }
    });

    if (!isValidType) {
      setError(`Invalid file type. Accepted types: ${accept}`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setFile(file);
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelect(droppedFile);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFileSelect(selectedFile);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div 
      className={cn(
        "upload-area group",
        isDragging && "drag-active",
        isLoading && "pointer-events-none opacity-60",
        error && "border-destructive/50 bg-destructive/5"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleInputChange}
        disabled={isLoading}
      />
      
      <div className="flex flex-col items-center justify-center p-6 text-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted-foreground/20 border-t-primary" />
            <p className="text-sm text-muted-foreground">Processing...</p>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
              <File className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button 
              onClick={removeFile} 
              className="mt-2 text-xs text-muted-foreground underline hover:text-foreground transition-colors"
            >
              Remove file
            </button>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 text-destructive">
              <FileWarning className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm text-destructive">{error}</p>
              <p className="text-xs text-muted-foreground">
                Please try again with a valid file
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Upload className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm">{label}</p>
              <p className="text-xs text-muted-foreground">{sublabel}</p>
              <p className="text-xs text-muted-foreground">
                Max file size: {maxSize / 1048576}MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
