import type { Metadata } from "next";
import SupportClientPortal from "@/components/support/support-client-portal";

export const metadata: Metadata = {
  title: "Client Support | SkyRise Studio",
  description:
    "Log feature requests and bug reports, track timelines and resolutions, and view past fixes with your Skyrise client access code.",
};

export default function SupportPage() {
  return <SupportClientPortal />;
}
