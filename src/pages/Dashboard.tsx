
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CertificateCard } from '@/components/ui-custom/CertificateCard';
import { Certificate } from '@/types';
import { Button } from '@/components/ui/button';
import { FileCheck, Shield, Upload, Search, Scan } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock API call to fetch certificates
    const fetchCertificates = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on user role
      const mockCertificates: Certificate[] = [
        {
          id: '1',
          name: 'Bachelor of Computer Science',
          recipientName: 'John Doe',
          recipientEmail: 'john.doe@example.com',
          issuerId: '1',
          issuerName: 'Example University',
          issueDate: '2023-06-15',
          hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          verified: true
        },
        {
          id: '2',
          name: 'Master of Business Administration',
          recipientName: 'Jane Smith',
          recipientEmail: 'jane.smith@example.com',
          issuerId: '1',
          issuerName: 'Example University',
          issueDate: '2023-08-20',
          hash: '0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef',
          verified: user?.role === 'issuer' ? undefined : false
        },
        {
          id: '3',
          name: 'Certificate in Data Science',
          recipientName: 'Michael Johnson',
          recipientEmail: 'michael.j@example.com',
          issuerId: '1',
          issuerName: 'Example University',
          issueDate: '2023-11-05',
          hash: '0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef',
          verified: user?.role === 'issuer' ? undefined : true
        }
      ];
      
      setCertificates(mockCertificates);
      setIsLoading(false);
    };

    fetchCertificates();
  }, [user?.role]);

  const getActionButton = () => {
    if (user?.role === 'issuer') {
      return (
        <Button asChild>
          <Link to="/issue" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Issue Certificate
          </Link>
        </Button>
      );
    } else {
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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {user?.role === 'issuer' ? 'Issuer Dashboard' : 'Verifier Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {user?.role === 'issuer'
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

        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {user?.role === 'issuer' ? 'Recent Certificates Issued' : 'Recently Verified Certificates'}
            </h2>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted-foreground/20 border-t-primary mb-4" />
              <p className="text-sm text-muted-foreground">Loading certificates...</p>
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-muted">
                  {user?.role === 'issuer' ? (
                    <FileCheck className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <Shield className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
              </div>
              <h3 className="text-lg font-medium mb-1">No certificates found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {user?.role === 'issuer'
                  ? "You haven't issued any certificates yet."
                  : "You haven't verified any certificates yet."}
              </p>
              {getActionButton()}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map(certificate => (
                <CertificateCard key={certificate.id} certificate={certificate} />
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-6 gap-3" asChild>
              <Link to={user?.role === 'issuer' ? '/issue' : '/verify'}>
                {user?.role === 'issuer' ? (
                  <>
                    <Upload className="h-6 w-6" />
                    <span>Issue Certificate</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-6 w-6" />
                    <span>Verify Certificate</span>
                  </>
                )}
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-6 gap-3">
              <Search className="h-6 w-6" />
              <span>Search Certificates</span>
            </Button>
            <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-6 gap-3">
              <Scan className="h-6 w-6" />
              <span>Scan QR Code</span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
