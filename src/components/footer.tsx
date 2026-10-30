'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {Send,MessageCircle} from 'lucide-react';
import {onValue,push,ref} from 'firebase/database';
import {db} from '@/lib/firebase';
import {getWhatsAppHref} from '@/lib/contact';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';

export default function Footer(){
 const whatsappHref=getWhatsAppHref();
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[message,setMessage]=useState('');
 const [sending,setSending]=useState(false),[sent,setSent]=useState(false),[error,setError]=useState<string|null>(null);
 const [content,setContent]=useState({contactHeading:"Let's build something great.",contactText:"Tell us what you're trying to achieve. We'll help you find the right next step.",col1Header:'Global Delivery',col1Text:'Supporting businesses across North America, Europe and Africa.',col2Header:'Our Focus',col2Text:'Websites, e-commerce, platforms and custom software.',companyName:'SKYRISE',copyright:'SkyRise Softwares. All Rights Reserved.'});
 useEffect(()=>onValue(ref(db,'content/footer'),snapshot=>{if(snapshot.exists())setContent(snapshot.val());}),[]);
 async function submit(e:React.FormEvent){
   e.preventDefault();if(!name.trim()||!email.trim()||!message.trim())return;
   setSending(true);setError(null);setSent(false);
   try{await push(ref(db,'messages'),{name:name.trim(),email:email.trim(),message:message.trim(),createdAt:new Date().toISOString()});setSent(true);setName('');setEmail('');setMessage('');}
   catch(e){setError(e instanceof Error?e.message:'Unable to send your message. Please try again.');}
   finally{setSending(false);}
 }
 return <footer id="contact" className="scroll-mt-24 bg-[#F8FAFC] border-t border-border pt-24 pb-8">
   <div className="container">
     <div className="grid lg:grid-cols-[1fr_.9fr] gap-12 lg:gap-24 pb-20">
       <div><p className="section-eyebrow mb-5">Start a conversation</p><h2 className="section-heading max-w-xl">{content.contactHeading}</h2><p className="section-lead mt-5 max-w-xl">{content.contactText}</p><p className="text-sm text-muted-foreground mt-8">From a new website to a complex platform, we would love to hear about your plans.</p></div>
       <form onSubmit={submit} className="surface-card p-7 md:p-8 space-y-5">
         <div><label htmlFor="contact-name" className="block text-sm font-medium mb-2">Your name</label><Input id="contact-name" autoComplete="name" required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="h-12 bg-white"/></div>
         <div><label htmlFor="contact-email" className="block text-sm font-medium mb-2">Email address</label><Input id="contact-email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" className="h-12 bg-white"/></div>
         <div><label htmlFor="contact-message" className="block text-sm font-medium mb-2">What can we help you build?</label><Textarea id="contact-message" required value={message} onChange={e=>setMessage(e.target.value)} className="min-h-[135px] bg-white" placeholder="Tell us about your business and goals..."/></div>
         {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}
         {sent&&<p role="status" className="text-sm text-green-700">Thanks — your message was sent.</p>}
         <div className="flex flex-col sm:flex-row gap-3"><Button type="submit" className="h-12 rounded-full flex-1" disabled={sending}>{sending?'Sending...':'Send enquiry'} <Send size={16} className="ml-2"/></Button>
           {whatsappHref&&<Button asChild variant="outline" className="h-12 rounded-full bg-white"><a href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4"/>WhatsApp</a></Button>}
         </div>
       </form>
     </div>
     <div className="grid md:grid-cols-3 gap-8 py-10 border-t border-border">
       <div><Link href="/" className="font-extrabold text-2xl tracking-[-.07em]">SKYRISE<span className="text-theme-2">.</span></Link><p className="text-sm text-muted-foreground mt-3">Well-built digital experiences for ambitious businesses.</p></div>
       <div><p className="font-semibold text-sm mb-3">{content.col1Header}</p><p className="text-muted-foreground text-sm leading-relaxed">{content.col1Text}</p></div>
       <div><p className="font-semibold text-sm mb-3">{content.col2Header}</p><p className="text-muted-foreground text-sm leading-relaxed">{content.col2Text}</p></div>
     </div>
     <div className="border-t border-border pt-7 flex flex-col md:flex-row md:justify-between gap-4 text-xs text-muted-foreground"><p>© {new Date().getFullYear()} {content.copyright}</p>
       <nav className="flex flex-wrap gap-6"><Link href="/#projects" className="hover:text-primary">Our Work</Link><Link href="/#pricing" className="hover:text-primary">Pricing</Link><Link href="/how-it-works" className="hover:text-primary">How It Works</Link><Link href="/login" className="hover:text-primary">Admin</Link></nav>
     </div>
   </div>
 </footer>;
}