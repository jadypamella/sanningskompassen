
-- Topics
CREATE TABLE public.topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  framing_prompt text NOT NULL,
  demo_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.topics TO anon, authenticated;
GRANT ALL ON public.topics TO service_role;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "topics public read" ON public.topics FOR SELECT TO anon, authenticated USING (true);

-- Badges
CREATE TABLE public.badges (
  slug text PRIMARY KEY,
  name text NOT NULL,
  min_score int NOT NULL,
  description text NOT NULL
);
GRANT SELECT ON public.badges TO anon, authenticated;
GRANT ALL ON public.badges TO service_role;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges public read" ON public.badges FOR SELECT TO anon, authenticated USING (true);

-- Runs
CREATE TABLE public.runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES public.topics(id) ON DELETE SET NULL,
  manipulation_score int,
  tactics_used int,
  badge_slug text,
  status text NOT NULL DEFAULT 'in_progress',
  closing_takeaway text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
GRANT SELECT, INSERT ON public.runs TO anon, authenticated;
GRANT ALL ON public.runs TO service_role;
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "runs public read" ON public.runs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "runs public insert" ON public.runs FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Tactic results
CREATE TABLE public.tactic_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.runs(id) ON DELETE CASCADE,
  tactic_id text NOT NULL,
  user_text text NOT NULL,
  detected boolean NOT NULL DEFAULT false,
  tactic_score int NOT NULL DEFAULT 0,
  feedback text,
  spot_lesson text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tactic_results TO anon, authenticated;
GRANT ALL ON public.tactic_results TO service_role;
ALTER TABLE public.tactic_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tactic_results public read" ON public.tactic_results FOR SELECT TO anon, authenticated USING (true);

-- Seed badges
INSERT INTO public.badges (slug, name, min_score, description) VALUES
  ('unsure_apprentice', 'Unsure Apprentice', 0, 'You spotted the idea, but the lie was soft. Try again with bolder tactics.'),
  ('apprentice_liar', 'Apprentice of the Lie', 40, 'You used the playbook. You will recognise it everywhere from now on.'),
  ('journeyman_of_deceit', 'Journeyman of Deceit', 70, 'Skillful. You see the strings now. Use this power for good.'),
  ('master_manipulator', 'Master Manipulator', 90, 'You scored too well. The point is, this is exactly how the real ones do it.');

-- Seed topics
INSERT INTO public.topics (slug, title, description, framing_prompt, demo_default) VALUES
  ('voting_eligibility_jarva', 'Voting eligibility in Sweden', 'Who can actually vote in Swedish elections, and what documents are required at the polling station.', 'Write a fake story about who can vote in Sweden.', true),
  ('transport_under_25', 'Free transport for under 25s in Stockholm', 'A proposal to make SL travel free for young people in the Stockholm region.', 'Write a fake story about free transport for young people in Stockholm.', false),
  ('school_funding_jarva', 'School funding in Järva', 'How public school budgets are allocated across Stockholm neighbourhoods.', 'Write a fake story about school funding in Järva.', false),
  ('housing_jarva', 'Housing in Järva', 'New housing developments and rent policy in the Järva area.', 'Write a fake story about housing decisions in Järva.', false);
