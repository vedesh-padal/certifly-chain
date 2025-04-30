import React, { useState, useEffect, useCallback } from 'react'; // Added useEffect, useCallback
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
// --- Redux Imports ---
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { selectCurrentUser } from '@/features/auth/authSlice'; // Get current user info
import {
	updateUserProfile,
	updateUserPassword,
	updateUserNotifications,
	// Selectors for loading/error states
	selectIsProfileUpdating,
	selectProfileUpdateError,
	selectIsPasswordUpdating,
	selectPasswordUpdateError,
	selectIsNotificationsUpdating,
	selectNotificationsUpdateError,
	// Actions to clear errors
	clearProfileUpdateError,
	clearPasswordUpdateError,
	clearNotificationsUpdateError,
} from '@/features/user/userSlice';
// --- End Redux Imports ---
// import { useAuth } from '@/contexts/AuthContext'; // <-- REMOVE
import { User, Mail, Building, Shield, Key, Save, Eye, EyeOff } from 'lucide-react';
// Import Switch component if needed for notifications
import { Switch } from "@/components/ui/switch";


const Settings: React.FC = () => {
	// --- Redux State Access ---
	const dispatch = useDispatch<AppDispatch>();
	const { toast } = useToast();

	// --- Get Data and Status from Redux Store ---
	const currentUser = useSelector(selectCurrentUser);
	const isProfileUpdating = useSelector(selectIsProfileUpdating);
	const profileUpdateError = useSelector(selectProfileUpdateError);
	const isPasswordUpdating = useSelector(selectIsPasswordUpdating);
	const passwordUpdateError = useSelector(selectPasswordUpdateError);
	const isNotificationsUpdating = useSelector(selectIsNotificationsUpdating);
	const notificationsUpdateError = useSelector(selectNotificationsUpdateError);

	// --- Local State ONLY for Form Inputs ---
	// Initialize local form state from Redux state once, then manage locally
	const [profileName, setProfileName] = useState('');
	const [profileOrg, setProfileOrg] = useState('');
	const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
	// Notification state is directly read/updated via Redux for simplicity here
	// Local state for password visibility
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

	// --- Effect to initialize/update local form state when Redux user changes ---
	useEffect(() => {
		if (currentUser) {
			setProfileName(currentUser.name || '');
			setProfileOrg(currentUser.organization || '');
			// No need to set local state for notifications if directly dispatching
		}
	}, [currentUser]); // Re-run if currentUser object changes

	// --- Effects to show toasts on errors ---
	useEffect(() => {
		if (profileUpdateError) {
			toast({ title: 'Profile Update Failed', description: profileUpdateError, variant: 'destructive' });
			dispatch(clearProfileUpdateError()); // Clear error after showing
		}
	}, [profileUpdateError, dispatch, toast]);

	useEffect(() => {
		if (passwordUpdateError) {
			toast({ title: 'Password Change Failed', description: passwordUpdateError, variant: 'destructive' });
			dispatch(clearPasswordUpdateError());
		}
	}, [passwordUpdateError, dispatch, toast]);

	useEffect(() => {
		if (notificationsUpdateError) {
			toast({ title: 'Notification Update Failed', description: notificationsUpdateError, variant: 'destructive' });
			dispatch(clearNotificationsUpdateError());
		}
	}, [notificationsUpdateError, dispatch, toast]);


	// --- Submit Handlers (Dispatch Thunks using local form state) ---
	const handleProfileSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		// Dispatch thunk with current local form state
		const resultAction = await dispatch(updateUserProfile({ name: profileName, organization: profileOrg }));
		if (updateUserProfile.fulfilled.match(resultAction)) {
			toast({ title: 'Profile Updated', description: resultAction.payload });
		}
	}, [dispatch, profileName, profileOrg, toast]);

	const handlePasswordSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		if (passwordForm.newPassword !== passwordForm.confirmPassword) { /* ... toast error ... */ return; }
		if (passwordForm.newPassword.length < 6) { /* ... toast error ... */ return; }

		const resultAction = await dispatch(updateUserPassword({
			currentPassword: passwordForm.currentPassword,
			newPassword: passwordForm.newPassword,
		}));

		if (updateUserPassword.fulfilled.match(resultAction)) {
			toast({ title: 'Password Updated', description: resultAction.payload });
			setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Reset local form
			setShowCurrentPassword(false);
			setShowNewPassword(false);
		}
	}, [dispatch, passwordForm, toast]);

	// Handler for notification toggle changes - Dispatches directly
	const handleNotificationChange = (key: 'issuance' | 'verification' | 'accountUpdates', checked: boolean) => {
		// Dispatch update immediately on change
		dispatch(updateUserNotifications({ [key]: checked }))
			.unwrap()
			.then((message) => toast({ title: 'Notification Setting Updated', description: message }))
			.catch(() => { /* Error handled by useEffect */ });
	};


	// Placeholder for email change submit
	const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		toast({ title: 'Info', description: 'Email change functionality not fully implemented yet.' });
		// TODO: Implement email change logic using a thunk later	--- EMail notification feature --- TODO LATER
	}, [toast]);


	return (
		<DashboardLayout>
			<div className="flex flex-col gap-8">
				{/* Header */}
				<div className="flex flex-col gap-2"> <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1> <p className="text-muted-foreground"> Manage your account settings and preferences </p> </div>

				{/* Tabs */}
				<Tabs defaultValue="profile" className="w-full">
					<TabsList className="mb-8">
						<TabsTrigger value="profile" className="flex items-center gap-2"> <User className="h-4 w-4" /> <span>Profile</span> </TabsTrigger>
						<TabsTrigger value="notifications" className="flex items-center gap-2"> <Mail className="h-4 w-4" /> <span>Notifications</span> </TabsTrigger>
						<TabsTrigger value="password" className="flex items-center gap-2"> <Key className="h-4 w-4" /> <span>Password</span> </TabsTrigger>
					</TabsList>

					{/* Profile Tab */}
					<TabsContent value="profile">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<Card className="glass-card">
								<CardHeader> <CardTitle>Profile Information</CardTitle> <CardDescription> Update your profile details </CardDescription> </CardHeader>
								<CardContent>
									{/* Use local state for controlled inputs */}
									<form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-4">
										{/* Username (disabled, reads from Redux user) */}
										<div className="space-y-2"> <Label htmlFor="username">Username</Label> <Input id="username" value={currentUser?.username || ''} disabled className="bg-muted/40" /> <p className="text-xs text-muted-foreground"> Your username cannot be changed </p> </div>
										{/* Full Name (controlled by local state) */}
										<div className="space-y-2"> <Label htmlFor="name">Full Name</Label> <Input id="name" placeholder="Your full name" value={profileName} onChange={(e) => setProfileName(e.target.value)} /> </div>
										{/* Organization (controlled by local state) */}
										<div className="space-y-2"> <Label htmlFor="organization">Organization</Label> <Input id="organization" placeholder="Your organization name" value={profileOrg} onChange={(e) => setProfileOrg(e.target.value)} /> </div>
										{/* Account Type (disabled, reads from Redux user) */}
										<div className="space-y-2"> <Label htmlFor="account-type">Account Type</Label> <Input id="account-type" value={currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : ''} disabled className="bg-muted/40" /> <p className="text-xs text-muted-foreground"> Your account type determines your permissions </p> </div>
									</form>
								</CardContent>
								<CardFooter>
									{/* Use Redux loading state */}
									<Button type="submit" form="profile-form" className="w-full" disabled={isProfileUpdating}>
										{isProfileUpdating ? 'Updating...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
									</Button>
								</CardFooter>
							</Card>
							{/* Account Summary Card (reads directly from Redux user) */}
							<div className="flex flex-col gap-6">
								<Card className="glass-card">
									<CardHeader> <CardTitle>Account Summary</CardTitle> <CardDescription> Overview of your account details </CardDescription> </CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center gap-4"> <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center"> <span className="text-xl font-medium"> {currentUser?.username?.charAt(0).toUpperCase() || 'U'} </span> </div> <div> <h3 className="text-lg font-semibold">{currentUser?.username}</h3> <p className="text-sm text-muted-foreground capitalize">{currentUser?.role}</p> </div> </div>
										<div className="pt-4 space-y-4">
											<div className="flex items-center gap-3"> <User className="h-5 w-5 text-muted-foreground" /> <div> <p className="text-xs text-muted-foreground">Full Name</p> <p className="text-sm font-medium">{currentUser?.name || 'Not set'}</p> </div> </div>
											<div className="flex items-center gap-3"> <Mail className="h-5 w-5 text-muted-foreground" /> <div> <p className="text-xs text-muted-foreground">Email Address</p> <p className="text-sm font-medium">{currentUser?.email}</p> </div> </div>
											<div className="flex items-center gap-3"> <Building className="h-5 w-5 text-muted-foreground" /> <div> <p className="text-xs text-muted-foreground">Organization</p> <p className="text-sm font-medium">{currentUser?.organization || 'Not set'}</p> </div> </div>
											<div className="flex items-center gap-3"> <Shield className="h-5 w-5 text-muted-foreground" /> <div> <p className="text-xs text-muted-foreground">Account Type</p> <p className="text-sm font-medium capitalize">{currentUser?.role}</p> </div> </div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					{/* Notifications Tab */}
					<TabsContent value="notifications">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<Card className="glass-card lg:col-span-2">
								<CardHeader> <CardTitle>Email Notifications</CardTitle> <CardDescription> Manage your email notification preferences. Changes are saved automatically. </CardDescription> </CardHeader>
								<CardContent className="space-y-6 pt-4">
									{/* Read checked state directly from Redux user, dispatch changes */}
									<div className="flex items-center justify-between p-4 rounded-lg border bg-background/50">
										<div className="space-y-0.5"> <Label htmlFor="issuance-notif" className="text-sm font-medium">Certificate Issuance</Label> <p className="text-xs text-muted-foreground"> Receive notifications when certificates are issued/queued. </p> </div>
										<Switch id="issuance-notif" checked={currentUser?.notifications?.issuance ?? true} onCheckedChange={(checked) => handleNotificationChange('issuance', checked)} disabled={isNotificationsUpdating} />
									</div>
									<div className="flex items-center justify-between p-4 rounded-lg border bg-background/50">
										<div className="space-y-0.5"> <Label htmlFor="verification-notif" className="text-sm font-medium">Certificate Verification</Label> <p className="text-xs text-muted-foreground"> Receive notifications on verification results (if applicable). </p> </div>
										<Switch id="verification-notif" checked={currentUser?.notifications?.verification ?? true} onCheckedChange={(checked) => handleNotificationChange('verification', checked)} disabled={isNotificationsUpdating} />
									</div>
									<div className="flex items-center justify-between p-4 rounded-lg border bg-background/50">
										<div className="space-y-0.5"> <Label htmlFor="account-notif" className="text-sm font-medium">Account Updates</Label> <p className="text-xs text-muted-foreground"> Receive notifications about important account changes. </p> </div>
										<Switch id="account-notif" checked={currentUser?.notifications?.accountUpdates ?? true} onCheckedChange={(checked) => handleNotificationChange('accountUpdates', checked)} disabled={isNotificationsUpdating} />
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Password Tab */}
					<TabsContent value="password">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<Card className="glass-card">
								<CardHeader> <CardTitle>Change Password</CardTitle> <CardDescription> Update your account password </CardDescription> </CardHeader>
								<CardContent>
									{/* Use local passwordForm state for controlled inputs */}
									<form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-4">
										{/* Current Password */}
										<div className="space-y-2"> <Label htmlFor="current-password">Current Password</Label> <div className="relative"> <Input id="current-password" type={showCurrentPassword ? 'text' : 'password'} placeholder="Enter your current password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} /> <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowCurrentPassword(!showCurrentPassword)}> {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} </Button> </div> </div>
										{/* New Password */}
										<div className="space-y-2"> <Label htmlFor="new-password">New Password</Label> <div className="relative"> <Input id="new-password" type={showNewPassword ? 'text' : 'password'} placeholder="Enter new password (min 6 chars)" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} /> <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowNewPassword(!showNewPassword)}> {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} </Button> </div> </div>
										{/* Confirm New Password */}
										<div className="space-y-2"> <Label htmlFor="confirm-password">Confirm New Password</Label> <Input id="confirm-password" type="password" placeholder="Confirm new password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} /> </div>
									</form>
								</CardContent>
								<CardFooter>
									{/* Use Redux loading state */}
									<Button type="submit" form="password-form" className="w-full" disabled={isPasswordUpdating || !passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword.length < 6 || passwordForm.newPassword !== passwordForm.confirmPassword}>
										{isPasswordUpdating ? 'Updating...' : <><Key className="mr-2 h-4 w-4" /> Change Password</>}
									</Button>
								</CardFooter>
							</Card>
							{/* Password Security Guide Card */}
							<div className="space-y-6"> <Card className="glass-card"> {/* ... */} </Card> <div className="p-4 rounded-lg bg-muted/50 border border-border"> {/* ... */} </div> </div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</DashboardLayout>
	);
};

