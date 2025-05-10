
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Database, Lock, Cpu, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const TechnicalDetails: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-semibold text-xl tracking-tight">CertiChain</span>
            </Link>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Technical Details</h1>
          
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p className="lead text-muted-foreground text-lg mb-8">
              CertiChain leverages cutting-edge technologies to ensure secure, efficient, and reliable credential verification. Here's an overview of our technical architecture and security measures.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader className="pb-2">
                  <Database className="h-6 w-6 mb-3 text-primary" />
                  <CardTitle>Blockchain Technology</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>We utilize a distributed ledger architecture to store cryptographic hashes of certificates, ensuring immutability and long-term verification capabilities without relying on centralized authorities.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <Lock className="h-6 w-6 mb-3 text-primary" />
                  <CardTitle>Security Protocols</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>All data is encrypted using AES-256 standards, with secure key management and certificate-based authentication to protect sensitive information throughout its lifecycle.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <Cpu className="h-6 w-6 mb-3 text-primary" />
                  <CardTitle>AI & Machine Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Our AI-powered OCR utilizes deep learning models trained on millions of documents to accurately extract and process information from diverse certificate formats.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <Server className="h-6 w-6 mb-3 text-primary" />
                  <CardTitle>Infrastructure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>CertiChain is built on a scalable microservices architecture deployed across redundant cloud infrastructure with 99.9% uptime guarantee and automatic failover capabilities.</p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-bold mb-4">Blockchain Implementation</h2>
            <p>
              CertiChain uses a permissioned blockchain network specifically designed for credential verification. Each certificate is processed through the following steps:
            </p>
            <ul className="space-y-2 mb-8">
              <li>Document data is hashed using SHA-256 algorithm</li>
              <li>The hash is recorded on the blockchain with timestamp and issuer signature</li>
              <li>Smart contracts govern access control and verification processes</li>
              <li>Multiple consensus nodes ensure reliability and data integrity</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">API & Integrations</h2>
            <p>
              Our RESTful API allows seamless integration with existing systems through documented endpoints and webhooks:
            </p>
            <ul className="space-y-2 mb-8">
              <li>OAuth 2.0 authentication with RBAC</li>
              <li>Comprehensive documentation for all endpoints</li>
              <li>Sandbox environment for testing</li>
              <li>Rate limiting and request throttling for stability</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Data Protection & Compliance</h2>
            <p>
              CertiChain is designed with privacy and compliance at its core:
            </p>
            <ul className="space-y-2 mb-8">
              <li>GDPR and CCPA compliant data handling</li>
              <li>Zero-knowledge proofs for privacy-preserving verification</li>
              <li>Regular third-party security audits</li>
              <li>SOC 2 Type II certified processes</li>
            </ul>
          </div>

          <div className="flex justify-center mt-12">
            <Button asChild>
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CertiChain. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TechnicalDetails;
