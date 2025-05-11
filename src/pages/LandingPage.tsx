
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
	Wifi,
	Users,
	Menu,
	Lock
} from "lucide-react";
import { ThemeToggle } from "@/components/ui-custom/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const LandingPage: React.FC = () => {

	// Refs for scroll sections
	const featuresRef = useRef<HTMLDivElement>(null);
	const howItWorksRef = useRef<HTMLDivElement>(null);

	const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
		ref.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const currentYear = new Date().getFullYear();

	return (
		<div className="flex flex-col min-h-screen bg-background text-foreground">
			{/* Navigation Bar */}
			<header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
				<div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
					<RouterLink to="/" className="flex items-center gap-2">
						<Shield className="h-8 w-8 text-primary" />
						<span className="font-semibold text-xl tracking-tight">CertiChain</span>
					</RouterLink>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center">
						<NavigationMenu className="mr-6"> {/* Added margin for spacing */}
							<NavigationMenuList>
								<NavigationMenuItem>
									<NavigationMenuLink
										className={navigationMenuTriggerStyle() + " cursor-pointer"} // Added cursor-pointer
										onClick={() => scrollToSection(featuresRef)}
									>
										Features
									</NavigationMenuLink>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<NavigationMenuLink
										className={navigationMenuTriggerStyle() + " cursor-pointer"} // Added cursor-pointer
										onClick={() => scrollToSection(howItWorksRef)}
									>
										How It Works
									</NavigationMenuLink>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<RouterLink to="/technical-details" className={navigationMenuTriggerStyle()}>
										Technical Details
									</RouterLink>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<RouterLink to="/about-us" className={navigationMenuTriggerStyle()}>
										About Us
									</RouterLink>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>

						<div className="flex items-center gap-2">
							<Button variant="outline" asChild>
								<RouterLink to="/login">Login</RouterLink>
							</Button>
							<Button variant="default" asChild>
								{/* Assuming /login handles redirect to register tab or you have a /register route */}
								<RouterLink to="/login">Register</RouterLink>
							</Button>
							<ThemeToggle variant="ghost" />
						</div>
					</nav>

					{/* Mobile Navigation */}
					<div className="flex md:hidden items-center gap-2">
						<ThemeToggle variant="ghost" />
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon">
									<span className="sr-only">Open menu</span>
									<Menu className="h-6 w-6" /> {/* Menu icon */}
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="w-[280px] p-6"> {/* Adjusted width and padding */}
								<div className="flex flex-col h-full">
									<div className="flex items-center justify-between mb-8"> {/* Increased margin */}
										<RouterLink to="/" className="flex items-center gap-2">
											<Shield className="h-7 w-7 text-primary" />
											<span className="font-semibold text-lg">CertiChain</span>
										</RouterLink>
										{/* Close button is part of SheetContent by default */}
									</div>

									<nav className="flex flex-col gap-3"> {/* Adjusted gap */}
										{/* Mobile Nav Links - Assuming Sheet closes on navigation */}
										<Button variant="ghost" className="w-full justify-start text-base py-3" onClick={() => scrollToSection(featuresRef)}>Features</Button>
										<Button variant="ghost" className="w-full justify-start text-base py-3" onClick={() => scrollToSection(howItWorksRef)}>How It Works</Button>
										<Button variant="ghost" className="w-full justify-start text-base py-3" asChild><RouterLink to="/technical-details">Technical Details</RouterLink></Button>
										<Button variant="ghost" className="w-full justify-start text-base py-3" asChild><RouterLink to="/about-us">About Us</RouterLink></Button>
									</nav>

									<div className="mt-auto space-y-3 pt-6 border-t"> {/* Added padding and border */}
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
				<section className="relative py-24 px-4 md:py-32 overflow-hidden bg-gradient-to-br from-background to-muted/30 dark:from-background dark:to-muted/10">
					{/* Removed inline style for background, using Tailwind gradients */}
					<div className="container mx-auto relative z-10 flex flex-col items-center text-center max-w-3xl">
						<Shield className="h-16 w-16 text-primary mb-6 animate-pulse-slow" /> {/* Added animation */}
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
							CertiChain: <br />Secure, Verify, Trust.
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
				<section className="py-16 md:py-20 px-4 bg-background dark:bg-muted/10">
					<div className="container mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-bold mb-4">Why Traditional Certificates Fall Short</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								In today's digital world, traditional methods face significant hurdles that compromise security, efficiency, and trust.
							</p>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
							{/* Card 1 */}
							<Card className="bg-card hover:shadow-xl transition-shadow duration-300">
								{/* FIX: Removed className from CardHeader, adjusted CardContent padding */}
								<CardHeader>
									<div className="mb-3 flex justify-center items-center h-12 w-12 rounded-full bg-destructive/10 mx-auto">
										<ShieldOff className="h-6 w-6 text-destructive" />
									</div>
									<CardTitle className="text-center text-xl">Fraud & Forgery</CardTitle>
								</CardHeader>
								<CardContent className="text-center pt-0">
									<p className="text-sm text-muted-foreground">
										Paper and basic digital copies are easily forged, undermining credential integrity.
									</p>
								</CardContent>
							</Card>
							{/* Card 2 */}
							<Card className="bg-card hover:shadow-xl transition-shadow duration-300">
								<CardHeader>
									<div className="mb-3 flex justify-center items-center h-12 w-12 rounded-full bg-yellow-500/10 mx-auto">
										<Clock className="h-6 w-6 text-yellow-500" />
									</div>
									<CardTitle className="text-center text-xl">Slow Verification</CardTitle>
								</CardHeader>
								<CardContent className="text-center pt-0">
									<p className="text-sm text-muted-foreground">
										Manual checks are time-consuming, creating bottlenecks for employers and institutions.
									</p>
								</CardContent>
							</Card>
							{/* Card 3 */}
							<Card className="bg-card hover:shadow-xl transition-shadow duration-300">
								<CardHeader>
									<div className="mb-3 flex justify-center items-center h-12 w-12 rounded-full bg-orange-500/10 mx-auto">
										<Unlink className="h-6 w-6 text-orange-500" />
									</div>
									<CardTitle className="text-center text-xl">Lack of Trust</CardTitle>
								</CardHeader>
								<CardContent className="text-center pt-0">
									<p className="text-sm text-muted-foreground">
										No single, instantly verifiable source of truth makes trusting credentials difficult.
									</p>
								</CardContent>
							</Card>
							{/* Card 4 */}
							<Card className="bg-card hover:shadow-xl transition-shadow duration-300">
								<CardHeader>
									<div className="mb-3 flex justify-center items-center h-12 w-12 rounded-full bg-blue-500/10 mx-auto">
										<Layers className="h-6 w-6 text-blue-500" />
									</div>
									<CardTitle className="text-center text-xl">Inefficiency</CardTitle>
								</CardHeader>
								<CardContent className="text-center pt-0">
									<p className="text-sm text-muted-foreground">
										Managing and re-issuing certificates is costly and inefficient for institutions.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Solution Section ("Introducing CertiChain") */}
				<section className="py-16 md:py-20 px-4 bg-background dark:bg-background">
					<div className="container mx-auto">
						<div className="text-center mb-12 md:mb-16">
							<h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
								CertiChain: The Smart Solution
							</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
								CertiChain leverages the power of blockchain technology and AI to create a secure, transparent, and efficient ecosystem for digital certificates, addressing the limitations of traditional methods.
							</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
							{/* Left Column: Benefit Points */}
							<div className="space-y-8">
								<div className="flex items-start gap-4">
									<div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg mt-1">
										<Lock className="h-6 w-6 text-primary" /> {/* Changed Icon */}
									</div>
									<div>
										<h3 className="font-semibold text-xl mb-1">Immutable Security</h3>
										<p className="text-muted-foreground text-sm">
											By anchoring certificate hashes on the blockchain, CertiChain ensures that once a certificate is issued, its record is tamper-proof and permanently verifiable.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg mt-1">
										<ShieldCheck className="h-6 w-6 text-primary" /> {/* Changed Icon */}
									</div>
									<div>
										<h3 className="font-semibold text-xl mb-1">Instant Authenticity</h3>
										<p className="text-muted-foreground text-sm">
											Verifiers can instantly check a certificate's legitimacy against the blockchain ledger, eliminating doubt and significantly reducing verification times.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg mt-1">
										<Cpu className="h-6 w-6 text-primary" /> {/* Changed Icon */}
									</div>
									<div>
										<h3 className="font-semibold text-xl mb-1">AI-Powered Verification</h3>
										<p className="text-muted-foreground text-sm">
											Our system uses advanced OCR (Optical Character Recognition) via Google Cloud Document AI to extract data from uploaded certificates, enabling verification even from scanned documents.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg mt-1">
										<Layers className="h-6 w-6 text-primary" /> {/* Changed Icon */}
									</div>
									<div>
										<h3 className="font-semibold text-xl mb-1">Streamlined Issuance</h3>
										<p className="text-muted-foreground text-sm">
											Institutions can issue individual certificates or process them in bulk via CSV uploads, with real-time tracking of the asynchronous issuance process.
										</p>
									</div>
								</div>
							</div>

							{/* Right Column: Illustrative Graphic Placeholder */}
							<div className="hidden lg:flex items-center justify-center">
								<div className="relative h-[350px] w-[350px] xl:h-[400px] xl:w-[400px] rounded-full overflow-hidden shadow-2xl border-4 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 dark:from-primary/10 dark:via-transparent dark:to-accent/5">
									{/* Placeholder for a more sophisticated graphic */}
									<Shield className="absolute inset-0 m-auto h-32 w-32 text-primary opacity-30 animate-pulse-slow" />
									<Fingerprint className="absolute top-1/4 left-1/4 h-16 w-16 text-primary/70 opacity-20 transform -rotate-12" />
									<ScanLine className="absolute bottom-1/4 right-1/4 h-16 w-16 text-primary/70 opacity-20 transform rotate-12" />
									{/* You can replace this with an actual SVG or image */}
									<div className="absolute inset-0 bg-card/10 dark:bg-card/5 backdrop-blur-xs"></div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* How It Works Section */}
				<section ref={howItWorksRef} className="py-16 md:py-20 px-4 bg-muted/20 dark:bg-muted/10">
					<div className="container mx-auto">
						<div className="text-center mb-12 md:mb-16">
							<h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
								Simple, Secure, Seamless
							</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								Our platform streamlines the entire certificate lifecycle with intuitive workflows for both issuers and verifiers.
							</p>
						</div>

						<div className="space-y-16">
							{/* Issuer Flow */}
							<div>
								<h3 className="text-2xl font-semibold mb-8 text-center">
									For <span className="text-primary">Issuers</span>
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
									<Card className="bg-card text-center hover:shadow-xl transition-shadow duration-300">
										<CardHeader>
											<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
												<FileUp className="h-8 w-8 text-primary" />
											</div>
											<CardTitle className="text-xl">1. Upload</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground">
												Easily upload certificate data individually or in large batches using our simple CSV template.
											</p>
										</CardContent>
									</Card>

									<Card className="bg-card text-center hover:shadow-xl transition-shadow duration-300">
										<CardHeader>
											<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
												<Fingerprint className="h-8 w-8 text-primary" />
											</div>
											<CardTitle className="text-xl">2. Secure & Process</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground">
												CertiChain automatically hashes content and queues it for secure recording on the blockchain.
											</p>
										</CardContent>
									</Card>

									<Card className="bg-card text-center hover:shadow-xl transition-shadow duration-300">
										<CardHeader>
											<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
												<Bell className="h-8 w-8 text-primary" />
											</div>
											<CardTitle className="text-xl">3. Track & Notify</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground">
												Monitor real-time issuance status via WebSockets. Recipients are informed upon completion.
											</p>
										</CardContent>
									</Card>
								</div>
							</div>

							{/* Verifier Flow */}
							<div>
								<h3 className="text-2xl font-semibold mb-8 text-center">
									For <span className="text-primary">Verifiers</span>
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
									<Card className="bg-card text-center hover:shadow-xl transition-shadow duration-300">
										<CardHeader>
											<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
												<FileSearch className="h-8 w-8 text-primary" />
											</div>
											<CardTitle className="text-xl">1. Upload</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground">
												Simply upload or drag-and-drop the certificate file (PDF, JPG, PNG) for verification.
											</p>
										</CardContent>
									</Card>

									<Card className="bg-card text-center hover:shadow-xl transition-shadow duration-300">
										<CardHeader>
											<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
												<Cpu className="h-8 w-8 text-primary" />
											</div>
											<CardTitle className="text-xl">2. Analyze</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground">
												Our AI-powered OCR extracts text, and the system calculates its unique cryptographic hash.
											</p>
										</CardContent>
									</Card>

									<Card className="bg-card text-center hover:shadow-xl transition-shadow duration-300">
										<CardHeader>
											<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
												<ShieldCheck className="h-8 w-8 text-primary" />
											</div>
											<CardTitle className="text-xl">3. Verify</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground">
												Instantly confirm the certificate's authenticity against immutable records on the blockchain.
											</p>
										</CardContent>
									</Card>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Key Features Section */}
				<section ref={featuresRef} className="py-16 md:py-20 px-4 bg-background">
					<div className="container mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features of CertiChain</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								Our platform offers comprehensive tools for modern certificate management and verification.
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
							{/* Card 1 */}
							<Card className="bg-card hover:shadow-xl transition-shadow duration-300">
								{/* FIX: Removed className from CardHeader */}
								<CardHeader>
									<DatabaseZap className="h-7 w-7 mb-3 text-primary" />
									<CardTitle className="text-xl">Blockchain Integrity</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Every certificate is cryptographically secured on the blockchain, ensuring immutability and tamper-proof verification.
									</p>
								</CardContent>
							</Card>
							{/* ... Other feature cards, apply similar fix to CardHeader if className was used ... */}
							<Card className="bg-card hover:shadow-xl transition-shadow duration-300">
								<CardHeader>
									<ScanLine className="h-7 w-7 mb-3 text-primary" />
									<CardTitle className="text-xl">AI-Powered OCR</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Advanced optical character recognition automatically extracts and processes information from various document formats.
									</p>
								</CardContent>
							</Card>
							<Card className="bg-card hover:shadow-xl transition-shadow duration-300">
								<CardHeader>
									{/* Assuming Sheet icon from lucide was intended for 'Sheet' as in CSV sheet */}
									<Layers className="h-7 w-7 mb-3 text-primary" />
									<CardTitle className="text-xl">Bulk Issuance</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Streamline operations by issuing multiple certificates simultaneously through our intuitive CSV upload system.
									</p>
								</CardContent>
							</Card>
							<Card className="bg-card hover:shadow-xl transition-shadow duration-300">
								<CardHeader>
									<Wifi className="h-7 w-7 mb-3 text-primary" />
									<CardTitle className="text-xl">Real-Time Tracking</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Monitor certificate status and issuance progress with live updates through a comprehensive dashboard.
									</p>
								</CardContent>
							</Card>
							<Card className="bg-card hover:shadow-xl transition-shadow duration-300">
								<CardHeader>
									<Users className="h-7 w-7 mb-3 text-primary" />
									<CardTitle className="text-xl">Role-Based Access</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Differentiated user roles for issuers and verifiers with appropriate permissions and tailored interfaces.
									</p>
								</CardContent>
							</Card>
							<Card className="bg-card hover:shadow-xl transition-shadow duration-300">
								<CardHeader>
									<ShieldCheck className="h-7 w-7 mb-3 text-primary" />
									<CardTitle className="text-xl">Comprehensive Security</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										End-to-end encryption, secure authentication, and advanced threat protection safeguard all certificate data.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Call to Action Section */}
				<section className="py-16 md:py-20 px-4 bg-muted/50 dark:bg-muted/10">
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
			<footer className="border-t py-8 md:py-12 px-4 bg-background">
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