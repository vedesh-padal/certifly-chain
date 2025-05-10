
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Users, GraduationCap, Building, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AboutUs: React.FC = () => {
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
          <h1 className="text-3xl font-bold mb-8">About CertiChain</h1>
          
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p className="lead text-muted-foreground text-lg mb-8">
              CertiChain was founded with a mission to revolutionize how credentials are issued, managed, and verified in our increasingly digital world.
            </p>

            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="mb-8">
              We envision a world where credentials are universally verifiable, instantly accessible, and completely secure. A world where educational institutions, professional organizations, and employers can trust credentials at face value, without lengthy verification processes or concerns about fraud.
            </p>

            <h2 className="text-2xl font-bold mb-4">Our Team</h2>
            <p className="mb-8">
              CertiChain brings together experts from blockchain technology, cybersecurity, education technology, and artificial intelligence. Our diverse team is united by a common goal: to build the most trusted and efficient credential verification platform in the world.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Educational Partners</h3>
                      <p className="text-sm text-muted-foreground">Leading universities and educational institutions</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    We collaborate with educational institutions worldwide to develop standards and best practices for digital credentials.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Industry Advisors</h3>
                      <p className="text-sm text-muted-foreground">Experienced professionals from key sectors</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    Our advisory board includes leaders from education, technology, and human resources who guide our product development.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Development Team</h3>
                      <p className="text-sm text-muted-foreground">Expert engineers and designers</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    Our technical team brings expertise from leading technology companies and blockchain projects to build our secure platform.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Research Division</h3>
                      <p className="text-sm text-muted-foreground">Advancing credential technology</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    Our dedicated research team continuously explores new applications of blockchain and AI for credential verification.
                  </p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <p className="mb-8">
              CertiChain is committed to:
            </p>
            <ul className="space-y-2 mb-8">
              <li><strong>Security</strong> - Protecting credential data with the highest standards of encryption and blockchain technology</li>
              <li><strong>Accessibility</strong> - Making verification available to all, regardless of technical expertise</li>
              <li><strong>Innovation</strong> - Continuously improving our platform through research and development</li>
              <li><strong>Privacy</strong> - Respecting data privacy and giving users control over their information</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
            <p className="mb-8">
              Whether you're an educational institution looking to secure your credentials, an employer seeking efficient verification solutions, or a professional wanting to showcase authenticated achievements, CertiChain invites you to join our ecosystem of trust and innovation.
            </p>
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

export default AboutUs;
