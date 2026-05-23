"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Loader2,
  Search,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { toast } from "sonner";
import { EntityForm } from "./EntityForm";
import {
  createCollectionItem,
  deleteCollectionItem,
  updateCollectionItem,
  updateSingletonRow,
} from "@/lib/cms/mutations";
import { type SectionSchema } from "@/lib/cms/schemas";
import type { CollectionKey, SingletonKey } from "@/lib/cms/tables";
import { cn } from "@/lib/utils/cn";

type Props = {
  schema: SectionSchema;
  initialData: Record<string, unknown> | Record<string, unknown>[];
};

export function CmsSectionEditor({ schema, initialData }: Props) {
  if (schema.kind === "singleton") {
    return <SingletonEditor schema={schema} initial={initialData as Record<string, unknown>} />;
  }
  return <CollectionEditor schema={schema} initial={initialData as Record<string, unknown>[]} />;
}

function SingletonEditor({
  schema,
  initial,
}: {
  schema: SectionSchema;
  initial: Record<string, unknown>;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{schema.title}</h1>
      <div className="rounded-2xl border border-white/10 bg-[#0B1320]/60 p-6 backdrop-blur-sm">
        <EntityForm
          fields={schema.fields}
          initial={initial}
          autoComputeReadTime={false}
          onSubmit={async (values) => {
            await toast.promise(updateSingletonRow(schema.key as SingletonKey, values), {
              loading: "Saving…",
              success: "Saved successfully",
              error: (err) => (err instanceof Error ? err.message : "Save failed"),
            });
          }}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}

type Row = Record<string, unknown> & { id: string };

function CollectionEditor({
  schema,
  initial,
}: {
  schema: SectionSchema;
  initial: Record<string, unknown>[];
}) {
  const [items, setItems] = useState<Row[]>(initial as Row[]);
  const [mode, setMode] = useState<"list" | "create" | { type: "edit"; id: string }>("list");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const collectionKey = schema.key as CollectionKey;

  const filtered = items.filter((item) => {
    if (!search.trim()) return true;
    const hay = JSON.stringify(item).toLowerCase();
    return hay.includes(search.toLowerCase());
  });

  const editingItem =
    mode !== "list" && mode !== "create"
      ? items.find((i) => i.id === mode.id)
      : null;

  const handleCreate = async (values: Record<string, unknown>) => {
    await toast.promise(
      (async () => {
        const created = await createCollectionItem(collectionKey, values);
        setItems((prev) => [created as Row, ...prev]);
        setMode("list");
      })(),
      { loading: "Creating…", success: "Created", error: (err) => (err instanceof Error ? err.message : "Create failed") },
    );
  };

  const handleUpdate = async (id: string, values: Record<string, unknown>) => {
    await toast.promise(
      (async () => {
        await updateCollectionItem(collectionKey, id, values);
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...values } : x)));
        setMode("list");
      })(),
      { loading: "Saving…", success: "Saved", error: (err) => (err instanceof Error ? err.message : "Save failed") },
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await deleteCollectionItem(collectionKey, id);
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const getLabel = (item: Row): string =>
    String(
      item.title ??
        item.name ??
        item.subject ??
        item.slug ??
        item.company ??
        item.role ??
        item.institution ??
        item.categoryName ??
        item.certificateTitle ??
        item.issuer ??
        item.author ??
        item.id,
    );

  const autoComputeReadTime = schema.key === "blogs";

  if (mode === "create" || mode !== "list") {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setMode("list")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#C9D1D9] hover:text-[#C77DFF]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </button>
        <div className="rounded-2xl border border-white/10 bg-[#0B1320]/60 p-6 backdrop-blur-sm">
          <h2 className="mb-6 text-xl font-bold text-white">
            {mode === "create" ? `New ${schema.title} item` : `Edit ${schema.title}`}
          </h2>
          <EntityForm
            fields={schema.fields}
            initial={mode === "create" ? undefined : editingItem ?? undefined}
            autoComputeReadTime={autoComputeReadTime}
            onSubmit={async (values) => {
              if (mode === "create") await handleCreate(values);
              else await handleUpdate(mode.id, values);
            }}
            onCancel={() => setMode("list")}
            submitLabel={mode === "create" ? "Create" : "Save changes"}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">
          {schema.title} <span className="text-base font-normal text-white/40">({items.length})</span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-56 rounded-xl border border-white/10 bg-[#0B1320]/60 py-2 pl-9 pr-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30"
            />
          </div>
          <button
            type="button"
            onClick={() => setMode("create")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#C77DFF]/20 hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            New
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-16 text-center">
          <p className="text-sm text-white/60">
            {search
              ? "No items match your search."
              : `No ${schema.title.toLowerCase()} yet — click "New" to add one.`}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((item) => {
            const status = (item.status as string) || "draft";
            return (
              <li
                key={item.id}
                className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0B1320]/60 px-4 py-3 transition-all hover:border-[#C77DFF]/30 hover:bg-[#0B1320]/80"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {status === "published" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-yellow-500/60" />
                    )}
                    <span className="truncate text-sm font-medium text-white">{getLabel(item)}</span>
                  </div>
                  {item.slug ? (
                    <p className="ml-5 truncate text-xs text-white/40">
                      /{String(item.slug)}
                    </p>
                  ) : null}
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                    status === "published"
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-yellow-500/15 text-yellow-300",
                  )}
                >
                  {status}
                </span>
                <button
                  type="button"
                  onClick={() => setMode({ type: "edit", id: item.id })}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:border-[#C77DFF]/40 hover:text-[#C77DFF]"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 disabled:opacity-40"
                  aria-label="Delete"
                >
                  {deleting === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
