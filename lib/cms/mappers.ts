/**
 * Snake_case ↔ camelCase mappers for Supabase rows ↔ frontend objects.
 *
 * Includes special handling for PostgreSQL reserved keyword renames:
 *   - about.currentRole       <-> current_job_role
 *   - experience.role         <-> job_role
 *   - publications.year       <-> publication_year
 *   - achievements.year       <-> award_year
 */

export type DbRow = Record<string, unknown>;
export type FrontendObject = Record<string, unknown>;

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function mapRowToFrontend<T extends DbRow>(row: T): FrontendObject {
  const result: FrontendObject = {};
  for (const [key, value] of Object.entries(row)) {
    result[toCamelCase(key)] = value;
  }
  return result;
}

export function mapFrontendToRow<T extends FrontendObject>(obj: T): DbRow {
  const result: DbRow = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip frontend-only fields
    if (key === "createdAt" || key === "updatedAt") continue;
    result[toSnakeCase(key)] = value;
  }
  return result;
}

/**
 * Apply reserved-keyword renames when mapping FROM database to frontend.
 * Called AFTER mapRowToFrontend so input keys are already camelCase.
 */
export function applySpecialMappingsFromDb(
  tableKey: string,
  data: FrontendObject,
): FrontendObject {
  const result = { ...data };

  if (tableKey === "about" && "currentJobRole" in result) {
    result.currentRole = result.currentJobRole;
    delete result.currentJobRole;
  }

  if (tableKey === "experience" && "jobRole" in result) {
    result.role = result.jobRole;
    delete result.jobRole;
  }

  if (tableKey === "publications" && "publicationYear" in result) {
    result.year = result.publicationYear;
    delete result.publicationYear;
  }

  if (tableKey === "achievements" && "awardYear" in result) {
    result.year = result.awardYear;
    delete result.awardYear;
  }

  return result;
}

/**
 * Apply reserved-keyword renames when mapping FROM frontend to database.
 * Called AFTER mapFrontendToRow so input keys are already snake_case.
 */
export function applySpecialMappingsToDb(tableKey: string, data: DbRow): DbRow {
  const result = { ...data };

  if (tableKey === "about" && "current_role" in result) {
    result.current_job_role = result.current_role;
    delete result.current_role;
  }

  if (tableKey === "experience" && "role" in result) {
    result.job_role = result.role;
    delete result.role;
  }

  if (tableKey === "publications" && "year" in result) {
    result.publication_year = result.year;
    delete result.year;
  }

  if (tableKey === "achievements" && "year" in result) {
    result.award_year = result.year;
    delete result.year;
  }

  return result;
}

/**
 * Convenience helper: read a row, map keys, apply special renames.
 * Generic in the OUTPUT type so callers can type the row shape.
 */
export function deserializeRow<T = FrontendObject>(
  row: DbRow | null | undefined,
  tableKey: string,
): T | null {
  if (!row) return null;
  const mapped = mapRowToFrontend(row);
  return applySpecialMappingsFromDb(tableKey, mapped) as unknown as T;
}

export function deserializeRows<T = FrontendObject>(
  rows: DbRow[] | null | undefined,
  tableKey: string,
): T[] {
  if (!rows) return [];
  return rows.map((row) => {
    const mapped = mapRowToFrontend(row);
    return applySpecialMappingsFromDb(tableKey, mapped) as unknown as T;
  });
}

/**
 * Serialize a frontend object for a database write.
 * Strips createdAt/updatedAt, snake_cases keys, applies special renames.
 */
export function serializeForDb(values: FrontendObject, tableKey: string): DbRow {
  const snakeCased = mapFrontendToRow(values);
  return applySpecialMappingsToDb(tableKey, snakeCased);
}
