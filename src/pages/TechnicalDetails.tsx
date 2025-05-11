// src/pages/TechnicalDetails.tsx
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Shield, ArrowLeft, Wifi, DatabaseZap, Lock, Cpu, Server, Layers, Network, GitFork, Cloud, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ThemeToggle } from '@/components/ui-custom/ThemeToggle'; // Assuming you want theme toggle here too

const TechnicalDetails: React.FC = () => {
	const currentYear = new Date().getFullYear();

	const PROJECT_FLOW_DIAGRAM_LINK = import.meta.env.VITE_PROJECT_FLOW_DIAGRAM_LINK || "https://tinyurl.com/36cake8f";

	const techItems = [
		{
			icon: <Layers className="h-8 w-8 text-primary mb-3" />,
			title: "Frontend Application",
			description: "A responsive React (TypeScript) single-page application using Shadcn UI and Tailwind CSS for a modern user experience, with Redux Toolkit for robust state management."
		},
		{
			icon: <Server className="h-8 w-8 text-primary mb-3" />,
			title: "Backend API Server",
			description: "Built with Node.js and Express.js, handling API requests, business logic, and service orchestration. Secured with JWTs, Helmet, CORS, and rate limiting."
		},
		{
			icon: <DatabaseZap className="h-8 w-8 text-primary mb-3" />,
			title: "Database (MongoDB)",
			description: "MongoDB stores user accounts, roles, preferences, and certificate metadata (upon issuance). Mongoose ODM is used for data modeling."
		},
		{
			icon: <Radio className="h-8 w-8 text-primary mb-3" />, // Representing Redis/Queue
			title: "Job Queue & Worker (Redis & BullMQ)",
			description: "Manages asynchronous tasks like certificate issuance, ensuring UI responsiveness. Redis also handles the status of the blockchain wallet pool."
		},
		{
			icon: <Network className="h-8 w-8 text-primary mb-3" />,
			title: "Blockchain Interaction (Ethers.js)",
			description: "Ethers.js facilitates communication with the Ethereum blockchain (Sepolia testnet) via an RPC provider for smart contract interactions."
		},
		{
			icon: <GitFork className="h-8 w-8 text-primary mb-3" />, // Representing Smart Contract logic
			title: "Smart Contract (Solidity)",
			description: "The CertVerification.sol contract stores immutable cryptographic hashes of certificates, serving as the verifiable source of truth."
		},
		{
			icon: <Cpu className="h-8 w-8 text-primary mb-3" />,
			title: "Google Cloud Document AI",
			description: "Leveraged for its powerful OCR capabilities to extract text from various uploaded certificate document formats."
		},
		{
			icon: <Cloud className="h-8 w-8 text-primary mb-3" />,
			title: "Google Drive API",
			description: "Securely accesses certificate files (via a service account) provided by issuers in bulk CSV flows for processing."
		},
		{
			icon: <Wifi className="h-8 w-8 text-primary mb-3" />, // Re-using Wifi for Socket.IO
			title: "Real-time Communication (Socket.IO)",
			description: "Provides instant status updates to users during asynchronous processes like bulk certificate issuance."
		}
	];

	return (
		<div className="flex flex-col min-h-screen bg-background text-foreground">
			{/* Simplified Header */}
			<header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
				<div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
					<RouterLink to="/" className="flex items-center gap-2">
						<Shield className="h-8 w-8 text-primary" />
						<span className="font-semibold text-xl tracking-tight">CertiChain</span>
					</RouterLink>
					<div className="flex items-center gap-2">
						<ThemeToggle variant="ghost" />
						<Button variant="outline" size="sm" asChild>
							<RouterLink to="/" className="flex items-center gap-1">
								<ArrowLeft className="h-4 w-4" />
								Back to Home
							</RouterLink>
						</Button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1 container mx-auto px-4 py-12 sm:py-16">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Technical Overview</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							CertiChain is built on a modern, robust technology stack designed for security, scalability, and reliability. This page provides an overview of the key architectural components and technologies that power our platform.
						</p>
					</div>

					{/* Architecture Diagram Placeholder */}
					<Card className="mb-12 glass-card">
						<CardHeader>
							<CardTitle className="text-2xl">System Architecture</CardTitle>
							<CardDescription>
								A high-level view of how CertiChain components interact.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex items-center justify-center bg-muted/30 rounded-md overflow-hidden cursor-pointer">
							<Dialog>
								<DialogTrigger asChild>
									<img
										src={PROJECT_FLOW_DIAGRAM_LINK}
										alt="System Architecture Diagram"
										className="w-full h-auto object-contain rounded-md shadow-md transition-transform duration-300 hover:scale-105"
										style={{ maxHeight: '600px' }} // Adjust max height as needed
									/>
								</DialogTrigger>
								<DialogContent className="max-w-none max-h-screen flex items-center justify-center p-6">
									<img
										src={PROJECT_FLOW_DIAGRAM_LINK}
										alt="Enlarged System Architecture Diagram"
										className="max-h-screen max-w-screen object-contain"
									/>
								</DialogContent>
							</Dialog>
						</CardContent>
					</Card>


					<section className="mb-12">
						<h2 className="text-3xl font-bold mb-8 text-center">Core Technology Stack</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{techItems.map((item) => (
								<Card key={item.title} className="glass-card flex flex-col">
									<CardHeader className="items-center text-center">
										{item.icon}
										<CardTitle className="text-xl">{item.title}</CardTitle>
									</CardHeader>
									<CardContent className="flex-grow">
										<p className="text-sm text-muted-foreground">{item.description}</p>
									</CardContent>
								</Card>
							))}
						</div>
					</section>

					<section className="mb-12 prose prose-sm sm:prose-base dark:prose-invert max-w-none">
						<h2 className="text-3xl font-bold mb-6 !text-foreground">Key Concepts Explained</h2>

						<div className="space-y-6">
							<div>
								<h3 className="text-xl font-semibold mb-2 !text-foreground">Blockchain & Hashing</h3>
								<p>
									We don't store certificates directly on the blockchain due to cost and privacy. Instead, a unique cryptographic hash (a digital fingerprint generated using SHA-256) of each certificate's content is recorded. Any alteration to the certificate results in a completely different hash, ensuring tamper-evidence. This hash is stored on the immutable Sepolia testnet ledger.
								</p>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2 !text-foreground">Smart Contracts (Solidity)</h3>
								<p>
									Our `CertVerification.sol` smart contract, written in Solidity, defines the on-chain logic. It provides functions to allow authorized accounts (via the Wallet Pool) to store new certificate hashes and allows anyone to verify if a given hash exists on the ledger.
								</p>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2 !text-foreground">OCR & AI</h3>
								<p>
									To verify certificates that might be scanned images or non-text PDFs, we utilize Google Cloud Document AI. Its advanced OCR capabilities convert visual content into structured text, which is then used for hashing and verification, ensuring broad compatibility.
								</p>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2 !text-foreground">Asynchronous Processing & Scalability</h3>
								<p>
									Certificate issuance, particularly writing to the blockchain, can be time-consuming. We employ BullMQ with Redis as a robust job queue system. This allows issuance tasks to be processed in the background, keeping the user interface responsive. Our backend Wallet Pool enables concurrent blockchain transactions by using multiple distinct Ethereum accounts, significantly improving throughput during peak loads. Real-time status updates are provided via WebSockets.
								</p>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2 !text-foreground">Security Measures</h3>
								<p>
									User authentication is secured using JSON Web Tokens (JWTs) and strong password hashing (bcryptjs). API endpoints are protected with role-based access control. Standard web security practices, including Helmet for HTTP header protection, CORS configuration, and rate limiting, are employed to safeguard the application.
								</p>
							</div>
						</div>
					</section>

					<div className="text-center mt-12">
						<Button asChild size="lg">
							<RouterLink to="/">Return to Homepage</RouterLink>
						</Button>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t py-8 mt-12 bg-background">
				<div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
					<p>© {currentYear} CertiChain. All Rights Reserved.</p>
				</div>
			</footer>
		</div>
	);
};

export default TechnicalDetails;