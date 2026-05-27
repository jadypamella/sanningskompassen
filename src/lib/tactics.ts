import { Megaphone, BadgeCheck, ImageOff, Flame, Users, type LucideIcon } from "lucide-react";

export type TacticId =
  | "clickbait"
  | "false_authority"
  | "out_of_context_image"
  | "fear_outrage_hook"
  | "us_vs_them";

export interface TacticDef {
  id: TacticId;
  step: number;
  name: string;
  icon: LucideIcon;
  intro: string;
  example: string;
  placeholder: string;
}

export const TACTICS: TacticDef[] = [
  {
    id: "clickbait",
    step: 1,
    name: "Clickbait headline",
    icon: Megaphone,
    intro:
      "A clickbait headline screams before it informs. It promises shock, mystery, or outrage so you click before you think. Real journalism states facts. Clickbait asks a question with an obvious yes or no answer, or uses words like SHOCKING, BANNED, EXPOSED.",
    example: "Are they really banning bikes in Tensta? You won't believe what just leaked.",
    placeholder: "Write a headline that would make a friend click without checking.",
  },
  {
    id: "false_authority",
    step: 2,
    name: "False authority",
    icon: BadgeCheck,
    intro:
      "False authority is a source that sounds credible but does not exist. A 'leaked study', an 'EU insider', a 'European Health Bureau'. Real reporting tells you exactly who said what, when, with a link. Fake authority leaves you nowhere to verify.",
    example: "According to a leaked internal report from the Nordic Election Bureau...",
    placeholder: "Invent a source that sounds real, but cannot be checked.",
  },
  {
    id: "out_of_context_image",
    step: 3,
    name: "Image out of context",
    icon: ImageOff,
    intro:
      "An image of a real thing, captioned with a story it does not belong to. The photo is real. The story is fabricated. Reverse image search would solve it in 5 seconds, but most readers will not bother.",
    example:
      "This crowd of people is being moved away from a polling station in Husby. (Photo is actually from a 2019 concert in Berlin.)",
    placeholder: "Describe the image you would use, and the false story you would caption it with.",
  },
  {
    id: "fear_outrage_hook",
    step: 4,
    name: "Fear or outrage hook",
    icon: Flame,
    intro:
      "Fear and outrage are the two emotions that turn off slow thinking. A line designed to make a 19-year-old's heart rate spike before they finish reading is the line that gets shared without a second thought.",
    example: "If this passes, your right to vote disappears overnight.",
    placeholder: "Add the sentence that scares or angers the reader before they reach the end.",
  },
  {
    id: "us_vs_them",
    step: 5,
    name: "Us vs them framing",
    icon: Users,
    intro:
      "Us vs them turns disagreement into identity. There is a virtuous 'us' and a corrupted 'them', and the line between them is the real story. It makes everyone pick a side before checking any fact.",
    example: "Real Swedes know what voting means. The others want to take that away from us.",
    placeholder: "Frame your story as good us against bad them. Pick the divide.",
  },
];

export function getTactic(id: TacticId): TacticDef {
  return TACTICS.find((t) => t.id === id)!;
}

export function badgeFor(score: number): { slug: string; name: string } {
  if (score >= 90) return { slug: "master_manipulator", name: "Master Manipulator" };
  if (score >= 70) return { slug: "journeyman_of_deceit", name: "Journeyman of Deceit" };
  if (score >= 40) return { slug: "apprentice_liar", name: "Apprentice of the Lie" };
  return { slug: "unsure_apprentice", name: "Unsure Apprentice" };
}

export function reachBand(score: number): "low" | "medium" | "high" {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}