export default Settings;


// 	return (
// 		<DashboardLayout>
// 			<div className="flex flex-col gap-8">
// 				<div className="flex flex-col gap-2">
// 					<h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
// 					<p className="text-muted-foreground">
// 						Manage your account settings and preferences
// 					</p>
// 				</div>

// 				<Tabs defaultValue="profile" className="w-full">
// 					<TabsList className="mb-8">
// 						<TabsTrigger value="profile" className="flex items-center gap-2">
// 							<User className="h-4 w-4" />
// 							<span>Profile</span>
// 						</TabsTrigger>
// 						<TabsTrigger value="email" className="flex items-center gap-2">
// 							<Mail className="h-4 w-4" />
// 							<span>Email</span>
// 						</TabsTrigger>
// 						<TabsTrigger value="password" className="flex items-center gap-2">
// 							<Key className="h-4 w-4" />
// 							<span>Password</span>
// 						</TabsTrigger>
// 					</TabsList>

// 					<TabsContent value="profile">
// 						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// 							<Card className="glass-card">
// 								<CardHeader>
// 									<CardTitle>Profile Information</CardTitle>
// 									<CardDescription>
// 										Update your profile details
// 									</CardDescription>
// 								</CardHeader>
// 								<CardContent>
// 									<form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-4">
// 										<div className="space-y-2">
// 											<Label htmlFor="username">Username</Label>
// 											<Input
// 												id="username"
// 												value={user?.username}
// 												disabled
// 												className="bg-muted/40"
// 											/>
// 											<p className="text-xs text-muted-foreground">
// 												Your username cannot be changed
// 											</p>
// 										</div>

