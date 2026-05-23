/**
 * Server Component that injects schema.org JSON-LD into a page.
 *
 * Usage:
 *   <JsonLd data={{ "@type": "Person", name: "..." }} />
 *   <JsonLd data={[schemaA, schemaB]} />
 */
type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

export function JsonLd({ data }: { data: JsonLdData }) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
