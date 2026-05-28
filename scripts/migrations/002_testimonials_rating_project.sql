-- Migration 002: Testimonials — add rating + project_name
--
-- Run in Supabase Dashboard -> SQL Editor (Database -> SQL Editor).
-- Safe additive migration: existing rows get the defaults shown below,
-- nothing breaks if you run it more than once.
--
-- Date: 2026-05-28

ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS rating       integer,
  ADD COLUMN IF NOT EXISTS project_name text;

COMMENT ON COLUMN testimonials.rating IS
  '1-5 integer star rating shown on the public testimonials section. NULL = render as 5 (full stars).';

COMMENT ON COLUMN testimonials.project_name IS
  'Optional context: name of the project this client worked on with you. Rendered under role/company on the public card.';

-- Sanity check after running:
--   SELECT id, author, rating, project_name FROM testimonials LIMIT 5;
