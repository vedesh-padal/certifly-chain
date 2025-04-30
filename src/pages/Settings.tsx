
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Building, Shield, Key, Save, Eye, EyeOff } from 'lucide-react';

// Redux Imports
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';

const Settings: React.FC = () => {

	const user = useSelector(selectCurrentUser);
	const { toast } = useToast();
	const [isUpdating, setIsUpdating] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

	// Profile form state
	const [profileForm, setProfileForm] = useState({
		name: user?.name || '',
		organization: user?.organization || '',
	});

	// Email form state
	const [emailForm, setEmailForm] = useState({
		email: user?.email || '',
		confirmEmail: user?.email || '',
	});

	// Password form state
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const handleProfileSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsUpdating(true);

		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));

		// Mock success
		toast({
			title: 'Profile Updated',
			description: 'Your profile information has been updated successfully.',
		});

		setIsUpdating(false);
	};

	const handleEmailSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (emailForm.email !== emailForm.confirmEmail) {
			toast({
				title: 'Error',
				description: 'Email addresses do not match',
				variant: 'destructive',
			});
			return;
		}

		setIsUpdating(true);

		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));

		// Mock success
		toast({
			title: 'Email Updated',
			description: 'Your email address has been updated successfully.',
		});

		setIsUpdating(false);
	};

	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			toast({
				title: 'Error',
				description: 'New passwords do not match',
				variant: 'destructive',
			});
			return;
		}

		if (passwordForm.currentPassword === '') {
			toast({
				title: 'Error',
				description: 'Current password is required',
				variant: 'destructive',
			});
			return;
		}

		setIsUpdating(true);

		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));

		// Mock success
		toast({
			title: 'Password Updated',
			description: 'Your password has been updated successfully.',
		});

		// Reset form
		setPasswordForm({
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		});

		setIsUpdating(false);
	};

	return (
		<DashboardLayout>
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
					<p className="text-muted-foreground">
						Manage your account settings and preferences
					</p>
				</div>

				<Tabs defaultValue="profile" className="w-full">
					<TabsList className="mb-8">
						<TabsTrigger value="profile" className="flex items-center gap-2">
							<User className="h-4 w-4" />
							<span>Profile</span>
						</TabsTrigger>
						<TabsTrigger value="email" className="flex items-center gap-2">
							<Mail className="h-4 w-4" />
							<span>Email</span>
						</TabsTrigger>
						<TabsTrigger value="password" className="flex items-center gap-2">
							<Key className="h-4 w-4" />
							<span>Password</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="profile">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<Card className="glass-card">
								<CardHeader>
									<CardTitle>Profile Information</CardTitle>
									<CardDescription>
										Update your profile details
									</CardDescription>
								</CardHeader>
								<CardContent>
									<form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="username">Username</Label>
											<Input
												id="username"
												value={user?.username}
												disabled
												className="bg-muted/40"
											/>
											<p className="text-xs text-muted-foreground">
												Your username cannot be changed
											</p>
										</div>

										<div className="space-y-2">
											<Label htmlFor="name">Full Name</Label>
											<Input
												id="name"
												placeholder="Your full name"
												value={profileForm.name}
												onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="organization">Organization</Label>
											<Input
												id="organization"
												placeholder="Your organization name"
												value={profileForm.organization}
												onChange={(e) => setProfileForm({ ...profileForm, organization: e.target.value })}
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="account-type">Account Type</Label>
											<Input
												id="account-type"
												value={user?.role === 'issuer' ? 'Issuer' : 'Verifier'}
												disabled
												className="bg-muted/40"
											/>
											<p className="text-xs text-muted-foreground">
												Your account type determines your permissions
											</p>
										</div>
									</form>
								</CardContent>
								<CardFooter>
									<Button
										type="submit"
										form="profile-form"
										className="w-full"
										disabled={isUpdating}
									>
										{isUpdating ? (
											<>
												<span className="mr-2">Updating</span>
												<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
											</>
										) : (
											<>
												<Save className="mr-2 h-4 w-4" />
												Save Changes
											</>
										)}
									</Button>
								</CardFooter>
							</Card>

							<div className="flex flex-col gap-6">
								<Card className="glass-card">
									<CardHeader>
										<CardTitle>Account Summary</CardTitle>
										<CardDescription>
											Overview of your account details
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center gap-4">
											<div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
												<span className="text-xl font-medium">
													{user?.username?.charAt(0).toUpperCase() || 'U'}
												</span>
											</div>
											<div>
												<h3 className="text-lg font-semibold">{user?.username}</h3>
												<p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
											</div>
										</div>

										<div className="pt-4 space-y-4">
											<div className="flex items-center gap-3">
												<User className="h-5 w-5 text-muted-foreground" />
												<div>
													<p className="text-xs text-muted-foreground">Full Name</p>
													<p className="text-sm font-medium">{profileForm.name || 'Not set'}</p>
												</div>
											</div>

											<div className="flex items-center gap-3">
												<Mail className="h-5 w-5 text-muted-foreground" />
												<div>
													<p className="text-xs text-muted-foreground">Email Address</p>
													<p className="text-sm font-medium">{user?.email}</p>
												</div>
											</div>

											<div className="flex items-center gap-3">
												<Building className="h-5 w-5 text-muted-foreground" />
												<div>
													<p className="text-xs text-muted-foreground">Organization</p>
													<p className="text-sm font-medium">{profileForm.organization || 'Not set'}</p>
												</div>
											</div>

											<div className="flex items-center gap-3">
												<Shield className="h-5 w-5 text-muted-foreground" />
												<div>
													<p className="text-xs text-muted-foreground">Account Type</p>
													<p className="text-sm font-medium capitalize">{user?.role}</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="email">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<Card className="glass-card">
								<CardHeader>
									<CardTitle>Email Address</CardTitle>
									<CardDescription>
										Update your email address
									</CardDescription>
								</CardHeader>
								<CardContent>
									<form id="email-form" onSubmit={handleEmailSubmit} className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="current-email">Current Email</Label>
											<Input
												id="current-email"
												value={user?.email}
												disabled
												className="bg-muted/40"
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="new-email">New Email Address</Label>
											<Input
												id="new-email"
												type="email"
												placeholder="Enter new email address"
												value={emailForm.email}
												onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="confirm-email">Confirm Email Address</Label>
											<Input
												id="confirm-email"
												type="email"
												placeholder="Confirm new email address"
												value={emailForm.confirmEmail}
												onChange={(e) => setEmailForm({ ...emailForm, confirmEmail: e.target.value })}
											/>
										</div>
									</form>
								</CardContent>
								<CardFooter>
									<Button
										type="submit"
										form="email-form"
										className="w-full"
										disabled={isUpdating || !emailForm.email || !emailForm.confirmEmail}
									>
										{isUpdating ? (
											<>
												<span className="mr-2">Updating</span>
												<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
											</>
										) : (
											<>
												<Save className="mr-2 h-4 w-4" />
												Update Email
											</>
										)}
									</Button>
								</CardFooter>
							</Card>

							<div className="space-y-6">
								<Card className="glass-card">
									<CardHeader>
										<CardTitle>Email Notifications</CardTitle>
										<CardDescription>
											Manage your email notification preferences
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<h4 className="text-sm font-medium">Certificate Issuance</h4>
												<p className="text-xs text-muted-foreground">
													Receive notifications when certificates are issued
												</p>
											</div>
											<div>
												<Button variant="outline" size="sm">Enabled</Button>
											</div>
										</div>

										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<h4 className="text-sm font-medium">Certificate Verification</h4>
												<p className="text-xs text-muted-foreground">
													Receive notifications when certificates are verified
												</p>
											</div>
											<div>
												<Button variant="outline" size="sm">Enabled</Button>
											</div>
										</div>

										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<h4 className="text-sm font-medium">Account Updates</h4>
												<p className="text-xs text-muted-foreground">
													Receive notifications about account changes
												</p>
											</div>
											<div>
												<Button variant="outline" size="sm">Enabled</Button>
											</div>
										</div>
									</CardContent>
								</Card>

								<div className="p-4 rounded-lg bg-muted/50 border border-border">
									<div className="flex items-start gap-3">
										<Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
										<div>
											<h3 className="text-sm font-medium mb-1">Email Verification</h3>
											<p className="text-xs text-muted-foreground">
												When you change your email address, a verification link will be sent to the new email.
												You must click this link to confirm the change.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="password">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<Card className="glass-card">
								<CardHeader>
									<CardTitle>Change Password</CardTitle>
									<CardDescription>
										Update your account password
									</CardDescription>
								</CardHeader>
								<CardContent>
									<form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="current-password">Current Password</Label>
											<div className="relative">
												<Input
													id="current-password"
													type={showPassword ? 'text' : 'password'}
													placeholder="Enter your current password"
													value={passwordForm.currentPassword}
													onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute right-0 top-0 h-full px-3"
													onClick={() => setShowPassword(!showPassword)}
												>
													{showPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
													<span className="sr-only">
														{showPassword ? 'Hide password' : 'Show password'}
													</span>
												</Button>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="new-password">New Password</Label>
											<div className="relative">
												<Input
													id="new-password"
													type={showNewPassword ? 'text' : 'password'}
													placeholder="Enter new password"
													value={passwordForm.newPassword}
													onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute right-0 top-0 h-full px-3"
													onClick={() => setShowNewPassword(!showNewPassword)}
												>
													{showNewPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
													<span className="sr-only">
														{showNewPassword ? 'Hide password' : 'Show password'}
													</span>
												</Button>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="confirm-password">Confirm New Password</Label>
											<Input
												id="confirm-password"
												type="password"
												placeholder="Confirm new password"
												value={passwordForm.confirmPassword}
												onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
											/>
										</div>
									</form>
								</CardContent>
								<CardFooter>
									<Button
										type="submit"
										form="password-form"
										className="w-full"
										disabled={
											isUpdating ||
											!passwordForm.currentPassword ||
											!passwordForm.newPassword ||
											!passwordForm.confirmPassword ||
											passwordForm.newPassword.length < 6
										}
									>
										{isUpdating ? (
											<>
												<span className="mr-2">Updating</span>
												<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
											</>
										) : (
											<>
												<Key className="mr-2 h-4 w-4" />
												Change Password
											</>
										)}
									</Button>
								</CardFooter>
							</Card>

							<div className="space-y-6">
								<Card className="glass-card">
									<CardHeader>
										<CardTitle>Password Security</CardTitle>
										<CardDescription>
											Tips for creating a strong password
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-start gap-3">
											<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
												1
											</div>
											<div className="space-y-1">
												<p className="text-sm font-medium">Use a minimum of 8 characters</p>
												<p className="text-xs text-muted-foreground">
													Longer passwords are harder to crack
												</p>
											</div>
										</div>

										<div className="flex items-start gap-3">
											<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
												2
											</div>
											<div className="space-y-1">
												<p className="text-sm font-medium">Mix uppercase and lowercase letters</p>
												<p className="text-xs text-muted-foreground">
													Adds complexity to your password
												</p>
											</div>
										</div>

										<div className="flex items-start gap-3">
											<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
												3
											</div>
											<div className="space-y-1">
												<p className="text-sm font-medium">Include numbers and special characters</p>
												<p className="text-xs text-muted-foreground">
													Makes your password even more secure
												</p>
											</div>
										</div>

										<div className="flex items-start gap-3">
											<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
												4
											</div>
											<div className="space-y-1">
												<p className="text-sm font-medium">Avoid personal information</p>
												<p className="text-xs text-muted-foreground">
													Don't use names, birthdates, or common words
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<div className="p-4 rounded-lg bg-muted/50 border border-border">
									<div className="flex items-start gap-3">
										<Key className="h-5 w-5 text-muted-foreground mt-0.5" />
										<div>
											<h3 className="text-sm font-medium mb-1">Password Security Notice</h3>
											<p className="text-xs text-muted-foreground">
												For security reasons, you will be logged out when you change your password.
												You'll need to log in again with your new password.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</DashboardLayout>
	);
};

export default Settings;
