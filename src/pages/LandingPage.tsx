
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
	// ChevronDown,
	Menu
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

				{/* Solution Section */}
				<section className="py-16 md:py-20 px-4 bg-background">
					{/* ... (Content seems okay, ensure responsive layout for text and image) ... */}
				</section>

				{/* How It Works Section */}
				<section ref={howItWorksRef} className="py-16 md:py-20 px-4 bg-muted/50 dark:bg-muted/10">
					{/* ... (Content seems okay, ensure cards are styled well) ... */}
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