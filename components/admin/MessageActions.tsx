"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, Reply, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ADMIN_PATH } from "@/lib/constants";

export function MessageActions({
  id,
  email,
  subject,
}: {
  id: string;
  email: string;
  subject: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
      toast.success("Message deleted");
      router.push(`${ADMIN_PATH}/messages`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
    }
  };

  const replyHref = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;

  return (
    <div className="flex items-center gap-3">
      <a
        href={replyHref}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#C77DFF]/20 hover:shadow-lg"
      >
        <Reply className="h-4 w-4" />
        Reply
      </a>
      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50"
      >
        {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        Delete
      </button>
    </div>
  );
}
