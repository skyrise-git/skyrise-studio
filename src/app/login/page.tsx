"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lock, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin@gmail.com');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Static credential check
    if (email === 'admin@gmail.com' && password === 'admin@gmail.com') {
      // Set a flag in localStorage to simulate being "logged in" for the layout guard
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_auth', 'true');
      }
      router.push('/admin');
    } else {
      setError('Invalid admin credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 relative overflow-hidden isolate">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10s]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[40vw] h-[40vw] bg-secondary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[8s] delay-700" />
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-logo font-bold text-background text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">S</div>
            <span className="font-logo text-3xl tracking-[0.2em] text-primary group-hover:text-primary/80 transition-colors">SKYRISE</span>
          </Link>
        </div>
        
        <Card className="bg-secondary/10 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <CardHeader className="space-y-3 pb-6 text-center">
            <CardTitle className="text-3xl font-logo uppercase tracking-widest text-primary pt-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="font-code text-sm uppercase tracking-wider text-muted-foreground/80">
              Direct Admin Access Enabled
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-xl text-sm font-medium animate-in shake duration-300 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-ping" />
                  {error}
                </div>
              )}
              
              <div className="space-y-5">
                <div className="space-y-2 group">
                  <Label htmlFor="email" className="text-xs font-code uppercase tracking-widest text-muted-foreground ml-1 group-focus-within:text-primary transition-colors">
                    Admin Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@gmail.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-14 bg-background/50 border-white/5 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-xl text-md transition-all placeholder:text-muted-foreground/30 shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                   <Label htmlFor="password" className="text-xs font-code uppercase tracking-widest text-muted-foreground ml-1 group-focus-within:text-primary transition-colors">
                    Admin Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 h-14 bg-background/50 border-white/5 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-xl text-md transition-all placeholder:text-muted-foreground/30 shadow-inner"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-14 font-code uppercase tracking-[0.2em] rounded-xl text-sm group relative overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]" 
                disabled={loading}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Entering...
                    </>
                  ) : (
                    <>
                      Login to Dashboard
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-white/5 pt-6 pb-6">
            <p className="text-xs text-muted-foreground/50 font-code tracking-wider text-center flex items-center gap-2">
              <Lock className="w-3 h-3" /> Static Admin Credentials
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
