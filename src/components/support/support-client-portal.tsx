"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ref, get, push, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { normalizeClientCode } from "@/lib/support/code";
import { supportPaths } from "@/lib/support/paths";
import { appendComment, patchTicket, writeFullTicket } from "@/lib/support/db";
import type {
  SupportTicket,
  SupportTicketKind,
  SupportTicketStatus,
} from "@/lib/support/types";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AlertCircle, ChevronDown, ChevronUp, Loader2, LogOut, Send } from "lucide-react";

const SESSION_KEY = "skyrise_support_code";

const STATUS_DISPLAY: Record<SupportTicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  waiting_client: "Waiting on you",
  resolved: "Resolved",
  closed: "Closed",
};

function sortTicketsAsc(a: SupportTicket, b: SupportTicket): number {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

function TicketCard({
  code,
  ticket,
  resolvedView,
}: {
  code: string;
  ticket: SupportTicket;
  resolvedView: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const comments = useMemo(() => {
    if (!ticket.comments) return [];
    return Object.entries(ticket.comments).sort(
      (a, b) => new Date(a[1].createdAt).getTime() - new Date(b[1].createdAt).getTime()
    );
  }, [ticket.comments]);

  const canEscalate =
    !resolvedView &&
    !ticket.escalated &&
    ticket.status !== "resolved" &&
    ticket.status !== "closed";

  const submitComment = async () => {
    const t = reply.trim();
    if (!t) return;
    setBusy(true);
    setErr(null);
    try {
      await appendComment(code, ticket.id, {
        author: "client",
        body: t,
        createdAt: new Date().toISOString(),
      });
      await patchTicket(code, ticket.id, { updatedAt: new Date().toISOString() });
      setReply("");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Could not send.");
    } finally {
      setBusy(false);
    }
  };

  const doEscalate = async () => {
    setBusy(true);
    setErr(null);
    try {
      await patchTicket(code, ticket.id, {
        escalated: true,
        escalatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Could not escalate.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-card/30 backdrop-blur-sm overflow-hidden">
      <button
        type="button"
        className="w-full px-5 py-4 flex items-start gap-4 text-left hover:bg-white/[0.02] transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant={ticket.kind === "bug" ? "destructive" : "outline"} className="font-code text-[10px] uppercase tracking-wider">
              {ticket.kind === "bug" ? "Bug" : "Feature"}
            </Badge>
            <Badge variant="secondary" className="font-code text-[10px] uppercase">
              {STATUS_DISPLAY[ticket.status]}
            </Badge>
            <span className="text-muted-foreground font-code text-[10px] uppercase tracking-wide">
              Updated {format(new Date(ticket.updatedAt), "MMM d, yyyy")}
            </span>
          </div>
          <h3 className="font-logo text-lg uppercase tracking-wide text-foreground truncate">{ticket.title}</h3>
          {ticket.escalated && (
            <p className="text-xs text-orange-400 flex items-center gap-1 font-code uppercase tracking-wide">
              <AlertCircle className="h-3 w-3" /> Escalated
            </p>
          )}
        </div>
        {open ? <ChevronUp className="shrink-0 h-5 w-5 mt-1" /> : <ChevronDown className="shrink-0 h-5 w-5 mt-1" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0 space-y-4 border-t border-white/5 bg-black/10">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed pt-4">{ticket.description}</p>
          {ticket.timelineNote && (
            <div className="rounded-lg border border-primary/25 bg-primary/5 px-4 py-3">
              <p className="font-code text-[10px] uppercase tracking-wider text-primary mb-1">Timeline update</p>
              <p className="text-sm text-foreground">{ticket.timelineNote}</p>
            </div>
          )}
          {ticket.resolvedAt && (
            <p className="text-xs text-muted-foreground font-code uppercase tracking-wide">
              Resolved {format(new Date(ticket.resolvedAt), "MMM d, yyyy")}
            </p>
          )}
          <Separator className="bg-white/10" />
          <div className="space-y-3">
            <p className="font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Comments</p>
            <ScrollArea className="h-[min(280px,40vh)] pr-4">
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No comments yet.</p>
                ) : (
                  comments.map(([id, c]) => (
                    <div key={id} className={cn("rounded-lg border px-3 py-2 text-sm", c.author === "staff" ? "border-primary/30 bg-primary/5" : "border-white/10 bg-white/[0.03]")}>
                      <span className="font-code text-[10px] uppercase text-muted-foreground">
                        {c.author === "staff" ? "Skyrise" : "You"} · {format(new Date(c.createdAt), "MMM d, HH:mm")}
                      </span>
                      <p className="mt-1 text-foreground">{c.body}</p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
          {!resolvedView && ticket.status !== "closed" && ticket.status !== "resolved" && (
            <>
              <Textarea
                placeholder="Reply or add detail…"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="bg-secondary/10 border-white/10 min-h-[88px]"
              />
              <div className="flex flex-wrap gap-3">
                <Button disabled={busy || !reply.trim()} onClick={submitComment} className="font-code uppercase tracking-wider">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />} Send reply
                </Button>
                {canEscalate && (
                  <Button type="button" variant="outline" disabled={busy} onClick={doEscalate} className="font-code uppercase tracking-wider border-orange-500/40 text-orange-300">
                    Escalate issue
                  </Button>
                )}
              </div>
            </>
          )}
          {err && <p className="text-sm text-red-400">{err}</p>}
        </div>
      )}
    </div>
  );
}

export default function SupportClientPortal() {
  const [phase, setPhase] = useState<"gate" | "app">("gate");
  const [codeInput, setCodeInput] = useState("");
  const [activeCode, setActiveCode] = useState("");
  const [gateError, setGateError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [newOpen, setNewOpen] = useState(false);
  const [nk, setNk] = useState<SupportTicketKind>("feature");
  const [ntitle, setNtitle] = useState("");
  const [ndesc, setNdesc] = useState("");
  const [createBusy, setCreateBusy] = useState(false);

  const hydrateFromSession = useCallback(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? normalizeClientCode(raw) : null;
  }, []);

  useEffect(() => {
    const c = hydrateFromSession();
    if (!c) {
      setPhase("gate");
      return;
    }
    (async () => {
      try {
        const snap = await get(ref(db, supportPaths.tenantMeta(c)));
        const meta = snap.val() as { active?: boolean } | null;
        if (!snap.exists() || meta?.active === false) {
          sessionStorage.removeItem(SESSION_KEY);
          setPhase("gate");
          return;
        }
        setActiveCode(c);
        setPhase("app");
      } catch {
        setPhase("gate");
      }
    })();
  }, [hydrateFromSession]);

  useEffect(() => {
    if (phase !== "app" || !activeCode) return;
    const r = ref(db, supportPaths.tenantTickets(activeCode));
    return onValue(r, (snap) => {
      const next: SupportTicket[] = [];
      snap.forEach((ch) => {
        const val = ch.val() as Omit<SupportTicket, "id">;
        next.push({ ...val, id: ch.key ?? "" });
      });
      next.sort(sortTicketsAsc);
      setTickets(next);
    });
  }, [phase, activeCode]);

  const activeList = tickets.filter((t) => t.status !== "resolved" && t.status !== "closed");
  const resolvedList = tickets.filter((t) => t.status === "resolved" || t.status === "closed");

  const gateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const c = normalizeClientCode(codeInput);
    setGateError(null);
    if (c.length < 6) {
      setGateError("Enter the access code you were given.");
      return;
    }
    setBusy(true);
    try {
      const snap = await get(ref(db, supportPaths.tenantMeta(c)));
      const meta = snap.val() as { active?: boolean } | null;
      if (!snap.exists()) {
        setGateError("That code is not recognised. Double-check spelling or contact your Skyrise lead.");
        return;
      }
      if (meta?.active === false) {
        setGateError("This access code is no longer active.");
        return;
      }
      sessionStorage.setItem(SESSION_KEY, c);
      setActiveCode(c);
      setPhase("app");
      setCodeInput("");
    } catch {
      setGateError("Something went wrong. Try again shortly.");
    } finally {
      setBusy(false);
    }
  };

  const logoutPortal = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setActiveCode("");
    setTickets([]);
    setPhase("gate");
  };

  const createTicket = async () => {
    if (!activeCode || !ntitle.trim() || !ndesc.trim()) return;
    setCreateBusy(true);
    try {
      const tid = push(ref(db, supportPaths.tenantTickets(activeCode))).key;
      if (!tid) throw new Error("ticket id");
      const now = new Date().toISOString();
      const ticket: SupportTicket = {
        id: tid,
        kind: nk,
        title: ntitle.trim(),
        description: ndesc.trim(),
        status: "open",
        priority: "medium",
        createdAt: now,
        updatedAt: now,
      };
      await writeFullTicket(activeCode, tid, ticket);
      setNtitle("");
      setNdesc("");
      setNk("feature");
      setNewOpen(false);
    } finally {
      setCreateBusy(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground isolate">
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] opacity-70">
        <div className="absolute top-[20vh] -left-[20vw] w-[70vw] h-[70vw] bg-primary/10 rounded-full mix-blend-screen" />
      </div>
      <Header />
      <main className="flex-grow z-10 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="font-code text-xs uppercase tracking-[0.2em] text-primary mb-3">Support</p>
          <h1 className="text-4xl md:text-5xl font-logo uppercase tracking-wide mb-2">Client portal</h1>
          <p className="text-muted-foreground font-body mb-10 max-w-xl">
            Log feature ideas and bugs, watch status and timelines, and track what we have already shipped.
          </p>

          {phase === "gate" && (
            <form onSubmit={gateSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-8 max-w-md">
              <div>
                <label className="font-code text-[10px] uppercase tracking-wider text-muted-foreground block mb-2">Access code</label>
                <Input
                  placeholder="SKY-X7N2-K8Q4"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  className="font-code uppercase tracking-wider bg-secondary/10 border-white/10"
                />
              </div>
              {gateError && <p className="text-sm text-red-400">{gateError}</p>}
              <Button type="submit" disabled={busy} className="w-full font-code uppercase tracking-wider">
                {busy ? <Loader2 className="animate-spin h-4 w-4" /> : "Continue"}
              </Button>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your Skyrise contact issues an access code for your organisation. If you lost it or need changes, reply on your usual project channel or use{" "}
                <Link href="/#contact" className="text-primary hover:underline">the site contact form</Link>.
              </p>
            </form>
          )}

          {phase === "app" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-muted-foreground font-code uppercase tracking-wide">
                  Signed in · <span className="text-foreground">{activeCode}</span>
                </p>
                <Button variant="outline" size="sm" className="font-code uppercase tracking-wider" type="button" onClick={logoutPortal}>
                  <LogOut className="h-4 w-4 mr-2" /> Exit
                </Button>
              </div>

              <Dialog open={newOpen} onOpenChange={setNewOpen}>
                <DialogTrigger asChild>
                  <Button className="font-code uppercase tracking-wider">New request</Button>
                </DialogTrigger>
                <DialogContent className="border-white/10 bg-background/95 backdrop-blur-xl max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-logo uppercase tracking-wide">Submit request</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="font-code text-[10px] uppercase text-muted-foreground">Type</label>
                      <Select value={nk} onValueChange={(v) => setNk(v as SupportTicketKind)}>
                        <SelectTrigger className="mt-1 bg-secondary/10 border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="feature">Feature request</SelectItem>
                          <SelectItem value="bug">Bug report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      placeholder="Short title"
                      value={ntitle}
                      onChange={(e) => setNtitle(e.target.value)}
                      className="bg-secondary/10 border-white/10"
                    />
                    <Textarea
                      placeholder="Describe what you need or what broke — steps help us reproduce bugs."
                      value={ndesc}
                      onChange={(e) => setNdesc(e.target.value)}
                      className="min-h-[140px] bg-secondary/10 border-white/10"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setNewOpen(false)} className="font-code uppercase">
                      Cancel
                    </Button>
                    <Button disabled={createBusy || !ntitle.trim() || !ndesc.trim()} onClick={createTicket} className="font-code uppercase tracking-wider">
                      {createBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Tabs defaultValue="active" className="w-full">
                <TabsList className="bg-secondary/30 border border-white/10 flex flex-wrap">
                  <TabsTrigger value="active" className="font-code uppercase text-[11px]">
                    Active ({activeList.length})
                  </TabsTrigger>
                  <TabsTrigger value="done" className="font-code uppercase text-[11px]">
                    Resolved history ({resolvedList.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="mt-6 space-y-4">
                  {activeList.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Nothing open right now.</p>
                  ) : (
                    activeList.map((t) => <TicketCard key={t.id} code={activeCode} ticket={t} resolvedView={false} />)
                  )}
                </TabsContent>
                <TabsContent value="done" className="mt-6 space-y-4">
                  {resolvedList.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No resolved items yet.</p>
                  ) : (
                    resolvedList.map((t) => <TicketCard key={t.id} code={activeCode} ticket={t} resolvedView />)
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
}
