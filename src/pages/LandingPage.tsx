
import React, { useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { 
  Shield, 
  ShieldOff, 
  Clock, 
  Unlink, 
  Layers, 
  FileUp, 
  Fingerprint, 
  Bell, 
  FileSearch, 
  Cpu, 
  ShieldCheck, 
  DatabaseZap, 
  ScanLine, 
  Sheet as SheetIcon, 
  Wifi, 
  Users,
  Menu,
  ChevronDown
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ui-custom/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const LandingPage: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();
  
  // Refs for scroll sections
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center">
            <RouterLink to="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-semibold text-xl tracking-tight">CertiChain</span>
            </RouterLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className={navigationMenuTriggerStyle()} 
                    onClick={() => scrollToSection(featuresRef)}
                  >
                    Features
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className={navigationMenuTriggerStyle()} 
                    onClick={() => scrollToSection(howItWorksRef)}
                  >
                    How It Works
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                    <RouterLink to="/technical-details">Technical Details</RouterLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                    <RouterLink to="/about-us">About Us</RouterLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <RouterLink to="/login">Login</RouterLink>
              </Button>
              <Button variant="default" asChild>
                <RouterLink to="/login">Register</RouterLink>
              </Button>
              <ThemeToggle variant="ghost" />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle variant="ghost" />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Open menu</span>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      <span className="font-semibold text-lg">CertiChain</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => {
                        scrollToSection(featuresRef);
                        document.querySelector('[data-radix-collection-item]')?.dispatchEvent(
                          new MouseEvent('click', { bubbles: true })
                        );
                      }}
                    >
                      Features
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => {
                        scrollToSection(howItWorksRef);
                        document.querySelector('[data-radix-collection-item]')?.dispatchEvent(
                          new MouseEvent('click', { bubbles: true })
                        );
                      }}
                    >
                      How It Works
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <RouterLink to="/technical-details">Technical Details</RouterLink>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <RouterLink to="/about-us">About Us</RouterLink>
                    </Button>
                  </div>

                  <div className="mt-10 space-y-3">
                    <Button variant="outline" className="w-full" asChild>
                      <RouterLink to="/login">Login</RouterLink>
                    </Button>
                    <Button variant="default" className="w-full" asChild>
                      <RouterLink to="/login">Register</RouterLink>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 px-4 md:py-32 overflow-hidden">
          <div 
            className="absolute inset-0 z-0" 
            style={{
              background: resolvedTheme === 'dark' 
                ? 'radial-gradient(circle at 50% 50%, rgba(37, 38, 44, 0.7), rgba(10, 10, 15, 0.9))'
                : 'radial-gradient(circle at 50% 50%, rgba(240, 245, 255, 0.8), rgba(220, 230, 255, 0.5))',
              opacity: 0.8
            }}
          />

          <div className="container mx-auto relative z-10 flex flex-col items-center text-center max-w-3xl">
            <Shield className="h-16 w-16 text-primary mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              CertiChain: Secure, Verify, Trust.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Issue tamper-proof digital certificates and verify authenticity instantly. Powered by cutting-edge blockchain and AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <RouterLink to="/login">Get Started</RouterLink>
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection(howItWorksRef)} className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Traditional Certificates Fall Short</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                In today's digital world, traditional methods face significant hurdles that compromise security, efficiency, and trust.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <ShieldOff className="h-8 w-8 mb-2 text-destructive" />
                  <CardTitle>Fraud & Forgery</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Traditional paper certificates are prone to sophisticated forgery techniques, undermining trust in credentials.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <Clock className="h-8 w-8 mb-2 text-warning" />
                  <CardTitle>Slow Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Manual verification processes are time-consuming, creating bottlenecks in hiring and enrollment processes.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <Unlink className="h-8 w-8 mb-2 text-warning" />
                  <CardTitle>Lack of Trust</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Without reliable verification, the value of credentials diminishes in increasingly competitive markets.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <Layers className="h-8 w-8 mb-2 text-info" />
                  <CardTitle>Inefficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Administrative overhead for issuing, tracking, and verifying certificates drains resources and increases costs.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">CertiChain: The Smart Solution</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                CertiChain leverages blockchain and AI to create a secure, transparent, and efficient ecosystem for credential management and verification.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                    <DatabaseZap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Immutable Security</h3>
                    <p className="text-muted-foreground">
                      Certificates are anchored to the blockchain with cryptographic hashes, making them tamper-proof and permanently verifiable.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-success/10 p-3 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Instant Authenticity</h3>
                    <p className="text-muted-foreground">
                      Verifiers can instantly check certificate validity without contacting the issuer, streamlining verification workflows.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-info/10 p-3 rounded-full">
                    <ScanLine className="h-6 w-6 text-info" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">AI-Powered Verification</h3>
                    <p className="text-muted-foreground">
                      Advanced OCR technology extracts and processes information from various document formats, enhancing accuracy and speed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-secondary/50 p-3 rounded-full">
                    <Sheet className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Streamlined Issuance</h3>
                    <p className="text-muted-foreground">
                      Issue individual or bulk certificates efficiently, with automated processing and real-time status tracking.
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-info/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="h-32 w-32 text-primary opacity-80" />
                    </div>
                    <div className="absolute inset-0 bg-card/20 backdrop-blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section ref={howItWorksRef} className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Simple, Secure, Seamless</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform streamlines the entire certificate lifecycle with intuitive workflows for both issuers and verifiers.
              </p>
            </div>

            <div className="space-y-16">
              {/* Issuer Flow */}
              <div>
                <h3 className="text-2xl font-semibold mb-8 text-center">For Issuers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="text-center">
                      <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                        <FileUp className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle>Upload</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription>
                        Upload certificate data individually or in bulk using our CSV template.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="text-center">
                      <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                        <Fingerprint className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle>Secure</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription>
                        Our system automatically hashes and records certificates on the blockchain.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="text-center">
                      <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                        <Bell className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle>Notify</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription>
                        Track real-time status of all certificates and automatically notify recipients.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Verifier Flow */}
              <div>
                <h3 className="text-2xl font-semibold mb-8 text-center">For Verifiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="text-center">
                      <div className="mx-auto bg-info/10 p-4 rounded-full mb-4">
                        <FileSearch className="h-8 w-8 text-info" />
                      </div>
                      <CardTitle>Upload</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription>
                        Simply upload or drag-and-drop the certificate file for verification.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="text-center">
                      <div className="mx-auto bg-info/10 p-4 rounded-full mb-4">
                        <Cpu className="h-8 w-8 text-info" />
                      </div>
                      <CardTitle>Analyze</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription>
                        AI extracts text, identifies certificate type, and calculates the unique hash.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="text-center">
                      <div className="mx-auto bg-info/10 p-4 rounded-full mb-4">
                        <ShieldCheck className="h-8 w-8 text-info" />
                      </div>
                      <CardTitle>Verify</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription>
                        Instantly confirm certificate authenticity against blockchain records.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section ref={featuresRef} className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Core Features of CertiChain</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform offers comprehensive tools for modern certificate management and verification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <DatabaseZap className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Blockchain Integrity</CardTitle>
                  <CardDescription>
                    Every certificate is cryptographically secured on the blockchain, ensuring immutability and tamper-proof verification.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <ScanLine className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>AI-Powered OCR</CardTitle>
                  <CardDescription>
                    Advanced optical character recognition automatically extracts and processes information from various document formats.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <Sheet className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Bulk Issuance</CardTitle>
                  <CardDescription>
                    Streamline operations by issuing multiple certificates simultaneously through our intuitive CSV upload system.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <Wifi className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Real-Time Tracking</CardTitle>
                  <CardDescription>
                    Monitor certificate status, verification attempts, and usage analytics through a comprehensive dashboard.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <Users className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Role-Based Access</CardTitle>
                  <CardDescription>
                    Differentiated user roles for issuers and verifiers with appropriate permissions and tailored interfaces.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <ShieldCheck className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Comprehensive Security</CardTitle>
                  <CardDescription>
                    End-to-end encryption, secure authentication, and advanced threat protection safeguard all certificate data.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience the Future of Credentials?</h2>
            <p className="text-muted-foreground mb-8">
              Secure your institution's reputation and streamline your verification processes with CertiChain's cutting-edge platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <RouterLink to="/login">Register Now</RouterLink>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <RouterLink to="/login">Login</RouterLink>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Shield className="h-6 w-6 text-primary mr-2" />
              <span className="font-semibold text-lg">CertiChain</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-sm text-muted-foreground">
              <RouterLink to="/about-us" className="hover:text-foreground transition-colors">
                About Us
              </RouterLink>
              <RouterLink to="/technical-details" className="hover:text-foreground transition-colors">
                Technical Details
              </RouterLink>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              © {currentYear} CertiChain. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
