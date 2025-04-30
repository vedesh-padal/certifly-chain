
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, 
  FileCheck, 
  LogOut, 
  Settings, 
  Menu, 
  X, 
  Home 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui-custom/ThemeToggle';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { 
      path: user?.role === 'issuer' ? '/issue' : '/verify', 
      label: user?.role === 'issuer' ? 'Issue Certificate' : 'Verify Certificate', 
      icon: user?.role === 'issuer' ? <FileCheck className="h-4 w-4" /> : <Shield className="h-4 w-4" /> 
    },
    { path: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 dark:bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-semibold text-xl tracking-tight">CertiChain</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {user && navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to={item.path} className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle variant="ghost" />

            {user && (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm font-medium">{user.username}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">User menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="cursor-pointer w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile Navigation */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-2">
                          <Shield className="h-6 w-6 text-primary" />
                          <span className="font-semibold text-lg">CertiChain</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThemeToggle />
                          <Button variant="ghost" size="icon" onClick={() => setIsSheetOpen(false)}>
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                          </Button>
                        </div>
                      </div>
                      <nav className="flex flex-col gap-1 mt-4">
                        {navigationItems.map((item) => (
                          <Button
                            key={item.path}
                            variant={isActive(item.path) ? "default" : "ghost"}
                            className="justify-start"
                            onClick={() => {
                              navigate(item.path);
                              setIsSheetOpen(false);
                            }}
                          >
                            {item.icon}
                            <span className="ml-2">{item.label}</span>
                          </Button>
                        ))}
                      </nav>
                      <div className="mt-auto py-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center">
                              <span className="font-medium text-sm">{user.username.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{user.username}</p>
                              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                            </div>
                          </div>
                        </div>
                        <Button variant="destructive" className="w-full" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