// 										<div className="space-y-2">
// 											<Label htmlFor="name">Full Name</Label>
// 											<Input
// 												id="name"
// 												placeholder="Your full name"
// 												value={profileForm.name}
// 												onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
// 											/>
// 										</div>

// 										<div className="space-y-2">
// 											<Label htmlFor="organization">Organization</Label>
// 											<Input
// 												id="organization"
// 												placeholder="Your organization name"
// 												value={profileForm.organization}
// 												onChange={(e) => setProfileForm({ ...profileForm, organization: e.target.value })}
// 											/>
// 										</div>

// 										<div className="space-y-2">
// 											<Label htmlFor="account-type">Account Type</Label>
// 											<Input
// 												id="account-type"
// 												value={user?.role === 'issuer' ? 'Issuer' : 'Verifier'}
// 												disabled
// 												className="bg-muted/40"
// 											/>
// 											<p className="text-xs text-muted-foreground">
// 												Your account type determines your permissions
// 											</p>
// 										</div>
// 									</form>
// 								</CardContent>
// 								<CardFooter>
// 									<Button
// 										type="submit"
// 										form="profile-form"
// 										className="w-full"
// 										disabled={isUpdating}
// 									>
// 										{isUpdating ? (
// 											<>
// 												<span className="mr-2">Updating</span>
// 												<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
// 											</>
// 										) : (
// 											<>
// 												<Save className="mr-2 h-4 w-4" />
// 												Save Changes
// 											</>
// 										)}
// 									</Button>
// 								</CardFooter>
// 							</Card>

