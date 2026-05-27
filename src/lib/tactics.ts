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

// Per-topic example overrides. Key by topic slug → tactic id → example string.
export const TOPIC_EXAMPLES: Record<string, Partial<Record<TacticId, string>>> = {
  voting_eligibility_jarva: {
    clickbait: "SHOCKING: Are voters in Järva about to be banned from the next election? You won't believe what just leaked.",
    false_authority: "According to a leaked memo from the Nordic Election Bureau, ID rules will change overnight.",
    out_of_context_image: "Crowd being turned away from a polling station in Husby. (Photo is actually from a 2019 concert in Berlin.)",
    fear_outrage_hook: "If this passes, your right to vote disappears overnight.",
    us_vs_them: "Real Swedes know what voting means. The others want to take that right away from us.",
  },
  transport_under_25: {
    clickbait: "EXPOSED: SL is secretly cancelling free transport for under-25s, buses stop next month?!",
    false_authority: "A leaked internal report from the Stockholm Transit Authority confirms the rollback.",
    out_of_context_image: "Empty SL bus at Tensta station, 'proof' the program already failed. (Photo is from a 2020 strike.)",
    fear_outrage_hook: "If this passes, you'll pay full price tomorrow and lose your student job by Friday.",
    us_vs_them: "Hard-working taxpayers vs the youth getting another free ride, pick a side.",
  },
  housing_jarva: {
    clickbait: "BANNED: Are families in Järva really being kicked out next week? You won't believe what just leaked.",
    false_authority: "According to a leaked report from the Stockholm Housing Council, evictions start in 30 days.",
    out_of_context_image: "Demolition crews moving into Husby tonight. (Photo is actually from a 2018 site in Malmö.)",
    fear_outrage_hook: "If this passes, your rent triples and your family is on the street by winter.",
    us_vs_them: "Locals who built this neighbourhood vs the newcomers taking the keys, whose side are you on?",
  },
  school_funding_jarva: {
    clickbait: "SHOCKING: Are Järva schools really losing all their funding next term? You won't believe what just leaked.",
    false_authority: "A leaked internal memo from the Stockholm Education Bureau confirms the cuts.",
    out_of_context_image: "Empty classroom in Rinkeby after 'forced closure'. (Photo is actually from a 2020 lockdown.)",
    fear_outrage_hook: "If this passes, your kids lose their teachers overnight.",
    us_vs_them: "Inner-city schools get everything. Järva kids get nothing. That's the real story.",
  },
};

export function getTacticExample(id: TacticId, topicSlug?: string | null): string {
  if (topicSlug && TOPIC_EXAMPLES[topicSlug]?.[id]) {
    return TOPIC_EXAMPLES[topicSlug]![id]!;
  }
  return TACTICS.find((t) => t.id === id)!.example;
}

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

// Spot game seed deck
export interface SpotCard {
  id: number;
  claim: string;
  truth: "TRUE" | "FALSE";
  tactics: TacticId[];
  explanation: string;
}

export const SPOT_DECK: SpotCard[] = [
  { id: 1, claim: "Swedish general elections are held every four years, on the second Sunday of September.", truth: "TRUE", tactics: [], explanation: "Sweden has held general elections every four years since 1994. The fixed date is the second Sunday of September." },
  { id: 2, claim: "EU citizens with three years of legal residence in Sweden can vote in municipal and regional elections.", truth: "TRUE", tactics: [], explanation: "Set in the Swedish Election Act. Residency, not citizenship, qualifies a person for local-level voting." },
  { id: 3, claim: "You need a Swedish passport to vote in Sweden.", truth: "FALSE", tactics: ["false_authority", "fear_outrage_hook"], explanation: "False. Citizenship and residency requirements apply, not passport. The claim is built to scare immigrant-background youth away from voting." },
  { id: 4, claim: "A leaked report from the Nordic Election Bureau says voters under 25 in Järva will be disqualified next election.", truth: "FALSE", tactics: ["false_authority", "us_vs_them"], explanation: "The Nordic Election Bureau does not exist. The claim invents an institution to attack young Järva voters specifically." },
  { id: 5, claim: "Sweden counts every ballot by hand, even in major elections.", truth: "TRUE", tactics: [], explanation: "Sweden uses paper ballots, counted manually at each polling station, with results verified by multiple officials." },
  { id: 6, claim: "If you don't vote in Sweden, the government will fine you 500 kronor next year.", truth: "FALSE", tactics: ["fear_outrage_hook"], explanation: "Voting in Sweden is voluntary. No fine exists. The claim is built to pressure-vote through fear." },
  { id: 7, claim: "Early voting (förtidsröstning) is open at libraries and citizen service offices across Sweden for several weeks before election day.", truth: "TRUE", tactics: [], explanation: "Förtidsröstning is widely available. Most libraries and many municipal offices serve as early voting locations." },
  { id: 8, claim: "SHOCKING: 90 percent of votes from Husby were thrown out last election because of language barriers.", truth: "FALSE", tactics: ["clickbait", "fear_outrage_hook"], explanation: "False. No such mass rejection happened. The claim uses a shock headline and a fabricated statistic to undermine trust in local voting." },
  { id: 9, claim: "The Swedish voting age has been 18 since 1975.", truth: "TRUE", tactics: [], explanation: "Sweden lowered the voting age to 18 in 1974, taking effect for the 1976 election. It has remained 18 for over half a century." },
  { id: 10, claim: "Real Swedes vote one way. The others want to take that right away from us.", truth: "FALSE", tactics: ["us_vs_them"], explanation: "No factual content. It exists to turn an election into an identity war between 'real Swedes' and 'the others'. That framing is the entire trick." },
];

export const TACTIC_LABELS: Record<TacticId, string> = {
  clickbait: "Clickbait",
  false_authority: "False authority",
  out_of_context_image: "Image out of context",
  fear_outrage_hook: "Fear or outrage hook",
  us_vs_them: "Us vs them",
};
