DROP POLICY IF EXISTS "Anyone can view members count" ON public.community_members;

CREATE OR REPLACE FUNCTION public.get_community_member_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::integer FROM public.community_members;
$$;