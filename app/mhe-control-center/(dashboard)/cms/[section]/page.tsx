import { notFound } from "next/navigation";
import { CmsSectionEditor } from "@/components/admin/CmsSectionEditor";
import { sectionSchemas } from "@/lib/cms/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { collectionToTable, singletonToTable } from "@/lib/cms/tables";
import { deserializeRow, deserializeRows, type DbRow } from "@/lib/cms/mappers";

/**
 * Dynamic CMS section editor.
 * Drives every admin section (16 in total) from the same schema.
 */
export default async function CmsSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const schema = sectionSchemas[section];
  if (!schema) notFound();

  const supabase = await createSupabaseServerClient();

  if (schema.kind === "singleton") {
    const table = singletonToTable[section as keyof typeof singletonToTable];
    const { data } = await supabase.from(table).select("*").maybeSingle();

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
  const { data } = await supabase
    .from(table)
    .select("*")
    .order("order_index", { ascending: true, nullsFirst: false });
  const items = deserializeRows((data ?? []) as DbRow[], section);

  return <CmsSectionEditor schema={schema} initialData={items} />;
}
