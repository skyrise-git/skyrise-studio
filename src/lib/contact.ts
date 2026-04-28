/**
 * WhatsApp chat link. `NEXT_PUBLIC_WHATSAPP_PHONE` overrides (digits only,
 * country code + number, no +). Otherwise uses the project default below.
 */
const DEFAULT_WHATSAPP_PHONE_DIGITS = "13399993702";

export function getWhatsAppHref(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/\D/g, "") ||
    DEFAULT_WHATSAPP_PHONE_DIGITS;
  if (!raw) return null;
  return `https://wa.me/${raw}`;
}
