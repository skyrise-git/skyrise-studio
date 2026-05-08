const ROOT = "supportPortal";

export const supportPaths = {
  tenantsRoot: `${ROOT}/tenants`,
  tenantMeta: (code: string) => `${ROOT}/tenants/${code}/meta`,
  tenantTickets: (code: string) => `${ROOT}/tenants/${code}/tickets`,
  ticketPath: (code: string, ticketId: string) => `${ROOT}/tenants/${code}/tickets/${ticketId}`,
  inboxTicket: (ticketId: string) => `${ROOT}/inbox/tickets/${ticketId}`,
  inboxTicketsRoot: `${ROOT}/inbox/tickets`,
};
