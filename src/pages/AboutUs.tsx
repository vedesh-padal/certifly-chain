// src/pages/AboutUs.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Shield, ArrowLeft, Users, Github, Linkedin, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from '@/components/ui-custom/ThemeToggle';

// Define a type for team members
interface TeamMember {
	name: string;
	role: string;
	// bio?: string; // Optional short bio
	github?: string;
	linkedin?: string;
	avatarPlaceholder: string; // For initial letters
}

const teamMembers: TeamMember[] = [
	// Replace with your actual team details
	{ name: "Vedesh Padal", role: "Project Lead & Backend Developer", github: "https://github.com/vedesh-padal", avatarPlaceholder: "VP" },
	{ name: "Tanmay Subhedar", role: "Full Stack Developer & Great Insights giver", github: "https://github.com/TanmaySubhedar", avatarPlaceholder: "TS" },
	{ name: "Mohd. Areef", role: "Full Stack Developer - Backend Heavy", github: "https://github.com/MohdAreef", avatarPlaceholder: "MA" },
	// Add more team members as needed
];

const AboutUs: React.FC = () => {
	const currentYear = new Date().getFullYear();

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
				<div className="max-w-3xl mx-auto">
					<div className="text-center mb-12">
						<Users className="h-16 w-16 text-primary mx-auto mb-4" />
						<h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">About CertiChain</h1>
						<p className="text-lg text-muted-foreground">
							Learn more about the project, our mission, and the team behind CertiChain.
						</p>
					</div>

					<section className="mb-12 prose prose-sm sm:prose-base dark:prose-invert max-w-none">
						<h2 className="text-3xl font-bold mb-4 !text-foreground">Our Mission</h2>
						<p>
							CertiChain was developed as an academic project with the mission to explore and demonstrate how blockchain technology can enhance the security, verifiability, and efficiency of digital certificate management. We aim to provide a practical example of a system that addresses common challenges in traditional credentialing processes.
						</p>
						<p>
							Our vision is to create a trustworthy ecosystem where educational institutions can issue tamper-proof digital certificates, and employers or other entities can instantly and reliably verify their authenticity, thereby reducing fraud and streamlining verification.
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-3xl font-bold mb-8 text-center">Meet the Team</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
							{teamMembers.map((member) => (
								<Card key={member.name} className="glass-card text-center">
									<CardHeader className="items-center">
										<Avatar className="w-24 h-24 mb-4 border-2 border-primary/50">
											{/* <AvatarImage src="/path-to-image.jpg" alt={member.name} /> */}
											<AvatarFallback className="text-3xl bg-muted">
												{member.avatarPlaceholder || member.name.split(' ').map(n => n[0]).join('')}
											</AvatarFallback>
										</Avatar>
										<CardTitle className="text-xl">{member.name}</CardTitle>
										<CardDescription>{member.role}</CardDescription>
									</CardHeader>
									{/* <CardContent>
                {member.bio && <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>}
            </CardContent> */}

									<CardFooter className="flex justify-center items-center gap-3 pt-2 pb-6 min-h-[some-fixed-value]">

										{member.github && (
											<Button variant="outline" size="icon" asChild>
												<a href={member.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s GitHub`}>
													<Github className="h-5 w-5" />
												</a>
											</Button>
										)}
										{member.linkedin && (
											<Button variant="outline" size="icon" asChild>
												<a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn`}>
													<Linkedin className="h-5 w-5" />
												</a>
											</Button>
										)}
									</CardFooter>
								</Card>
							))}
						</div>
						<div className="mt-8 text-center prose prose-sm sm:prose-base dark:prose-invert max-w-none">
							<h3 className="text-xl font-semibold mb-2 !text-foreground">Faculty Mentor</h3>
							<p>
								This project was developed under the invaluable guidance of <b>Prof. K. Shyamala</b>. <br />We extend our sincere gratitude for their mentorship and support.
							</p>
						</div>
					</section>

					<section className="mb-12">
						<h2 className="text-3xl font-bold mb-6 text-center">Project Repositories</h2>
						<div className="flex flex-col sm:flex-row justify-center items-center gap-4">
							<Button variant="default" size="lg" asChild>
								<a href="https://github.com/vedesh-padal/cert-atv-backend" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
									<Github className="h-5 w-5" /> Backend on GitHub
								</a>
							</Button>
							<Button variant="default" size="lg" asChild>
								<a href="https://github.com/vedesh-padal/certifly-chain/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
									<Github className="h-5 w-5" /> Frontend on GitHub
								</a>
							</Button>
						</div>
					</section>

					<div className="text-center mt-16">
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

export default AboutUs;