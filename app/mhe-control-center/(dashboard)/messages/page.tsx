import Link from "next/link";
import { Mail, Inbox } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ADMIN_PATH } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("id, name, email, subject, message, status, created_at")
    .order("created_at", { ascending: false });

  const messages = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="mt-1 text-sm text-white/60">{messages.length} total</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-16 text-center">
          <Inbox className="mx-auto h-10 w-10 text-white/30" />
          <p className="mt-3 text-sm text-white/60">No messages yet.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {messages.map((m) => {
            const status = (m.status as string) || "new";
            const date = new Date(m.created_at as string);
            return (
              <li key={m.id as string}>
                <Link
                  href={`${ADMIN_PATH}/messages/${m.id}`}
                  className="group flex items-start gap-4 rounded-xl border border-white/10 bg-[#0B1320]/60 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-[#C77DFF]/40"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#C77DFF]/15">
                    <Mail className="h-4 w-4 text-[#C77DFF]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-white">{m.subject as string}</p>
                      {status === "new" && (
                        <span className="rounded-full bg-[#C77DFF]/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#C77DFF]">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-white/60">
                      from <span className="text-[#C9D1D9]">{m.name as string}</span> ·{" "}
                      {m.email as string}
                    </p>
                    <p className="mt-1 line-clamp-1 text-sm text-white/70">{m.message as string}</p>
                  </div>
                  <span className="flex-shrink-0 text-xs text-white/40">
                    {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
