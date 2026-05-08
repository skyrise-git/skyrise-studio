import { ref, update, push } from "firebase/database";
import { db } from "@/lib/firebase";
import type { InboxTicket, SupportComment, SupportTicket } from "./types";
import { supportPaths } from "./paths";

export async function writeFullTicket(
  tenantCode: string,
  ticketId: string,
  ticket: SupportTicket
): Promise<void> {
  const inbox: InboxTicket = { ...ticket, tenantCode };
  await update(ref(db), {
    [supportPaths.ticketPath(tenantCode, ticketId)]: ticket,
    [supportPaths.inboxTicket(ticketId)]: inbox,
  });
}

/** Use `null` on a field to remove it from Realtime DB (e.g. clearing `resolvedAt`). */
export async function patchTicket(
  tenantCode: string,
  ticketId: string,
  partial: Record<string, unknown>
): Promise<void> {
  await Promise.all([
    update(ref(db, supportPaths.ticketPath(tenantCode, ticketId)), partial),
    update(ref(db, supportPaths.inboxTicket(ticketId)), partial),
  ]);
}

export async function appendComment(
  tenantCode: string,
  ticketId: string,
  comment: SupportComment
): Promise<void> {
  const listRef = ref(db, `${supportPaths.ticketPath(tenantCode, ticketId)}/comments`);
  const key = push(listRef).key;
  if (!key) throw new Error("Could not create comment id");
  const pathA = `${supportPaths.ticketPath(tenantCode, ticketId)}/comments/${key}`;
  const pathB = `${supportPaths.inboxTicket(ticketId)}/comments/${key}`;
  await update(ref(db), { [pathA]: comment, [pathB]: comment });
}
