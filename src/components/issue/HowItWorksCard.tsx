import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const HowItWorksCard: React.FC = () => {
	return (
		<Card className="glass-card">
			<CardHeader>
				<CardTitle>How It Works</CardTitle>
				<CardDescription>
					The single certificate issuance process explained
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Step 1 */}
				<div className="flex gap-4">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">1</div>
					<div className="space-y-1">
						<p className="text-sm font-medium">Upload Certificate</p>
						<p className="text-xs text-muted-foreground">Upload the digital certificate document (PDF, JPG, PNG)</p>
					</div>
				</div>
				{/* Step 2 */}
				<div className="flex gap-4">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">2</div>
					<div className="space-y-1">
						<p className="text-sm font-medium">Enter Details</p>
						<p className="text-xs text-muted-foreground">Add recipient information and certificate details</p>
					</div>
				</div>
				{/* Step 3 */}
				<div className="flex gap-4">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">3</div>
					<div className="space-y-1">
						<p className="text-sm font-medium">Queue & Process</p>
						<p className="text-xs text-muted-foreground">Job is queued. Backend performs OCR & hashing.</p>
					</div>
				</div>
				{/* Step 4 */}
				<div className="flex gap-4">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">4</div>
					<div className="space-y-1">
						<p className="text-sm font-medium">Blockchain Storage</p>
						<p className="text-xs text-muted-foreground">Hash is stored on the blockchain via available wallet.</p>
					</div>
				</div>
				{/* Step 5 */}
				<div className="flex gap-4">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">5</div>
					<div className="space-y-1">
						<p className="text-sm font-medium">Notification</p>
						<p className="text-xs text-muted-foreground">Real-time status updates via WebSockets. (Email later).</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};