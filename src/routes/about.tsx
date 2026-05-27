import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Github, Linkedin } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · Sanningskompassen" },
      { name: "description", content: "The five-person team behind Sanningskompassen, built at Järvaveckan 2026 as Team 4." },
    ],
  }),
  component: AboutPage,
});

const TEAM = [
  {
    name: "Jady Pamella",
    role: "AI Engineer",
    photo: "/team/jady.png",
    linkedin: "https://linkedin.com/in/jadypamella",
    github: "https://github.com/jadypamella",
  },
  {
    name: "Li Walter de Perlét",
    role: "Public Sector Consultant",
    photo: "/team/li.png",
    linkedin: "https://linkedin.com/in/li-walter-de-perlét-b31294200/",
    github: null,
  },
  {
    name: "Jakub Piniaha",
    role: "Statistics Student",
    photo: "/team/jakub.png",
    linkedin: "https://linkedin.com/in/jakub-piniaha-86a6a3295",
    github: "https://github.com/jadypamella/sanningskompassen.git",
  },
  {
    name: "Agnes Cohen",
    role: "Risk Analysis Consultant, PwC",
    photo: "/team/agnes.png",
    linkedin: "https://linkedin.com/in/agnes-cohen-b63816300/",
    github: null,
  },
  {
    name: "Hossam Elshahaby",
    role: "SW Engineer",
    photo: "/team/hossam.png",
    linkedin: "https://linkedin.com/in/helshahaby",
    github: null,
  },
];


function AboutPage() {
  const { t } = useT();
  return (
    <AppShell>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="text-xs uppercase tracking-[4px] text-gold font-semibold mb-2">{t("about.kicker")}</div>
        <h1 className="font-display font-extrabold text-navy text-4xl md:text-5xl mb-4">{t("about.h")}</h1>
        <p className="text-muted-foreground max-w-3xl">{t("about.p")}</p>

        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {TEAM.map((m) => (
            <div key={m.name} className="w-full sm:w-[300px] rounded-xl border border-border bg-background p-6 text-center">
              <div className="mx-auto mb-4 h-[120px] w-[120px] rounded-full p-[3px] bg-gold">
                <div className="h-full w-full rounded-full bg-navy overflow-hidden border-2 border-paper">
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
              <h3 className="font-display font-extrabold text-navy text-lg">{m.name}</h3>
              <div className="text-[10px] uppercase tracking-[1.5px] text-gold font-semibold mt-1">{m.role}</div>
              <div className="mt-3 flex items-center justify-center gap-3">
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${m.name} on LinkedIn`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-navy transition"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                {m.github && (
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on GitHub`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-navy transition"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-paper border border-border p-6 text-sm text-muted-foreground">
          {t("about.note")}
        </div>
      </section>
    </AppShell>
  );
}
