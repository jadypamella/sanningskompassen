import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research · Sanningskompassen" },
      {
        name: "description",
        content: "Inoculation research behind Sanningskompassen, from Cambridge studies on misinformation.",
      },
    ],
  }),
  component: ResearchPage,
});

const CITATIONS = [
  {
    title: "Fake news game confers psychological resistance against online misinformation",
    authors: "Roozenbeek, J., & van der Linden, S.",
    journal: "Palgrave Communications, 5, 65",
    year: "2019",
    url: "https://www.nature.com/articles/s41599-019-0279-9",
    summary:
      "The original Cambridge study. Participants who played a short fake-news game became measurably better at spotting manipulation, across political beliefs and education levels.",
  },
  {
    title: "Psychological inoculation improves resilience against misinformation on social media",
    authors: "Roozenbeek, J., van der Linden, S., Goldberg, B., Rathje, S., & Lewandowsky, S.",
    journal: "Science Advances, 8(34), eabo6254",
    year: "2022",
    url: "https://www.science.org/doi/10.1126/sciadv.abo6254",
    summary:
      "A field study with roughly 30 000 YouTube participants. Short inoculation videos reliably improved manipulation detection in the wild, not just in a lab.",
  },
  {
    title: "Bad News (game)",
    authors: "DROG and the University of Cambridge",
    journal: "getbadnews.com",
    year: "2018",
    url: "https://www.getbadnews.com/",
    summary:
      "The interactive game whose tactic taxonomy directly inspired Sanningskompassen's 5-step workshop.",
  },
  {
    title:
      "Resistance to persuasion conferred by active and passive prior refutation of the same and alternative counterarguments",
    authors: "McGuire, W. J.",
    journal: "Journal of Abnormal and Social Psychology, 63(2), 326-332",
    year: "1961",
    url: "https://psycnet.apa.org/record/1962-04829-001",
    summary: "The original psychological theory of inoculation. Six decades later, it still holds.",
  },
];

function ResearchPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="text-xs uppercase tracking-[4px] text-gold font-semibold mb-2">Research</div>
        <h1 className="font-display font-extrabold text-navy text-4xl md:text-5xl mb-6">
          Why writing fakes makes you spot them.
        </h1>
        <div className="space-y-4 text-navy leading-relaxed">
          <p>
            Inoculation theory is the idea that exposure to a weakened version of a manipulation builds mental
            antibodies against the real thing. The same way a vaccine works for the body, a guided practice with
            the tactics of misinformation works for the brain.
          </p>
          <p>
            Sanningskompassen turns that theory into a five-minute workshop. By writing fake political content with
            your own hands, you internalise the shape of clickbait, false authority, displaced images, fear hooks,
            and us-vs-them framing. Once you have built one, you cannot un-see it on your feed.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {CITATIONS.map((c) => (
            <a
              key={c.title}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-border bg-background p-5 hover:border-gold transition"
            >
              <div className="text-xs uppercase tracking-[2px] text-gold font-semibold mb-1">{c.year}</div>
              <h3 className="font-display font-bold text-navy text-lg mb-1">{c.title}</h3>
              <p className="text-xs text-muted-foreground italic mb-3">
                {c.authors} · {c.journal}
              </p>
              <p className="text-sm text-navy">{c.summary}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold">
                Open source <ExternalLink className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-10 rounded-lg bg-paper border border-border p-5 text-sm text-muted-foreground">
          The same logic powers anti-phishing training in cybersecurity. Sending employees a controlled fake phish
          measurably improves their ability to spot real ones. Sanningskompassen applies that pattern to political
          information.
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Sanningskompassen is built for the Järvaveckan Hackathon 2026. The tactic taxonomy is adapted from the Bad
          News game (DROG and Cambridge).
        </p>
      </section>
    </AppShell>
  );
}
