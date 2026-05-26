import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Calendar } from "lucide-react";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { ADMIN_PATH } from "@/lib/constants";
import { MessageActions } from "@/components/admin/MessageActions";

export const dynamic = "force-dynamic";

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Service-role: dashboard layout already guards auth. Bypasses RLS.
  const supabase = createSupabaseServiceRoleClient();
  const { data: message, error } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) console.error("[admin/messages/:id] fetch failed:", error.message);
  if (!message) notFound();

  // Mark as read on open
  if (message.status === "new") {
    await supabase
      .from("contact_messages")
      .update({ status: "read", handled_at: new Date().toISOString() })
      .eq("id", id);
  }

  const date = new Date(message.created_at as string);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={`${ADMIN_PATH}/messages`}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#C9D1D9] hover:text-[#C77DFF]"
      >
        <ArrowLeft className="h-4 w-4" />
        All messages
      </Link>

      <header className="rounded-2xl border border-white/10 bg-[#0B1320]/60 p-6 space-y-3">
        <h1 className="text-2xl font-bold text-white">{message.subject as string}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
          <span className="inline-flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-[#C77DFF]" />
            <span className="text-[#C9D1D9]">{message.name as string}</span>{" "}
            &lt;{message.email as string}&gt;
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[#C77DFF]" />
            {date.toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}
          </span>
        </div>
      </header>

      <section className="rounded-2xl border border-white/10 bg-[#0B1320]/60 p-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#C9D1D9]">
          {message.message as string}
        </p>
      </section>

      <MessageActions id={id} email={message.email as string} subject={message.subject as string} />
    </div>
  );
}
