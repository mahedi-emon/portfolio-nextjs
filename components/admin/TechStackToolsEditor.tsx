"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  ChevronUp,
  ChevronDown,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { updateCollectionItem } from "@/lib/cms/mutations";
import { getToolLogoUrl } from "@/lib/utils/getToolLogoUrl";

type Tool = {
  id: string;
  name: string;
  logoUrl: string | null;
  proficiencyLevel: number;
};

type Props = {
  categoryId: string;
  categoryName: string;
  initialTools: Tool[];
};

function uid(): string {
  return `tool_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Manages the `tools` JSONB array on a tech-stack-categories row.
 * Each save persists the entire tools array via updateCollectionItem.
 */
export function TechStackToolsEditor({ categoryId, categoryName, initialTools }: Props) {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const persist = async (next: Tool[]) => {
    setSaving(true);
    try {
      await updateCollectionItem("techStackCategories", categoryId, { tools: next });
      setTools(next);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async (input: Omit<Tool, "id">) => {
    const next = [...tools, { ...input, id: uid() }];
    await toast.promise(persist(next), {
      loading: "Adding tool…",
      success: "Tool added",
      error: (e) => (e instanceof Error ? e.message : "Failed"),
    });
    setAdding(false);
  };

  const handleUpdate = async (id: string, patch: Partial<Tool>) => {
    const next = tools.map((t) => (t.id === id ? { ...t, ...patch } : t));
    await toast.promise(persist(next), {
      loading: "Saving…",
      success: "Saved",
      error: (e) => (e instanceof Error ? e.message : "Failed"),
    });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    const next = tools.filter((t) => t.id !== id);
    await toast.promise(persist(next), {
      loading: "Removing…",
      success: "Tool removed",
      error: (e) => (e instanceof Error ? e.message : "Failed"),
    });
  };

  const handleMove = async (id: string, direction: "up" | "down") => {
    const idx = tools.findIndex((t) => t.id === id);
    if (idx < 0) return;
    const swap = direction === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= tools.length) return;
    const next = [...tools];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    await persist(next);
  };

  const handleAutoFixLogos = async () => {
    const next = tools.map((t) => {
      const auto = getToolLogoUrl(t.name);
      const isPlaceholder = !t.logoUrl || /data:image/.test(t.logoUrl);
      return isPlaceholder && auto ? { ...t, logoUrl: auto } : t;
    });
    await toast.promise(persist(next), {
      loading: "Auto-detecting logos…",
      success: "Logos updated",
      error: (e) => (e instanceof Error ? e.message : "Failed"),
    });
  };

  return (
    <div className="rounded-2xl border border-[#C77DFF]/20 bg-[#0B1320]/60 p-6 backdrop-blur-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white">
            Tools in <span className="text-[#C77DFF]">{categoryName}</span>
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            {tools.length} {tools.length === 1 ? "tool" : "tools"}
          </p>
        </div>
        <div className="flex gap-2">
          {tools.length > 0 && (
            <button
              type="button"
              onClick={handleAutoFixLogos}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-medium text-[#C9D1D9] hover:bg-white/5 disabled:opacity-50"
              title="Auto-detect logos for tools that don't have one"
            >
              <Wand2 className="h-3.5 w-3.5" />
              Auto-fix logos
            </button>
          )}
          <button
            type="button"
            onClick={() => setAdding(true)}
            disabled={adding || saving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] px-3 py-2 text-xs font-semibold text-white shadow-md shadow-[#C77DFF]/30 hover:shadow-lg disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add tool
          </button>
        </div>
      </div>

      {adding && (
        <ToolForm
          onCancel={() => setAdding(false)}
          onSave={(values) => handleAdd(values)}
          submitLabel="Add"
        />
      )}

      {tools.length === 0 && !adding ? (
        <p className="text-center text-sm text-white/50 py-8">
          No tools yet — click &ldquo;Add tool&rdquo; to insert React, Django, PyTorch, etc.
        </p>
      ) : (
        <ul className="space-y-2">
          {tools.map((tool, idx) => {
            const isEditing = editingId === tool.id;
            if (isEditing) {
              return (
                <li key={tool.id}>
                  <ToolForm
                    initial={tool}
                    onCancel={() => setEditingId(null)}
                    onSave={(values) => handleUpdate(tool.id, values)}
                    submitLabel="Save"
                  />
                </li>
              );
            }
            return (
              <li
                key={tool.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-xl border border-white/10 bg-[#0B1320]/60 p-3"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#0B1320] border border-white/10 overflow-hidden">
                  {tool.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tool.logoUrl}
                      alt={tool.name}
                      className="h-7 w-7 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#C77DFF]">
                      {tool.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{tool.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden max-w-[200px]">
                      <div
                        className="h-full bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD]"
                        style={{ width: `${Math.max(0, Math.min(100, tool.proficiencyLevel))}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-[#C77DFF] w-8">
                      {tool.proficiencyLevel}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleMove(tool.id, "up")}
                    disabled={idx === 0 || saving}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:border-[#C77DFF]/40 hover:text-[#C77DFF] disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(tool.id, "down")}
                    disabled={idx === tools.length - 1 || saving}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:border-[#C77DFF]/40 hover:text-[#C77DFF] disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(tool.id)}
                    disabled={saving}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:border-[#C77DFF]/40 hover:text-[#C77DFF]"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(tool.id)}
                    disabled={saving}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 disabled:opacity-40"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {/* Hidden Image import to keep next/image as a dep marker (used in card sections) */}
      <span className="hidden">
        <Image src="/favicon.png" alt="" width={1} height={1} />
      </span>
    </div>
  );
}

function ToolForm({
  initial,
  onCancel,
  onSave,
  submitLabel,
}: {
  initial?: Tool;
  onCancel: () => void;
  onSave: (values: Omit<Tool, "id">) => Promise<void>;
  submitLabel: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl ?? "");
  const [proficiencyLevel, setProficiency] = useState<number>(initial?.proficiencyLevel ?? 80);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Tool name required");
      return;
    }
    setBusy(true);
    try {
      const auto = !logoUrl ? getToolLogoUrl(name) : null;
      await onSave({
        name: name.trim(),
        logoUrl: logoUrl.trim() || auto || null,
        proficiencyLevel: Math.max(0, Math.min(100, Number(proficiencyLevel) || 0)),
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[#C77DFF]/30 bg-[#0B1320]/80 p-4 space-y-3"
    >
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1">
          <label className="block text-xs font-medium text-white/60 mb-1">Tool name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="React, Django..."
            className="w-full rounded-lg border border-white/10 bg-[#0B1320]/60 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30"
            autoFocus
          />
        </div>
        <div className="sm:col-span-1">
          <label className="block text-xs font-medium text-white/60 mb-1">
            Logo URL <span className="text-white/30">(empty = auto)</span>
          </label>
          <input
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="Leave empty for auto"
            className="w-full rounded-lg border border-white/10 bg-[#0B1320]/60 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30"
          />
        </div>
        <div className="sm:col-span-1">
          <label className="block text-xs font-medium text-white/60 mb-1">Proficiency 0-100</label>
          <input
            type="number"
            min={0}
            max={100}
            value={proficiencyLevel}
            onChange={(e) => setProficiency(Number(e.target.value))}
            className="w-full rounded-lg border border-white/10 bg-[#0B1320]/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30"
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-[#C9D1D9] hover:bg-white/5"
        >
          <X className="h-3.5 w-3.5 inline mr-1" /> Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-[#C77DFF]/30 hover:shadow-lg disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
