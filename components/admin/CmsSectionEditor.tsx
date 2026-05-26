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
  AlertTriangle,
  X,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { EntityForm } from "./EntityForm";
import { TechStackToolsEditor } from "./TechStackToolsEditor";
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
  const [confirmDelete, setConfirmDelete] = useState<Row | null>(null);

  const collectionKey = schema.key as CollectionKey;
  const hasSlug = schema.fields.some((f) => f.name === "slug");
  const hasOrderIndex = schema.fields.some((f) => f.name === "orderIndex");

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
    // Auto-assign orderIndex = items.length so new items append to the bottom
    const next = hasOrderIndex && !values.orderIndex
      ? { ...values, orderIndex: items.length }
      : values;
    await toast.promise(
      (async () => {
        const created = await createCollectionItem(collectionKey, next);
        setItems((prev) => [...prev, created as Row]);
        setMode("list");
      })(),
      { loading: "Creating…", success: "Created", error: (err) => (err instanceof Error ? err.message : "Create failed") },
    );
  };

  // Swap order_index between two adjacent items and persist both
  const handleMove = async (id: string, direction: "up" | "down") => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;

    const a = items[idx];
    const b = items[swapIdx];
    const aOrder = Number(a.orderIndex ?? idx);
    const bOrder = Number(b.orderIndex ?? swapIdx);

    const next = [...items];
    next[idx] = { ...b, orderIndex: aOrder };
    next[swapIdx] = { ...a, orderIndex: bOrder };
    setItems(next);

    try {
      await Promise.all([
        updateCollectionItem(collectionKey, a.id, { orderIndex: bOrder }),
        updateCollectionItem(collectionKey, b.id, { orderIndex: aOrder }),
      ]);
    } catch (err) {
      // Revert UI on failure
      setItems(items);
      toast.error(err instanceof Error ? err.message : "Reorder failed");
    }
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
    setDeleting(id);
    try {
      await deleteCollectionItem(collectionKey, id);
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast.success("Deleted");
      setConfirmDelete(null);
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
            autoSlug={hasSlug}
            onSubmit={async (values) => {
              if (mode === "create") await handleCreate(values);
              else await handleUpdate(mode.id, values);
            }}
            onCancel={() => setMode("list")}
            submitLabel={mode === "create" ? "Create" : "Save changes"}
          />
        </div>

        {/* Tech Stack: nested tools editor when editing an existing category */}
        {collectionKey === "techStackCategories" &&
          mode !== "create" &&
          editingItem && (
            <TechStackToolsEditor
              categoryId={editingItem.id}
              categoryName={String(editingItem.categoryName ?? "Category")}
              initialTools={
                (Array.isArray(editingItem.tools)
                  ? (editingItem.tools as Array<{
                      id: string;
                      name: string;
                      logoUrl: string | null;
                      proficiencyLevel: number;
                    }>)
                  : []) ?? []
              }
            />
          )}
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
        <div className="rounded-3xl border border-dashed border-white/15 bg-gradient-to-br from-[#0B1320]/40 via-transparent to-[#0B1320]/40 p-12 sm:p-16 text-center">
          {search ? (
            <p className="text-sm text-white/60">
              No items match &ldquo;<span className="text-white">{search}</span>&rdquo;.
            </p>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C77DFF]/20 to-[#9D4EDD]/20 border border-[#C77DFF]/30">
                <Sparkles className="h-8 w-8 text-[#C77DFF]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  No {schema.title.toLowerCase()} yet
                </h3>
                <p className="text-sm text-white/60 max-w-md mx-auto">
                  Add your first {schema.title.toLowerCase().replace(/s$/, "")} to see it on the public site.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMode("create")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#C77DFF]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <Plus className="h-4 w-4" />
                Add first {schema.title.toLowerCase().replace(/s$/, "")}
              </button>
            </div>
          )}
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((item, idx) => {
            const status = (item.status as string) || "draft";
            const isFirst = idx === 0;
            const isLast = idx === filtered.length - 1;
            return (
              <li
                key={item.id}
                className="group flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 rounded-xl border border-white/10 bg-[#0B1320]/60 px-3 sm:px-4 py-3 transition-all hover:border-[#C77DFF]/30 hover:bg-[#0B1320]/80"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {status === "published" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-yellow-500/60 flex-shrink-0" />
                    )}
                    <span className="truncate text-sm font-medium text-white">{getLabel(item)}</span>
                  </div>
                  {item.slug ? (
                    <p className="ml-5 truncate text-xs text-white/40">
                      /{String(item.slug)}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
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
                  {hasOrderIndex && !search.trim() && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleMove(item.id, "up")}
                        disabled={isFirst}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:border-[#C77DFF]/40 hover:text-[#C77DFF] disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(item.id, "down")}
                        disabled={isLast}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:border-[#C77DFF]/40 hover:text-[#C77DFF] disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </>
                  )}
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
                  onClick={() => setConfirmDelete(item)}
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
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => deleting === null && setConfirmDelete(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-red-500/30 bg-[#0B1320] p-6 shadow-2xl shadow-red-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setConfirmDelete(null)}
              disabled={deleting !== null}
              className="absolute top-4 right-4 text-white/40 hover:text-white disabled:opacity-30"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/15 border border-red-500/30">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-bold text-white mb-1">Delete this item?</h3>
                <p className="text-sm text-[#C9D1D9]">
                  <span className="font-semibold text-white">{getLabel(confirmDelete)}</span> will be
                  permanently removed. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={deleting !== null}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[#C9D1D9] hover:bg-white/5 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={deleting !== null}
                className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/30 hover:bg-red-600 disabled:opacity-50"
              >
                {deleting !== null ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
