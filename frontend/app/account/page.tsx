// src/app/account/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/src/hooks/use-toast';
import { Icons } from '@/components/icons';
import type { UserProfile } from '@/src/lib/types';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function AccountPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userCredential;
      if (isLoginView) {
        // Login
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Success', description: 'Logged in successfully!' });
      } else {
        // Sign Up
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user profile in Firestore
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'host', // Default new sign-ups to host
          createdAt: new Date(),
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);

        toast({ title: 'Welcome!', description: 'Account created successfully.' });
      }
      router.push('/'); // Redirect to dashboard after login/signup
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Create user profile if it doesn't exist
         const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'host',
          createdAt: new Date(),
        };
        await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });

        toast({ title: 'Success', description: 'Logged in with Google!' });
        router.push('/');

    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'Google Sign-In Error',
            description: error.message,
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-accent">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">{isLoginView ? 'Welcome Back!' : 'Create an Account'}</CardTitle>
          <CardDescription>
            {isLoginView ? 'Log in to continue planning.' : 'Sign up to start planning the perfect baby shower.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuthAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                required
              />
            </div>
            <div className="flex justify-end">
              {isLoginView && <Link href="/account/reset-password"><Button variant="link" type="button" className="text-xs p-0 h-auto">Forgot Password?</Button></Link>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isLoginView ? 'Log In' : 'Sign Up'}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
            <Icons.Google className="mr-2 h-4 w-4" /> Google
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isLoginView ? "Don't have an account?" : 'Already have an account?'}
            <Button
              variant="link"
              className="ml-1 p-0 h-auto"
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView ? 'Sign up' : 'Log in'}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

