'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {ArrowRight,LockKeyhole} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

/** Visual-only update: keep legacy sign-in behavior unchanged until a separate authentication migration. */
export default function LoginPage(){
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 const router=useRouter();
 function login(e:React.FormEvent){
   e.preventDefault();setError('');setLoading(true);
   if(email==='admin@gmail.com'&&password==='admin@gmail.com'){localStorage.setItem('admin_auth','true');router.push('/admin');}
   else{setError('Invalid admin credentials.');setLoading(false);}
 }
 return <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
   <header className="bg-white border-b border-border"><div className="container flex items-center justify-between h-20"><Link href="/" className="font-extrabold tracking-[-.07em] text-2xl">SKYRISE<span className="text-theme-2">.</span></Link><Link href="/" className="text-sm text-primary font-medium">Return to website</Link></div></header>
   <main className="flex-1 grid place-items-center p-5 py-16"><div className="surface-card w-full max-w-md p-8 md:p-10">
     <div className="w-12 h-12 bg-[#EDF3FA] text-primary rounded-xl grid place-items-center mb-7"><LockKeyhole size={24}/></div>
     <h1 className="text-3xl font-semibold tracking-tight">Admin sign in</h1><p className="text-muted-foreground mt-2 text-sm">Access website content, projects and pricing.</p>
     <form onSubmit={login} className="mt-8 space-y-5">
       {error&&<p role="alert" className="text-destructive text-sm">{error}</p>}
       <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} className="h-12" placeholder="Admin email"/></div>
       <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="h-12" placeholder="Password"/></div>
       <Button type="submit" disabled={loading} className="w-full h-12 rounded-full">{loading?'Signing in...':'Sign in'} <ArrowRight size={16} className="ml-2"/></Button>
     </form>
   </div></main>
 </div>;
}