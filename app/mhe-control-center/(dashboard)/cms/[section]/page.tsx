import { notFound } from "next/navigation";
import { CmsSectionEditor } from "@/components/admin/CmsSectionEditor";
import { sectionSchemas } from "@/lib/cms/schemas";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { collectionToTable, singletonToTable } from "@/lib/cms/tables";
import { deserializeRow, deserializeRows, type DbRow } from "@/lib/cms/mappers";

/**
 * Dynamic CMS section editor.
 * Drives every admin section (16 in total) from the same schema.
 *
 * Uses the service-role client to read CMS data. SAFE: the (dashboard)/layout.tsx
 * already verifies the user is authenticated and redirects otherwise — this
 * route can only render for an authenticated admin. Service role bypasses
 * RLS so we never get silent empty results due to a missing read policy.
 */
export default async function CmsSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const schema = sectionSchemas[section];
  if (!schema) notFound();

  const supabase = createSupabaseServiceRoleClient();

  if (schema.kind === "singleton") {
    const table = singletonToTable[section as keyof typeof singletonToTable];
    const { data, error } = await supabase.from(table).select("*").maybeSingle();
    if (error) {
      console.error(`[admin/cms/${section}] singleton fetch failed:`, error.message);
    }

    let initial: Record<string, unknown> = {};
    if (data) {
      initial = deserializeRow(data as DbRow, section) ?? {};
      // Re-shape contact singleton's flat columns back into nested contactInfo
      if (section === "contact") {
        initial = {
          ...initial,
          contactInfo: {
            email: (initial.email as string) ?? "",
            phone: (initial.phone as string) ?? "",
            location: (initial.location as string) ?? "",
          },
        };
        delete initial.email;
        delete initial.phone;
        delete initial.location;
      }
    }

    return <CmsSectionEditor schema={schema} initialData={initial} />;
  }

  // collection
  const table = collectionToTable[section as keyof typeof collectionToTable];
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("order_index", { ascending: true, nullsFirst: false });
  if (error) {
    console.error(`[admin/cms/${section}] collection fetch failed:`, error.message);
  }
  const items = deserializeRows((data ?? []) as DbRow[], section);

  return <CmsSectionEditor schema={schema} initialData={items} />;
}
