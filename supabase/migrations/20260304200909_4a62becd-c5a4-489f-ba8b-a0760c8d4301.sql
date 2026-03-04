
-- Table for AI-generated content (news, theories)
CREATE TABLE public.ai_generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL DEFAULT 'news',
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'IA',
  trending boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Allow public read access (no auth needed for viewing news)
ALTER TABLE public.ai_generated_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read AI content"
  ON public.ai_generated_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Enable pg_cron and pg_net for scheduled content generation
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
