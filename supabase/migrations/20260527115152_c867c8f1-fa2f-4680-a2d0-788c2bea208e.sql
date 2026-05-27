
CREATE TABLE public.checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  claim_text text NOT NULL,
  verdict text NOT NULL,
  confidence text NOT NULL,
  explanation text NOT NULL,
  tactics jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.checks TO anon, authenticated;
GRANT ALL ON public.checks TO service_role;
ALTER TABLE public.checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "checks public read" ON public.checks FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "checks public insert" ON public.checks FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.example_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  claim_text text NOT NULL,
  demo_default boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.example_claims TO anon, authenticated;
GRANT ALL ON public.example_claims TO service_role;
ALTER TABLE public.example_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "example_claims public read" ON public.example_claims FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.example_claims (slug, label, claim_text, demo_default, sort_order) VALUES
  ('passport_to_vote', 'Voting eligibility myth', 'You cannot vote in Sweden without a Swedish passport. Official sources confirm immigrants will be turned away at polling stations.', true, 1),
  ('bikes_banned_tensta', 'Bikes banned in Tensta', 'SHOCKING: A leaked EU report reveals bikes will be banned in Tensta next month. Real residents are furious, while outsiders push the change.', false, 2),
  ('polling_moved', 'Polling station moved', 'According to a Nordic Election Bureau insider, all polling stations in Husby have been secretly moved. Photo shows the empty entrance.', false, 3),
  ('young_voter_age', 'Voting age changed', 'BREAKING: Sweden just raised the voting age to 21 to silence young voters from Järva. Share before they take this down.', false, 4);