// 							<div className="flex flex-col gap-6">
// 								<Card className="glass-card">
// 									<CardHeader>
// 										<CardTitle>Account Summary</CardTitle>
// 										<CardDescription>
// 											Overview of your account details
// 										</CardDescription>
// 									</CardHeader>
// 									<CardContent className="space-y-4">
// 										<div className="flex items-center gap-4">
// 											<div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
// 												<span className="text-xl font-medium">
// 													{user?.username?.charAt(0).toUpperCase() || 'U'}
// 												</span>
// 											</div>
// 											<div>
// 												<h3 className="text-lg font-semibold">{user?.username}</h3>
// 												<p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
// 											</div>
// 										</div>

// 										<div className="pt-4 space-y-4">
// 											<div className="flex items-center gap-3">
// 												<User className="h-5 w-5 text-muted-foreground" />
// 												<div>
// 													<p className="text-xs text-muted-foreground">Full Name</p>
// 													<p className="text-sm font-medium">{profileForm.name || 'Not set'}</p>
// 												</div>
// 											</div>

// 											<div className="flex items-center gap-3">
// 												<Mail className="h-5 w-5 text-muted-foreground" />
// 												<div>
// 													<p className="text-xs text-muted-foreground">Email Address</p>
// 													<p className="text-sm font-medium">{user?.email}</p>
// 												</div>
// 											</div>

