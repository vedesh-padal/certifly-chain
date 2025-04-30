import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Eye, EyeOff, FileCheck } from 'lucide-react';

// --- Redux Imports ---
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import {
	loginUser,
	registerUser,
	selectIsAuthenticated,
	selectAuthIsLoading,
	selectAuthError,
	clearAuthError // Action to clear error state
} from '@/features/auth/authSlice';
// --- End Redux Imports ---

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/types';

const loginSchema = z.object({
	username: z.string().min(3, 'Username must be at least 3 characters'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
	username: z.string().min(3, 'Username must be at least 3 characters'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	confirmPassword: z.string(),
	role: z.enum(['issuer', 'verifier'] as const),
}).refine(data => data.password === data.confirmPassword, {
	message: 'Passwords do not match',
	path: ['confirmPassword'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Login: React.FC = () => {

	// --- Redux State/Dispatch ---
	const dispatch = useDispatch<AppDispatch>();
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const isLoading = useSelector(selectAuthIsLoading);
	const authError = useSelector(selectAuthError);
	// --- End Redux State/Dispatch ---

	const navigate = useNavigate();
	const { toast } = useToast();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

	// Login form
	const loginForm = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	// Register form
	const registerForm = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
			role: 'issuer',
		},
	});

	// --- Effect to show auth errors as toasts ---
	useEffect(() => {
		if (authError) {
			toast({
				title: 'Authentication Failed',
				description: authError,
				variant: 'destructive',
			});
			// Optionally clear the error from Redux state after showing toast
			dispatch(clearAuthError());
		}
	}, [authError, dispatch, toast]);

	const onLoginSubmit = async (data: LoginFormValues) => {
		// Dispatch the loginUser thunk
		// Use unwrap() to automatically handle rejected state and re-throw error
		// Or handle resultAction manually as before
		try {
			await dispatch(loginUser({ usernameOrEmail: data.username, password: data.password })).unwrap();
			// Navigation happens automatically below due to isAuthenticated change --- but it is not happening with the below useEffect (now commented out)
			// navigate('/dashboard'); // Can remove this if redirect below works reliably
			navigate('/dashboard', { replace: true }); // Navigate explicitly HERE
		} catch (rejectedValueOrSerializedError) {
			// Error is already handled by the useEffect showing the toast
			console.error('Login failed:', rejectedValueOrSerializedError);
		}
	};

	const onRegisterSubmit = async (data: RegisterFormValues) => {
		try {
			await dispatch(registerUser({
				username: data.username,
				email: data.email,
				password: data.password,
				role: data.role,
				// name: data.name, // Add if these fields are in the form
				// organization: data.organization
			})).unwrap();
			toast({ title: 'Registration Successful', description: 'Please log in.' });
			// Switch to login tab after successful registration
			setActiveTab('login');
			loginForm.reset(); // Clear login form
			registerForm.reset(); // Clear register form
			// navigate('/dashboard'); // Usually don't navigate directly after register	-- keeping this commented, as direclty after registering should not login directly
		} catch (rejectedValueOrSerializedError) {
			// Error is already handled by the useEffect showing the toast
			console.error('Registration failed:', rejectedValueOrSerializedError);
		}
	};

	// --- Redirect if already authenticated ---
	// This effect runs when isAuthenticated changes
	useEffect(() => {
		if (isAuthenticated) {
			console.log("Login component: User authenticated, navigating to dashboard.");
			navigate('/dashboard', { replace: true });
		}
	}, [isAuthenticated, navigate]);


	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4 md:p-6">
			<div className="w-full max-w-md mx-auto">
				<div className="flex flex-col items-center mb-8">
					<Shield className="h-12 w-12 text-primary mb-4" />
					<h1 className="text-3xl font-bold tracking-tight">CertiChain</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Blockchain-based certificate verification
					</p>
				</div>

				<Tabs
					value={activeTab}
					onValueChange={(value) => setActiveTab(value as 'login' | 'register')}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="login">Login</TabsTrigger>
						<TabsTrigger value="register">Register</TabsTrigger>
					</TabsList>

					<TabsContent value="login" className="mt-4">
						<Card className="glass-card">
							<CardHeader>
								<CardTitle>Login</CardTitle>
								<CardDescription>
									Enter your credentials to access your account
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Form {...loginForm}>
									<form
										id="login-form"
										onSubmit={loginForm.handleSubmit(onLoginSubmit)}
										className="space-y-4"
									>
										<FormField
											control={loginForm.control}
											name="username"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Username</FormLabel>
													<FormControl>
														<Input placeholder="Enter your username" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={loginForm.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Password</FormLabel>
													<FormControl>
														<div className="relative">
															<Input
																type={showPassword ? 'text' : 'password'}
																placeholder="Enter your password"
																{...field}
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
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</form>
								</Form>
							</CardContent>
							<CardFooter>
								<Button
									type="submit"
									form="login-form"
									className="w-full"
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<span className="mr-2">Logging in</span>
											<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
										</>
									) : (
										'Login'
									)}
								</Button>
							</CardFooter>
						</Card>
					</TabsContent>

					<TabsContent value="register" className="mt-4">
						<Card className="glass-card">
							<CardHeader>
								<CardTitle>Create an account</CardTitle>
								<CardDescription>
									Register to start issuing or verifying certificates
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Form {...registerForm}>
									<form
										id="register-form"
										onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
										className="space-y-4"
									>
										<FormField
											control={registerForm.control}
											name="username"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Username</FormLabel>
													<FormControl>
														<Input placeholder="Choose a username" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={registerForm.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															type="email"
															placeholder="Enter your email"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={registerForm.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Password</FormLabel>
													<FormControl>
														<div className="relative">
															<Input
																type={showPassword ? 'text' : 'password'}
																placeholder="Create a password"
																{...field}
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
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={registerForm.control}
											name="confirmPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Confirm Password</FormLabel>
													<FormControl>
														<div className="relative">
															<Input
																type={showConfirmPassword ? 'text' : 'password'}
																placeholder="Confirm your password"
																{...field}
															/>
															<Button
																type="button"
																variant="ghost"
																size="icon"
																className="absolute right-0 top-0 h-full px-3"
																onClick={() => setShowConfirmPassword(!showConfirmPassword)}
															>
																{showConfirmPassword ? (
																	<EyeOff className="h-4 w-4" />
																) : (
																	<Eye className="h-4 w-4" />
																)}
																<span className="sr-only">
																	{showConfirmPassword ? 'Hide password' : 'Show password'}
																</span>
															</Button>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={registerForm.control}
											name="role"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Account Type</FormLabel>
													<div className="grid grid-cols-2 gap-4 mt-2">
														<Button
															type="button"
															className={`flex flex-col items-center justify-center gap-2 h-auto p-4 ${field.value === 'issuer'
																? 'bg-primary text-primary-foreground'
																: 'bg-muted text-muted-foreground hover:bg-muted/80'
																}`}
															onClick={() => field.onChange('issuer' as UserRole)}
														>
															<Shield className="h-5 w-5" />
															<span className="text-sm font-medium">Issuer</span>
															<span className="text-xs text-center">
																{field.value === 'issuer'
																	? 'Selected'
																	: 'Issue certificates'}
															</span>
														</Button>
														<Button
															type="button"
															className={`flex flex-col items-center justify-center gap-2 h-auto p-4 ${field.value === 'verifier'
																? 'bg-primary text-primary-foreground'
																: 'bg-muted text-muted-foreground hover:bg-muted/80'
																}`}
															onClick={() => field.onChange('verifier' as UserRole)}
														>
															<FileCheck className="h-5 w-5" />
															<span className="text-sm font-medium">Verifier</span>
															<span className="text-xs text-center">
																{field.value === 'verifier'
																	? 'Selected'
																	: 'Verify certificates'}
															</span>
														</Button>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
									</form>
								</Form>
							</CardContent>
							<CardFooter>
								<Button
									type="submit"
									form="register-form"
									className="w-full"
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<span className="mr-2">Creating account</span>
											<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
										</>
									) : (
										'Create Account'
									)}
								</Button>
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs>

				{/* <p className="text-center text-xs text-muted-foreground mt-6">
					For demo, use: username "issuer" or "verifier" with password "password"
				</p> */}
			</div>
		</div>
	);
};

export default Login;
