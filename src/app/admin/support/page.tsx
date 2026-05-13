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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  AlertCircle,
  Bug,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Sparkles,
  UserCircle2,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type TenantRow = { code: string; meta: SupportTenantMeta };

type FilterTab =
  | "all"
  | "open"
  | "in_progress"
  | "waiting_client"
  | "resolved"
  | "escalated";

/* ─── Constants ─────────────────────────────────────────────────────────── */

const PRIORITY_WEIGHT: Record<SupportPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const PRIORITY_COLOR: Record<SupportPriority, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-muted-foreground",
};

const STATUS_LABEL: Record<SupportTicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  waiting_client: "Waiting on client",
  resolved: "Resolved",
  closed: "Closed",
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function sortTickets(a: InboxTicket, b: InboxTicket): number {
  const ae = a.escalated ? 1 : 0;
  const be = b.escalated ? 1 : 0;
  if (ae !== be) return be - ae;
  const ap = PRIORITY_WEIGHT[a.priority] ?? 99;
  const bp = PRIORITY_WEIGHT[b.priority] ?? 99;
  if (ap !== bp) return ap - bp;
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

function applyFilter(tickets: InboxTicket[], tab: FilterTab): InboxTicket[] {
  if (tab === "all") return tickets;
  if (tab === "escalated") return tickets.filter((t) => t.escalated && t.status !== "resolved" && t.status !== "closed");
  return tickets.filter((t) => t.status === tab);
}

/* ─── Stat card ─────────────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-secondary/5 px-5 py-4 flex items-center gap-4">
      <div className={cn("p-2.5 rounded-lg border border-white/10 bg-white/[0.04]", accent ?? "text-muted-foreground")}>
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-2xl font-logo">{value}</p>
        <p className="font-code text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function AdminSupportPage() {
  const { toast } = useToast();

  // ── Data state ──────────────────────────────────────────────────────────
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [inbox, setInbox] = useState<InboxTicket[]>([]);

  // ── Code generation ─────────────────────────────────────────────────────
  const [newLabel, setNewLabel] = useState("");
  const [issuing, setIssuing] = useState(false);
  const [codesOpen, setCodesOpen] = useState(false);

  // ── Ticket list ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<FilterTab>("open");

  // ── Ticket detail modal ─────────────────────────────────────────────────
  const [sel, setSel] = useState<InboxTicket | null>(null);
  const [editStatus, setEditStatus] = useState<SupportTicketStatus>("open");
  const [editPriority, setEditPriority] = useState<SupportPriority>("medium");
  const [editAssignee, setEditAssignee] = useState("");
  const [editTimeline, setEditTimeline] = useState("");
  const [staffNote, setStaffNote] = useState("");
  const [saveBusy, setSaveBusy] = useState(false);

  // ── Firebase listeners ──────────────────────────────────────────────────
  useEffect(
    () =>
      onValue(ref(db, supportPaths.tenantsRoot), (snap) => {
        const rows: TenantRow[] = [];
        snap.forEach((child) => {
          const code = child.key ?? "";
          const meta = child.child("meta").val() as SupportTenantMeta | null;
          if (meta && code) rows.push({ code, meta });
        });
        rows.sort((a, b) => new Date(b.meta.createdAt).getTime() - new Date(a.meta.createdAt).getTime());
        setTenants(rows);
      }),
    []
  );

  useEffect(
    () =>
      onValue(ref(db, supportPaths.inboxTicketsRoot), (snap) => {
        const rows: InboxTicket[] = [];
        snap.forEach((ch) => rows.push(ch.val() as InboxTicket));
        rows.sort(sortTickets);
        setInbox(rows);
      }),
    []
  );

  // Sync modal fields when selected ticket changes
  useEffect(() => {
    if (!sel) return;
    setEditStatus(sel.status);
    setEditPriority(sel.priority);
    setEditAssignee(sel.assignedTo ?? "");
    setEditTimeline(sel.timelineNote ?? "");
    setStaffNote("");
  }, [sel]);

  // ── Derived counts ───────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active = inbox.filter((t) => t.status !== "resolved" && t.status !== "closed");
    return {
      open:      inbox.filter((t) => t.status === "open").length,
      inProgress: inbox.filter((t) => t.status === "in_progress").length,
      escalated: inbox.filter((t) => t.escalated && t.status !== "resolved" && t.status !== "closed").length,
      bugs:      active.filter((t) => t.kind === "bug").length,
      features:  active.filter((t) => t.kind === "feature").length,
      resolved:  inbox.filter((t) => t.status === "resolved" || t.status === "closed").length,
    };
  }, [inbox]);

  const tabCounts: Record<FilterTab, number> = useMemo(() => ({
    all:            inbox.length,
    open:           stats.open,
    in_progress:    stats.inProgress,
    waiting_client: inbox.filter((t) => t.status === "waiting_client").length,
    resolved:       stats.resolved,
    escalated:      stats.escalated,
  }), [inbox, stats]);

  const filteredTickets = useMemo(
    () => applyFilter([...inbox].sort(sortTickets), activeTab),
    [inbox, activeTab]
  );

  // ── Actions ──────────────────────────────────────────────────────────────

  const issueCode = async () => {
    setIssuing(true);
    try {
      let code = generateClientAccessCode();
      for (let i = 0; i < 5; i++) {
        const snap = await get(ref(db, supportPaths.tenantMeta(code)));
        if (!snap.exists()) break;
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
        toast({ title: "Code created & copied", description: code });
      } catch {
        toast({ title: "Access code created", description: code });
      }
    } catch (e: unknown) {
      toast({ variant: "destructive", title: "Could not create code", description: e instanceof Error ? e.message : "Try again." });
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

  const quickClose = async (e: React.MouseEvent, ticket: InboxTicket) => {
    e.stopPropagation();
    try {
      const now = new Date().toISOString();
      await patchTicket(ticket.tenantCode, ticket.id, {
        status: "closed",
        updatedAt: now,
        resolvedAt: ticket.resolvedAt ?? now,
      });
      toast({ title: "Ticket closed", description: ticket.title });
    } catch {
      toast({ variant: "destructive", title: "Close failed" });
    }
  };

  const saveTicket = async () => {
    if (!sel) return;
    setSaveBusy(true);
    try {
      const now = new Date().toISOString();
      const goingResolved = editStatus === "resolved" || editStatus === "closed";
      const patch: Record<string, unknown> = {
        status:       editStatus,
        priority:     editPriority,
        assignedTo:   editAssignee.trim() || null,
        timelineNote: editTimeline.trim() || null,
        updatedAt:    now,
        resolvedAt:   goingResolved ? (sel.resolvedAt ?? now) : null,
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
      setSel(null);
      toast({ title: "Ticket updated" });
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

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-logo uppercase text-primary mb-1">Support dashboard</h1>
        <p className="text-muted-foreground font-code text-sm">
          Manage client access codes and track all incoming requests.
        </p>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Open"       value={stats.open}       icon={Zap}          accent="text-blue-400" />
        <StatCard label="In progress" value={stats.inProgress} icon={Loader2}      accent="text-yellow-400" />
        <StatCard label="Escalated"  value={stats.escalated}  icon={AlertCircle}  accent="text-orange-400" />
        <StatCard label="Bugs"       value={stats.bugs}       icon={Bug}          accent="text-red-400" />
        <StatCard label="Features"   value={stats.features}   icon={Sparkles}     accent="text-purple-400" />
        <StatCard label="Resolved"   value={stats.resolved}   icon={CheckCircle2} accent="text-emerald-400" />
      </div>

      {/* ── Code generation (collapsible) ──────────────────────────────── */}
      <section className="rounded-2xl border border-white/10 bg-secondary/5 backdrop-blur-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setCodesOpen((o) => !o)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div>
            <span className="font-logo uppercase tracking-wide">Client access codes</span>
            <span className="ml-3 font-code text-[11px] uppercase text-muted-foreground">
              {tenants.length} issued
            </span>
          </div>
          {codesOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>

        {codesOpen && (
          <div className="px-6 pb-6 space-y-4 border-t border-white/5">
            {/* Generate */}
            <div className="pt-4">
              <p className="font-code text-[10px] uppercase text-muted-foreground mb-2">Generate new code</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <Input
                  placeholder="Client / project label (optional)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && issueCode()}
                  className="bg-background/80 border-white/10 flex-1"
                />
                <Button onClick={issueCode} disabled={issuing} className="font-code uppercase shrink-0">
                  {issuing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate & copy"}
                </Button>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Issued codes table */}
            <ScrollArea className="max-h-60 rounded-md border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="font-code uppercase text-muted-foreground text-[11px]">Code</TableHead>
                    <TableHead className="font-code uppercase text-muted-foreground text-[11px]">Label</TableHead>
                    <TableHead className="font-code uppercase text-muted-foreground text-[11px]">Created</TableHead>
                    <TableHead className="font-code uppercase text-muted-foreground text-[11px]">Status</TableHead>
                    <TableHead className="w-[90px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground text-sm py-8 font-code uppercase">
                        No codes yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    tenants.map((t) => (
                      <TableRow key={t.code} className="border-white/5">
                        <TableCell className="font-code text-xs uppercase tracking-wide">{t.code}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{t.meta.label || "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground font-code">
                          {format(new Date(t.meta.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={t.meta.active ? "outline" : "secondary"} className="font-code text-[10px] uppercase">
                            {t.meta.active ? "Active" : "Paused"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1.5">
                            <Button size="sm" variant="ghost" onClick={() => copyText(t.code)} className="h-7 w-7 p-0" title="Copy code">
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => toggleTenant(t.code, t.meta)} className="font-code text-[10px] uppercase h-7 px-2">
                              {t.meta.active ? "Pause" : "Activate"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
      </section>

      {/* ── Ticket queue ───────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-white/10 bg-secondary/5 backdrop-blur-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="font-logo uppercase text-lg tracking-wide">All tickets</h2>
          <span className="font-code text-[11px] uppercase text-muted-foreground">
            Click a row to edit · {inbox.length} total
          </span>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
          <TabsList className="bg-secondary/30 border border-white/10 flex flex-wrap h-auto gap-1 mb-5 p-1">
            {(
              [
                { id: "open",            label: "Open" },
                { id: "in_progress",     label: "In progress" },
                { id: "waiting_client",  label: "Waiting" },
                { id: "escalated",       label: "Escalated" },
                { id: "resolved",        label: "Resolved" },
                { id: "all",             label: "All" },
              ] as { id: FilterTab; label: string }[]
            ).map(({ id, label }) => (
              <TabsTrigger key={id} value={id} className="font-code text-[10px] uppercase tracking-wider">
                {label}
                <span className={cn(
                  "ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-code",
                  activeTab === id ? "bg-primary/20 text-primary" : "bg-white/10 text-muted-foreground"
                )}>
                  {tabCounts[id]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Shared ticket table rendered for every tab */}
          {(["open","in_progress","waiting_client","escalated","resolved","all"] as FilterTab[]).map((tabId) => (
            <TabsContent key={tabId} value={tabId} className="mt-0">
              <TicketTable
                tickets={filteredTickets}
                onSelect={setSel}
                onQuickClose={quickClose}
              />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* ── Ticket detail modal ─────────────────────────────────────────── */}
      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className="max-h-[94vh] overflow-y-auto bg-background border-white/15 max-w-xl w-full">
          {sel && (
            <>
              <DialogHeader>
                <DialogTitle className="font-logo uppercase tracking-wide leading-snug pr-10">
                  {sel.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 text-sm">
                {/* Meta row */}
                <div className="flex flex-wrap gap-2 items-center font-code text-[11px] uppercase text-muted-foreground">
                  <span className="border border-white/10 rounded px-2 py-0.5">{sel.tenantCode}</span>
                  <Badge variant={sel.kind === "bug" ? "destructive" : "secondary"} className="font-code text-[10px] uppercase">
                    {sel.kind}
                  </Badge>
                  <span>Created {format(new Date(sel.createdAt), "MMM d, yyyy")}</span>
                  {sel.escalated && (
                    <span className="flex items-center gap-1 text-orange-400">
                      <AlertCircle className="h-3 w-3" /> Escalated
                    </span>
                  )}
                </div>

                <Separator className="bg-white/10" />

                {/* Description */}
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed bg-secondary/10 rounded-lg px-4 py-3 border border-white/5">
                  {sel.description}
                </p>

                <Separator className="bg-white/10" />

                {/* Editable fields — 2 col grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-code text-[10px] uppercase text-muted-foreground block mb-1">Status</label>
                    <Select value={editStatus} onValueChange={(v) => setEditStatus(v as SupportTicketStatus)}>
                      <SelectTrigger className="bg-secondary/40 border-white/10">
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
                    <label className="font-code text-[10px] uppercase text-muted-foreground block mb-1">Priority</label>
                    <Select value={editPriority} onValueChange={(v) => setEditPriority(v as SupportPriority)}>
                      <SelectTrigger className="bg-secondary/40 border-white/10">
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

                {/* Assignee */}
                <div>
                  <label className="font-code text-[10px] uppercase text-muted-foreground block mb-1">
                    Assigned to
                  </label>
                  <div className="relative">
                    <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Name or initials (e.g. Alex, JD)"
                      value={editAssignee}
                      onChange={(e) => setEditAssignee(e.target.value)}
                      className="pl-9 bg-secondary/40 border-white/10"
                    />
                  </div>
                </div>

                {/* Timeline note */}
                <div>
                  <label className="font-code text-[10px] uppercase text-muted-foreground block mb-1">
                    Timeline / ETA <span className="normal-case opacity-60">(shown to client)</span>
                  </label>
                  <Textarea
                    value={editTimeline}
                    onChange={(e) => setEditTimeline(e.target.value)}
                    rows={3}
                    className="bg-secondary/40 border-white/10"
                    placeholder="e.g. Fix in next deploy — targeting Friday"
                  />
                </div>

                {/* Staff reply */}
                <div>
                  <label className="font-code text-[10px] uppercase text-muted-foreground block mb-1">
                    Add reply <span className="normal-case opacity-60">(visible to client)</span>
                  </label>
                  <Textarea
                    value={staffNote}
                    onChange={(e) => setStaffNote(e.target.value)}
                    rows={3}
                    className="bg-secondary/40 border-white/10"
                    placeholder="Leave a message or update for the client…"
                  />
                </div>

                <Separator className="bg-white/10" />

                {/* Conversation thread */}
                <div>
                  <p className="font-code text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                    Conversation thread
                  </p>
                  <ScrollArea className="h-[min(240px,30vh)] rounded-md border border-white/10 p-3">
                    {commentsList.length === 0 ? (
                      <p className="text-muted-foreground text-xs py-4 text-center">No messages yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {commentsList.map(([cid, c]) => (
                          <div
                            key={cid}
                            className={cn(
                              "rounded border px-3 py-2 text-xs",
                              c.author === "staff"
                                ? "border-primary/30 bg-primary/5"
                                : "border-white/10 bg-white/[0.02]"
                            )}
                          >
                            <span className="font-code text-[10px] uppercase opacity-60">
                              {c.author === "staff" ? "Staff" : "Client"} ·{" "}
                              {format(new Date(c.createdAt), "MMM d, HH:mm")}
                            </span>
                            <p className="mt-1 whitespace-pre-wrap leading-relaxed">{c.body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>

              <DialogFooter className="gap-2 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setSel(null)}
                  className="font-code uppercase"
                >
                  Cancel
                </Button>
                <Button
                  disabled={saveBusy}
                  onClick={saveTicket}
                  className="font-code uppercase"
                >
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

/* ─── Ticket table (extracted for reuse across tabs) ─────────────────────── */

function TicketTable({
  tickets,
  onSelect,
  onQuickClose,
}: {
  tickets: InboxTicket[];
  onSelect: (t: InboxTicket) => void;
  onQuickClose: (e: React.MouseEvent, t: InboxTicket) => void;
}) {
  if (tickets.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm font-code uppercase tracking-wide py-12">
        No tickets in this view
      </p>
    );
  }

  return (
    <div className="rounded-md border border-white/10 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="w-6" />
            <TableHead className="font-code uppercase text-muted-foreground text-[11px]">Type</TableHead>
            <TableHead className="font-code uppercase text-muted-foreground text-[11px]">Priority</TableHead>
            <TableHead className="font-code uppercase text-muted-foreground text-[11px]">Client</TableHead>
            <TableHead className="font-code uppercase text-muted-foreground text-[11px]">Title</TableHead>
            <TableHead className="font-code uppercase text-muted-foreground text-[11px]">Status</TableHead>
            <TableHead className="font-code uppercase text-muted-foreground text-[11px]">Assigned</TableHead>
            <TableHead className="font-code uppercase text-muted-foreground text-[11px] text-right">Updated</TableHead>
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => {
            const isClosed = ticket.status === "resolved" || ticket.status === "closed";
            return (
              <TableRow
                key={ticket.id}
                className="border-white/5 cursor-pointer hover:bg-white/[0.03] transition-colors"
                onClick={() => onSelect(ticket)}
              >
                {/* Escalation indicator */}
                <TableCell className="pr-0">
                  {ticket.escalated && !isClosed && (
                    <AlertCircle className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                  )}
                </TableCell>

                {/* Kind */}
                <TableCell>
                  <Badge
                    variant={ticket.kind === "bug" ? "destructive" : "secondary"}
                    className="font-code text-[10px] uppercase"
                  >
                    {ticket.kind === "bug" ? "Bug" : "Feature"}
                  </Badge>
                </TableCell>

                {/* Priority */}
                <TableCell className={cn("font-code text-[11px] uppercase", PRIORITY_COLOR[ticket.priority])}>
                  {ticket.priority}
                </TableCell>

                {/* Tenant */}
                <TableCell className="font-code text-[11px] text-muted-foreground max-w-[100px] truncate">
                  {ticket.tenantCode}
                </TableCell>

                {/* Title */}
                <TableCell className="font-logo text-xs uppercase tracking-wide max-w-[220px] truncate">
                  {ticket.title}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <span className={cn(
                    "inline-block font-code text-[10px] uppercase px-2 py-0.5 rounded-sm border",
                    ticket.status === "open"           && "border-blue-500/30 bg-blue-500/10 text-blue-300",
                    ticket.status === "in_progress"    && "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
                    ticket.status === "waiting_client" && "border-purple-500/30 bg-purple-500/10 text-purple-300",
                    ticket.status === "resolved"       && "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                    ticket.status === "closed"         && "border-white/10 bg-white/5 text-muted-foreground",
                  )}>
                    {STATUS_LABEL[ticket.status]}
                  </span>
                </TableCell>

                {/* Assignee */}
                <TableCell className="text-muted-foreground text-xs font-code">
                  {ticket.assignedTo || <span className="opacity-30">—</span>}
                </TableCell>

                {/* Updated */}
                <TableCell className="text-right text-muted-foreground text-xs font-code whitespace-nowrap">
                  {format(new Date(ticket.updatedAt), "MMM d, HH:mm")}
                </TableCell>

                {/* Quick close */}
                <TableCell className="pl-0">
                  {!isClosed && (
                    <button
                      type="button"
                      title="Close ticket"
                      onClick={(e) => onQuickClose(e, ticket)}
                      className="p-1 rounded text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
