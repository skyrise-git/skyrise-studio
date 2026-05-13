export type SupportTicketKind = "feature" | "bug";

export type SupportTicketStatus =
  | "open"
  | "in_progress"
  | "waiting_client"
  | "resolved"
  | "closed";

export type SupportPriority = "low" | "medium" | "high" | "critical";

export type SupportComment = {
  author: "client" | "staff";
  body: string;
  createdAt: string;
};

export type SupportTicket = {
  id: string;
  kind: SupportTicketKind;
  title: string;
  description: string;
  status: SupportTicketStatus;
  priority: SupportPriority;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  /** Name / initials of the staff member this ticket is assigned to */
  assignedTo?: string;
  /** Staff-facing ETA or status update visible to client */
  timelineNote?: string;
  escalated?: boolean;
  escalatedAt?: string;
  comments?: Record<string, SupportComment>;
};

export type SupportTenantMeta = {
  label?: string;
  createdAt: string;
  active: boolean;
};

export type InboxTicket = SupportTicket & { tenantCode: string };
