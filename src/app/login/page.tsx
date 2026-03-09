"use client";

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md mb-8 flex justify-center">
        <a href="/" className="font-logo text-2xl tracking-widest text-primary hover:text-primary/80 transition-colors">SKYRISE</a>
      </div>
      <div className="w-full max-w-md space-y-8 bg-secondary/10 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-3xl font-logo uppercase tracking-widest text-primary">Admin Login</h2>
          <p className="text-muted-foreground mt-2 font-code">Sign in to manage projects and messages</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 border-white/10"
            />
            <Input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50 border-white/10"
            />
          </div>
          
          <Button type="submit" className="w-full font-code uppercase tracking-wider" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
