-- Table for karaoke recordings with voting
CREATE TABLE public.karaoke_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  song_id INTEGER NOT NULL,
  song_title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  votes INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.karaoke_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can view submissions (for voting)
CREATE POLICY "Anyone can view karaoke submissions"
ON public.karaoke_submissions
FOR SELECT
USING (true);

-- Anyone can insert their recording
CREATE POLICY "Anyone can submit karaoke"
ON public.karaoke_submissions
FOR INSERT
WITH CHECK (true);

-- Anyone can vote (update votes)
CREATE POLICY "Anyone can update votes"
ON public.karaoke_submissions
FOR UPDATE
USING (true);

-- Create storage bucket for karaoke audio
INSERT INTO storage.buckets (id, name, public)
VALUES ('karaoke-recordings', 'karaoke-recordings', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for karaoke recordings
CREATE POLICY "Anyone can view karaoke recordings"
ON storage.objects
FOR SELECT
USING (bucket_id = 'karaoke-recordings');

CREATE POLICY "Anyone can upload karaoke recordings"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'karaoke-recordings');