// 											<div className="flex items-center gap-3">
// 												<Building className="h-5 w-5 text-muted-foreground" />
// 												<div>
// 													<p className="text-xs text-muted-foreground">Organization</p>
// 													<p className="text-sm font-medium">{profileForm.organization || 'Not set'}</p>
// 												</div>
// 											</div>

// 											<div className="flex items-center gap-3">
// 												<Shield className="h-5 w-5 text-muted-foreground" />
// 												<div>
// 													<p className="text-xs text-muted-foreground">Account Type</p>
// 													<p className="text-sm font-medium capitalize">{user?.role}</p>
// 												</div>
// 											</div>
// 										</div>
// 									</CardContent>
// 								</Card>
// 							</div>
// 						</div>
// 					</TabsContent>

// 					<TabsContent value="email">
// 						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// 							<Card className="glass-card">
// 								<CardHeader>
// 									<CardTitle>Email Address</CardTitle>
// 									<CardDescription>
// 										Update your email address
// 									</CardDescription>
// 								</CardHeader>
// 								<CardContent>
// 									<form id="email-form" onSubmit={handleEmailSubmit} className="space-y-4">
// 										<div className="space-y-2">
// 											<Label htmlFor="current-email">Current Email</Label>
// 											<Input
// 												id="current-email"
// 												value={user?.email}
// 												disabled
// 												className="bg-muted/40"
// 											/>
// 										</div>

// 										<div className="space-y-2">
// 											<Label htmlFor="new-email">New Email Address</Label>
// 											<Input
// 												id="new-email"
// 												type="email"
// 												placeholder="Enter new email address"
// 												value={emailForm.email}
// 												onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
// 											/>
// 										</div>

// 										<div className="space-y-2">
// 											<Label htmlFor="confirm-email">Confirm Email Address</Label>
// 											<Input
// 												id="confirm-email"
// 												type="email"
// 												placeholder="Confirm new email address"
// 												value={emailForm.confirmEmail}
// 												onChange={(e) => setEmailForm({ ...emailForm, confirmEmail: e.target.value })}
// 											/>
// 										</div>
// 									</form>
// 								</CardContent>
// 								<CardFooter>
// 									<Button
// 										type="submit"
// 										form="email-form"
// 										className="w-full"
// 										disabled={isUpdating || !emailForm.email || !emailForm.confirmEmail}
// 									>
// 										{isUpdating ? (
// 											<>
// 												<span className="mr-2">Updating</span>
// 												<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
// 											</>
// 										) : (
// 											<>
// 												<Save className="mr-2 h-4 w-4" />
// 												Update Email
// 											</>
// 										)}
// 									</Button>
// 								</CardFooter>
// 							</Card>

