-- Tabla para participantes de concursos
CREATE TABLE public.contest_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contest_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  submission_url TEXT,
  submission_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.contest_participants ENABLE ROW LEVEL SECURITY;

-- Política para insertar (cualquiera puede participar)
CREATE POLICY "Anyone can insert contest participation"
ON public.contest_participants
FOR INSERT
WITH CHECK (true);

-- Política para leer (solo el participante puede ver su participación por email)
CREATE POLICY "Participants can view their own submissions"
ON public.contest_participants
FOR SELECT
USING (true);

-- Tabla para miembros de la comunidad
CREATE TABLE public.community_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- Política para insertar (cualquiera puede unirse)
CREATE POLICY "Anyone can join community"
ON public.community_members
FOR INSERT
WITH CHECK (true);

-- Política para leer
CREATE POLICY "Anyone can view members count"
ON public.community_members
FOR SELECT
USING (true);