"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, get, query, orderByChild, onValue } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { MessageSquare, RefreshCw } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeMessages: () => void;

    try {
      const messagesRef = query(ref(db, 'messages'), orderByChild('createdAt'));
      
      unsubscribeMessages = onValue(messagesRef, (snapshot) => {
        const fetched: any[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            fetched.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });
        }
        setMessages(fetched.reverse());
        setLoadingMessages(false);
        setErrorMsg(null);
      }, (err: any) => {
        console.error("Error listening to messages:", err);
        setErrorMsg(err.message || "Failed to listen to messages");
        setLoadingMessages(false);
      });
    } catch (err: any) {
      console.error("Database error:", err);
      setErrorMsg(err.message || "Failed to query database");
      setLoadingMessages(false);
    }

    return () => {
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, []);

  const fetchMessages = () => {
    setErrorMsg(null);
    setLoadingMessages(true);
    get(query(ref(db, 'messages'), orderByChild('createdAt')))
      .then(snapshot => {
        const fetched: any[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((child) => { fetched.push({ id: child.key, ...child.val() }); });
        }
        setMessages(fetched.reverse());
        setLoadingMessages(false);
      })
      .catch(err => {
        console.error("Error fetching messages:", err);
        setErrorMsg(err.message || "Failed to fetch messages manually");
        setLoadingMessages(false);
      });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/5 rounded-2xl border border-white/5 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 text-primary rounded-xl border border-primary/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-logo uppercase">Recent Inquiries</h1>
            <p className="text-muted-foreground font-code text-sm">Review client messages</p>
          </div>
        </div>
        <Button onClick={fetchMessages} variant="outline" className="border-white/10 hover:bg-white/5" disabled={loadingMessages}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loadingMessages ? 'animate-spin' : ''}`} />
          {loadingMessages ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {errorMsg && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl mb-6 shadow-sm">
          {errorMsg}
        </div>
      )}

      {messages.length === 0 && !loadingMessages && !errorMsg && (
        <div className="text-center py-20 bg-secondary/5 border border-white/5 rounded-2xl">
          <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white">No messages yet</h3>
          <p className="text-muted-foreground text-sm mt-1">Inquiries from the contact form will appear here.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {messages.map(msg => (
          <div key={msg.id} className="group bg-secondary/5 hover:bg-secondary/10 border border-white/5 hover:border-white/10 p-6 rounded-2xl space-y-4 transition-all duration-300 shadow-sm hover:shadow-md h-full flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-white text-lg">{msg.name}</h3>
                <a href={`mailto:${msg.email}`} className="text-primary hover:underline text-sm inline-block mt-1 transition-all">{msg.email}</a>
              </div>
              <div className="text-xs text-muted-foreground/60 text-right font-code bg-background/50 px-3 py-1.5 rounded-lg border border-white/5">
                {msg.createdAt && new Date(msg.createdAt).toLocaleDateString()}
                <span className="mx-2 hidden sm:inline">&bull;</span>
                <span className="block sm:inline">{msg.createdAt && new Date(msg.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="flex-1 mt-4 p-4 bg-background/30 rounded-xl border border-white/5 text-sm whitespace-pre-wrap text-muted-foreground">
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
