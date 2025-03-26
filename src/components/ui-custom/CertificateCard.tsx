
import React from 'react';
import { Calendar, User, Mail, Building, FileCheck, Shield } from 'lucide-react';
import { Certificate } from '@/types';
import { cn } from '@/lib/utils';

interface CertificateCardProps {
  certificate: Certificate;
  className?: string;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ 
  certificate,
  className
}) => {
  const { 
    name, 
    recipientName, 
    recipientEmail, 
    issuerName, 
    issueDate, 
    verified 
  } = certificate;

  return (
    <div className={cn("glass-card rounded-lg overflow-hidden", className)}>
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          {verified !== undefined && (
            verified ? (
              <div className="verified-badge">
                <Shield className="h-3 w-3" />
                <span>Verified</span>
              </div>
            ) : (
              <div className="unverified-badge">
                <Shield className="h-3 w-3" />
                <span>Unverified</span>
              </div>
            )
          )}
        </div>
        
        <div className="h-16 bg-gradient-to-r from-primary/10 to-primary/5" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <FileCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight">{name}</h3>
            <p className="text-xs text-muted-foreground">Certificate</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Recipient</p>
              <p className="text-sm font-medium">{recipientName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{recipientEmail}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Building className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Issuer</p>
              <p className="text-sm font-medium">{issuerName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Issue Date</p>
              <p className="text-sm font-medium">{issueDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
