import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listTopics = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("topics")
    .select("id, slug, title, description, framing_prompt, demo_default")
    .order("demo_default", { ascending: false })
    .order("title");
  if (error) throw new Error(error.message);
  return data ?? [];
});