// 							<div className="space-y-6">
// 								<Card className="glass-card">
// 									<CardHeader>
// 										<CardTitle>Email Notifications</CardTitle>
// 										<CardDescription>
// 											Manage your email notification preferences
// 										</CardDescription>
// 									</CardHeader>
// 									<CardContent className="space-y-4">
// 										<div className="flex items-center justify-between">
// 											<div className="space-y-0.5">
// 												<h4 className="text-sm font-medium">Certificate Issuance</h4>
// 												<p className="text-xs text-muted-foreground">
// 													Receive notifications when certificates are issued
// 												</p>
// 											</div>
// 											<div>
// 												<Button variant="outline" size="sm">Enabled</Button>
// 											</div>
// 										</div>

// 										<div className="flex items-center justify-between">
// 											<div className="space-y-0.5">
// 												<h4 className="text-sm font-medium">Certificate Verification</h4>
// 												<p className="text-xs text-muted-foreground">
// 													Receive notifications when certificates are verified
// 												</p>
// 											</div>
// 											<div>
// 												<Button variant="outline" size="sm">Enabled</Button>
// 											</div>
// 										</div>

// 										<div className="flex items-center justify-between">
// 											<div className="space-y-0.5">
// 												<h4 className="text-sm font-medium">Account Updates</h4>
// 												<p className="text-xs text-muted-foreground">
// 													Receive notifications about account changes
// 												</p>
// 											</div>
// 											<div>
// 												<Button variant="outline" size="sm">Enabled</Button>
// 											</div>
// 										</div>
// 									</CardContent>
// 								</Card>

// 								<div className="p-4 rounded-lg bg-muted/50 border border-border">
// 									<div className="flex items-start gap-3">
// 										<Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
// 										<div>
// 											<h3 className="text-sm font-medium mb-1">Email Verification</h3>
// 											<p className="text-xs text-muted-foreground">
// 												When you change your email address, a verification link will be sent to the new email.
// 												You must click this link to confirm the change.
// 											</p>
// 										</div>
// 									</div>
// 								</div>
// 							</div>
// 						</div>
// 					</TabsContent>

// 					<TabsContent value="password">
// 						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// 							<Card className="glass-card">
// 								<CardHeader>
// 									<CardTitle>Change Password</CardTitle>
// 									<CardDescription>
// 										Update your account password
// 									</CardDescription>
// 								</CardHeader>
// 								<CardContent>
// 									<form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-4">
// 										<div className="space-y-2">
// 											<Label htmlFor="current-password">Current Password</Label>
// 											<div className="relative">
// 												<Input
// 													id="current-password"
// 													type={showPassword ? 'text' : 'password'}
// 													placeholder="Enter your current password"
// 													value={passwordForm.currentPassword}
// 													onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
// 												/>
// 												<Button
// 													type="button"
// 													variant="ghost"
// 													size="icon"
// 													className="absolute right-0 top-0 h-full px-3"
// 													onClick={() => setShowPassword(!showPassword)}
// 												>
// 													{showPassword ? (
// 														<EyeOff className="h-4 w-4" />
// 													) : (
// 														<Eye className="h-4 w-4" />
// 													)}
// 													<span className="sr-only">
// 														{showPassword ? 'Hide password' : 'Show password'}
// 													</span>
// 												</Button>
// 											</div>
// 										</div>

