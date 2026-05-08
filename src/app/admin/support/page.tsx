"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ref, get, set, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { generateClientAccessCode } from "@/lib/support/code";
import { supportPaths } from "@/lib/support/paths";
import { appendComment, patchTicket } from "@/lib/support/db";
import type {
  InboxTicket,
  SupportTenantMeta,
  SupportTicketStatus,
  SupportPriority,
} from "@/lib/support/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Copy, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type TenantRow = { code: string; meta: SupportTenantMeta };

const PRIORITY_WEIGHT: Record<SupportPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function sortTicketsAdmin(a: InboxTicket, b: InboxTicket): number {
  const ae = a.escalated ? 1 : 0;
  const be = b.escalated ? 1 : 0;
  if (ae !== be) return be - ae;
  const ap = PRIORITY_WEIGHT[a.priority] ?? 99;
  const bp = PRIORITY_WEIGHT[b.priority] ?? 99;
  if (ap !== bp) return ap - bp;
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

export default function AdminSupportPage() {
  const { toast } = useToast();
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [inbox, setInbox] = useState<InboxTicket[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [issuing, setIssuing] = useState(false);
  const [sel, setSel] = useState<InboxTicket | null>(null);
  const [editStatus, setEditStatus] = useState<SupportTicketStatus>("open");
  const [editPriority, setEditPriority] = useState<SupportPriority>("medium");
  const [editTimeline, setEditTimeline] = useState("");
  const [staffNote, setStaffNote] = useState("");
  const [saveBusy, setSaveBusy] = useState(false);

  useEffect(() => {
    return onValue(ref(db, supportPaths.tenantsRoot), (snap) => {
      const rows: TenantRow[] = [];
      snap.forEach((child) => {
        const code = child.key ?? "";
        const meta = child.child("meta").val() as SupportTenantMeta | null;
        if (meta && code) rows.push({ code, meta });
      });
      rows.sort((a, b) => new Date(b.meta.createdAt).getTime() - new Date(a.meta.createdAt).getTime());
      setTenants(rows);
    });
  }, []);

  useEffect(() => {
    return onValue(ref(db, supportPaths.inboxTicketsRoot), (snap) => {
      const rows: InboxTicket[] = [];
      snap.forEach((ch) => {
        rows.push(ch.val() as InboxTicket);
      });
      rows.sort(sortTicketsAdmin);
      setInbox(rows);
    });
  }, []);

  useEffect(() => {
    if (!sel) return;
    setEditStatus(sel.status);
    setEditPriority(sel.priority);
    setEditTimeline(sel.timelineNote ?? "");
    setStaffNote("");
  }, [sel]);

  const sortedInbox = useMemo(() => [...inbox].sort(sortTicketsAdmin), [inbox]);

  const issueCode = async () => {
    setIssuing(true);
    try {
      let code = generateClientAccessCode();
      for (let i = 0; i < 5; i++) {
        const existing = await get(ref(db, supportPaths.tenantMeta(code)));
        if (!existing.exists()) break;
        code = generateClientAccessCode();
      }
      await set(ref(db, supportPaths.tenantMeta(code)), {
        label: newLabel.trim() || "",
        createdAt: new Date().toISOString(),
        active: true,
      } satisfies SupportTenantMeta);
      setNewLabel("");
      try {
        await navigator.clipboard.writeText(code);
        toast({ title: "Code created — copied", description: code });
      } catch {
        toast({ title: "Access code created", description: code });
      }
    } catch (e: unknown) {
      toast({
        variant: "destructive",
        title: "Could not create code",
        description: e instanceof Error ? e.message : "Try again.",
      });
    } finally {
      setIssuing(false);
    }
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied" });
    } catch {
      toast({ variant: "destructive", title: "Clipboard failed" });
    }
  };

  const toggleTenant = async (code: string, meta: SupportTenantMeta) => {
    try {
      await set(ref(db, supportPaths.tenantMeta(code)), { ...meta, active: !meta.active });
      toast({ title: meta.active ? "Code deactivated" : "Code reactivated", description: code });
    } catch {
      toast({ variant: "destructive", title: "Update failed" });
    }
  };

  const saveTicket = async () => {
    if (!sel) return;
    setSaveBusy(true);
    try {
      const now = new Date().toISOString();
      const goingResolved = editStatus === "resolved" || editStatus === "closed";
      const patch: Record<string, unknown> = {
        status: editStatus,
        priority: editPriority,
        timelineNote: editTimeline.trim() ? editTimeline.trim() : null,
        updatedAt: now,
        resolvedAt: goingResolved ? (sel.resolvedAt ?? now) : null,
      };
      await patchTicket(sel.tenantCode, sel.id, patch);
      if (staffNote.trim()) {
        await appendComment(sel.tenantCode, sel.id, {
          author: "staff",
          body: staffNote.trim(),
          createdAt: now,
        });
        await patchTicket(sel.tenantCode, sel.id, { updatedAt: new Date().toISOString() });
      }
      setStaffNote("");
      setSel(null);
      toast({ title: "Saved" });
    } catch {
      toast({ variant: "destructive", title: "Save failed" });
    } finally {
      setSaveBusy(false);
    }
  };

  const commentsList = sel?.comments
    ? Object.entries(sel.comments).sort(
        (a, b) => new Date(a[1].createdAt).getTime() - new Date(b[1].createdAt).getTime()
      )
    : [];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-logo uppercase text-primary mb-2">Client support portal</h1>
        <p className="text-muted-foreground font-code text-sm max-w-xl">
          Issue alphanumeric access codes per client organisation. Incoming requests appear below in priority order; open a row to reply, adjust status, timeline text, or resolution state.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-secondary/5 p-6 backdrop-blur-sm space-y-4">
        <h2 className="font-logo uppercase text-lg tracking-wide">Issue new access code</h2>
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <Input
            placeholder="Client / project label (optional)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="bg-background/80 border-white/10 flex-1"
          />
          <Button onClick={issueCode} disabled={issuing} className="font-code uppercase shrink-0">
            {issuing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate code"}
          </Button>
        </div>
        <Separator className="bg-white/10" />
        <div>
          <h3 className="font-code text-xs uppercase text-muted-foreground mb-3">Issued codes</h3>
          <ScrollArea className="max-h-56 rounded-md border border-white/10">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="font-code uppercase text-muted-foreground">Code</TableHead>
                  <TableHead className="font-code uppercase text-muted-foreground">Label</TableHead>
                  <TableHead className="font-code uppercase text-muted-foreground">Status</TableHead>
                  <TableHead className="font-code uppercase text-muted-foreground w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground text-sm py-8 text-center font-code uppercase">
                      No codes yet
                    </TableCell>
                  </TableRow>
                ) : (
                  tenants.map((t) => (
                    <TableRow key={t.code} className="border-white/5">
                      <TableCell className="font-code text-xs uppercase tracking-wide">{t.code}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.meta.label || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={t.meta.active ? "outline" : "secondary"}>{t.meta.active ? "Active" : "Paused"}</Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button size="sm" variant="ghost" type="button" onClick={() => copyText(t.code)} className="h-8 w-8 p-0">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="outline" type="button" onClick={() => toggleTenant(t.code, t.meta)} className="font-code text-[10px] uppercase h-8">
                          Toggle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-secondary/5 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-logo uppercase text-lg tracking-wide">Tickets (priority queue)</h2>
          <span className="text-xs font-code uppercase text-muted-foreground">{sortedInbox.length} total</span>
        </div>
        <div className="rounded-md border border-white/10 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="font-code uppercase text-muted-foreground w-10"></TableHead>
                <TableHead className="font-code uppercase text-muted-foreground">Type</TableHead>
                <TableHead className="font-code uppercase text-muted-foreground">Priority</TableHead>
                <TableHead className="font-code uppercase text-muted-foreground">Tenant</TableHead>
                <TableHead className="font-code uppercase text-muted-foreground">Title</TableHead>
                <TableHead className="font-code uppercase text-muted-foreground">Status</TableHead>
                <TableHead className="font-code uppercase text-muted-foreground text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInbox.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="border-white/5 cursor-pointer hover:bg-white/[0.03]"
                  onClick={() => setSel(ticket)}
                >
                  <TableCell>
                    {ticket.escalated && (
                      <span title="Escalated">
                        <AlertCircle className="h-4 w-4 text-orange-400 shrink-0" />
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ticket.kind === "bug" ? "destructive" : "secondary"}>{ticket.kind === "bug" ? "Bug" : "Feature"}</Badge>
                  </TableCell>
                  <TableCell className="font-code text-xs uppercase text-muted-foreground">{ticket.priority}</TableCell>
                  <TableCell className="font-code text-xs">{ticket.tenantCode}</TableCell>
                  <TableCell className="font-logo text-xs uppercase tracking-wide max-w-[200px] truncate">{ticket.title}</TableCell>
                  <TableCell>
                    <span className="text-xs uppercase font-code">{ticket.status}</span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs font-code">
                    {format(new Date(ticket.updatedAt), "MMM d HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {sortedInbox.length === 0 && (
            <p className="text-muted-foreground text-sm font-code text-center py-10 uppercase tracking-wide">
              Nothing in inbox yet · client submissions appear automatically
            </p>
          )}
        </div>
      </section>

      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto bg-background border-white/15 max-w-lg">
          {sel && (
            <>
              <DialogHeader>
                <DialogTitle className="font-logo uppercase tracking-wide pr-10">{sel.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="flex flex-wrap gap-2 items-center font-code text-[11px] uppercase text-muted-foreground">
                  <span>{sel.tenantCode}</span>
                  <Badge variant={sel.kind === "bug" ? "destructive" : "outline"}>{sel.kind}</Badge>
                  <span>{format(new Date(sel.createdAt), "MMM d, yyyy")}</span>
                </div>
                <Separator className="bg-white/10" />
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{sel.description}</p>
                <Separator className="bg-white/10" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-code text-[10px] uppercase text-muted-foreground">Status</label>
                    <Select value={editStatus} onValueChange={(v) => setEditStatus(v as SupportTicketStatus)}>
                      <SelectTrigger className="mt-1 bg-secondary/40 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In progress</SelectItem>
                        <SelectItem value="waiting_client">Waiting on client</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="font-code text-[10px] uppercase text-muted-foreground">Priority</label>
                    <Select value={editPriority} onValueChange={(v) => setEditPriority(v as SupportPriority)}>
                      <SelectTrigger className="mt-1 bg-secondary/40 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="font-code text-[10px] uppercase text-muted-foreground">Timeline / ETA message (shown to client)</label>
                  <Textarea value={editTimeline} onChange={(e) => setEditTimeline(e.target.value)} rows={4} className="mt-1 bg-secondary/40 border-white/10" placeholder="Rough timeline or next milestone…" />
                </div>
                <div>
                  <label className="font-code text-[10px] uppercase text-muted-foreground">Add staff reply</label>
                  <Textarea value={staffNote} onChange={(e) => setStaffNote(e.target.value)} rows={3} className="mt-1 bg-secondary/40 border-white/10" placeholder="Adds a threaded comment visible to the client." />
                </div>
                <Separator className="bg-white/10" />
                <div>
                  <p className="font-code text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Conversation</p>
                  <ScrollArea className="h-[min(260px,32vh)] pr-3 rounded-md border border-white/10 p-3 space-y-2">
                    {commentsList.length === 0 ? (
                      <p className="text-muted-foreground text-xs">No replies yet.</p>
                    ) : (
                      commentsList.map(([cid, c]) => (
                        <div key={cid} className={cn("rounded border px-2 py-2 text-xs", c.author === "staff" ? "border-primary/30 bg-primary/5" : "border-white/10")}>
                          <span className="font-code text-[10px] uppercase opacity-70">
                            {c.author === "staff" ? "You (staff)" : "Client"} · {format(new Date(c.createdAt), "MMM d HH:mm")}
                          </span>
                          <p className="mt-1 whitespace-pre-wrap">{c.body}</p>
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0 pt-6">
                <Button variant="outline" type="button" onClick={() => setSel(null)} className="font-code uppercase">
                  Cancel
                </Button>
                <Button disabled={saveBusy} onClick={saveTicket} className="font-code uppercase">
                  {saveBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
