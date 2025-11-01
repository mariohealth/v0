'use client'
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Fingerprint, Shield, Eye, Face, Mail, User, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface MarioLoginProps {
  onLogin: () => void;
  onSignUp: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function MarioLogin({ onLogin, onSignUp, onBack, showBackButton = false }: MarioLoginProps) {
  const [biometricPulse, setBiometricPulse] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'biometric' | 'email' | 'username' | null>(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBiometricAuth = async () => {
    setBiometricPulse(true);
    setIsLoading(true);
    
    // Simulate biometric authentication
    setTimeout(() => {
      setBiometricPulse(false);
      setIsLoading(false);
      onLogin();
    }, 2000);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleUsernameLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mario-focus-ring"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-2xl font-semibold text-primary">mario</h1>
        <div className="w-10" /> {/* Spacer for center alignment */}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="p-8 mario-shadow-elevated">
            {/* Logo and Welcome */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="text-2xl font-bold text-primary-foreground">M</div>
              </div>
              
              <h2 className="text-3xl font-bold text-accent mb-2">
                Welcome to Mario
              </h2>
              <p className="text-base text-muted-foreground">
                Your health, simplified.
              </p>
            </div>

            {/* Biometric Authentication */}
            {loginMethod !== 'email' && loginMethod !== 'username' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-8"
              >
                <motion.button
                  onClick={handleBiometricAuth}
                  disabled={isLoading}
                  className={`
                    w-20 h-20 rounded-full border border-primary bg-card
                    flex items-center justify-center mx-auto mb-4
                    hover:bg-primary/5 active:scale-95
                    mario-focus-ring mario-transition
                    ${biometricPulse ? 'animate-pulse' : ''}
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  aria-label="Sign in with biometrics"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={biometricPulse ? { 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1]
                    } : {}}
                    transition={{ duration: 1, repeat: biometricPulse ? Infinity : 0 }}
                  >
                    <Fingerprint className="h-8 w-8 text-primary" />
                  </motion.div>
                </motion.button>
                
                <p className="text-sm text-muted-foreground mb-2">
                  Sign in with Face ID
                </p>
                
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Secure login • HIPAA Compliant</span>
                </div>
              </motion.div>
            )}

            {/* Divider */}
            {loginMethod !== 'email' && loginMethod !== 'username' && (
              <div className="relative mb-8">
                <Separator className="absolute top-1/2 left-0 right-0" />
                <div className="relative flex justify-center">
                  <span className="bg-card px-4 text-sm text-muted-foreground">or</span>
                </div>
              </div>
            )}

            {/* Standard Sign-In Buttons */}
            {loginMethod === null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 mb-8"
              >
                <Button
                  onClick={() => setLoginMethod('email')}
                  className="w-full mario-focus-ring mario-button-scale"
                  size="lg"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Sign in with Email
                </Button>
                
                <Button
                  onClick={() => setLoginMethod('username')}
                  variant="outline"
                  className="w-full mario-focus-ring mario-button-scale hover:bg-accent/10"
                  size="lg"
                >
                  <User className="h-5 w-5 mr-2" />
                  Sign in with Username
                </Button>
              </motion.div>
            )}

            {/* Email Login Form */}
            {loginMethod === 'email' && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleEmailLogin}
                className="space-y-6 mb-8"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="mario-focus-ring"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="mario-focus-ring"
                    required
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLoginMethod(null)}
                    className="flex-1 mario-focus-ring"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !email || !password}
                    className="flex-1 mario-focus-ring mario-button-scale"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
              </motion.form>
            )}

            {/* Username Login Form */}
            {loginMethod === 'username' && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleUsernameLogin}
                className="space-y-6 mb-8"
              >
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="mario-focus-ring"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-username">Password</Label>
                  <Input
                    id="password-username"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="mario-focus-ring"
                    required
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLoginMethod(null)}
                    className="flex-1 mario-focus-ring"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !username || !password}
                    className="flex-1 mario-focus-ring mario-button-scale"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
              </motion.form>
            )}

            {/* Bottom Section */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={onSignUp}
                  className="text-accent hover:text-accent/80 font-medium mario-focus-ring rounded-sm mario-transition"
                >
                  Sign up
                </button>
              </p>
            </div>
          </Card>

          {/* Trust Footer */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Protected by end-to-end encryption</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}