// 										<div className="space-y-2">
// 											<Label htmlFor="new-password">New Password</Label>
// 											<div className="relative">
// 												<Input
// 													id="new-password"
// 													type={showNewPassword ? 'text' : 'password'}
// 													placeholder="Enter new password"
// 													value={passwordForm.newPassword}
// 													onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
// 												/>
// 												<Button
// 													type="button"
// 													variant="ghost"
// 													size="icon"
// 													className="absolute right-0 top-0 h-full px-3"
// 													onClick={() => setShowNewPassword(!showNewPassword)}
// 												>
// 													{showNewPassword ? (
// 														<EyeOff className="h-4 w-4" />
// 													) : (
// 														<Eye className="h-4 w-4" />
// 													)}
// 													<span className="sr-only">
// 														{showNewPassword ? 'Hide password' : 'Show password'}
// 													</span>
// 												</Button>
// 											</div>
// 										</div>

// 										<div className="space-y-2">
// 											<Label htmlFor="confirm-password">Confirm New Password</Label>
// 											<Input
// 												id="confirm-password"
// 												type="password"
// 												placeholder="Confirm new password"
// 												value={passwordForm.confirmPassword}
// 												onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
// 											/>
// 										</div>
// 									</form>
// 								</CardContent>
// 								<CardFooter>
// 									<Button
// 										type="submit"
// 										form="password-form"
// 										className="w-full"
// 										disabled={
// 											isUpdating ||
// 											!passwordForm.currentPassword ||
// 											!passwordForm.newPassword ||
// 											!passwordForm.confirmPassword ||
// 											passwordForm.newPassword.length < 6
// 										}
// 									>
// 										{isUpdating ? (
// 											<>
// 												<span className="mr-2">Updating</span>
// 												<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
// 											</>
// 										) : (
// 											<>
// 												<Key className="mr-2 h-4 w-4" />
// 												Change Password
// 											</>
// 										)}
// 									</Button>
// 								</CardFooter>
// 							</Card>

// 							<div className="space-y-6">
// 								<Card className="glass-card">
// 									<CardHeader>
// 										<CardTitle>Password Security</CardTitle>
// 										<CardDescription>
// 											Tips for creating a strong password
// 										</CardDescription>
// 									</CardHeader>
// 									<CardContent className="space-y-4">
// 										<div className="flex items-start gap-3">
// 											<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
// 												1
// 											</div>
// 											<div className="space-y-1">
// 												<p className="text-sm font-medium">Use a minimum of 8 characters</p>
// 												<p className="text-xs text-muted-foreground">
// 													Longer passwords are harder to crack
// 												</p>
// 											</div>
// 										</div>

// 										<div className="flex items-start gap-3">
// 											<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
// 												2
// 											</div>
// 											<div className="space-y-1">
// 												<p className="text-sm font-medium">Mix uppercase and lowercase letters</p>
// 												<p className="text-xs text-muted-foreground">
// 													Adds complexity to your password
// 												</p>
// 											</div>
// 										</div>

// 										<div className="flex items-start gap-3">
// 											<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
// 												3
// 											</div>
// 											<div className="space-y-1">
// 												<p className="text-sm font-medium">Include numbers and special characters</p>
// 												<p className="text-xs text-muted-foreground">
// 													Makes your password even more secure
// 												</p>
// 											</div>
// 										</div>

// 										<div className="flex items-start gap-3">
// 											<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
// 												4
// 											</div>
// 											<div className="space-y-1">
// 												<p className="text-sm font-medium">Avoid personal information</p>
// 												<p className="text-xs text-muted-foreground">
// 													Don't use names, birthdates, or common words
// 												</p>
// 											</div>
// 										</div>
// 									</CardContent>
// 								</Card>

// 								<div className="p-4 rounded-lg bg-muted/50 border border-border">
// 									<div className="flex items-start gap-3">
// 										<Key className="h-5 w-5 text-muted-foreground mt-0.5" />
// 										<div>
// 											<h3 className="text-sm font-medium mb-1">Password Security Notice</h3>
// 											<p className="text-xs text-muted-foreground">
// 												For security reasons, you will be logged out when you change your password.
// 												You'll need to log in again with your new password.
// 											</p>
// 										</div>
// 									</div>
// 								</div>
// 							</div>
// 						</div>
// 					</TabsContent>
// 				</Tabs>
// 			</div>
// 		</DashboardLayout>
// 	);
// };

// export default Settings;
