import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Github, Linkedin, Mail } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · Sanningskompassen" },
      { name: "description", content: "The five-person team behind Sanningskompassen, built at Järvaveckan 2026." },
    ],
  }),
  component: AboutPage,
});

const TEAM = [
  {
    name: "Jady Pamella",
    role: "AI Engineer",
    photo: "/team/jady.png",
    email: "jadypbs@gmail.com",
    linkedin: "https://linkedin.com/in/jadypamella",
    github: "https://github.com/jadypamella",
  },
  {
    name: "Hossam Elshahaby",
    role: "SW Engineer",
    photo: "/team/hossam.png",
    email: "hossam.a.elshahaby@gmail.com",
    linkedin: "https://linkedin.com/in/helshahaby",
    github: null,
  },
  {
    name: "Li Walter de Perlét",
    role: "Public Sector Consultant",
    photo: "/team/li.png",
    email: "li@wdp.se",
    linkedin: "https://linkedin.com/in/li-walter-de-perlét-b31294200/",
    github: null,
  },
  {
    name: "Jakub Piniaha",
    role: "Student",
    photo: "/team/jakub.png",
    email: "piniahajakub@gmail.com",
    linkedin: "https://linkedin.com/in/jakub-piniaha-86a6a3295",
    github: "https://github.com/Jakubs-Hackathons",
  },
  {
    name: "Agnes Cohen",
    role: "Risk Analysis Consultant, PwC",
    photo: "/team/agnes.png",
    email: "agnes.cohen@telia.com",
    linkedin: "https://linkedin.com/in/agnes-cohen-b63816300/",
    github: null,
  },
];

function AboutPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="text-xs uppercase tracking-[4px] text-gold font-semibold mb-2">About</div>
        <h1 className="font-display font-extrabold text-navy text-4xl md:text-5xl mb-4">
          Built by five people who picked the harder direction.
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          We built Sanningskompassen at the Järvaveckan Hackathon on May 27, 2026, for Challenge 2, countering
          disinformation. Instead of building yet another fact-checker, we built the vaccine. The mechanic is based on
          inoculation research from Cambridge (Roozenbeek and van der Linden).
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <div key={m.name} className="rounded-xl border border-border bg-background p-6 text-center">
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
              <div className="mt-3 flex items-center justify-center gap-3 text-xs">
                <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 text-muted-foreground hover:text-gold">
                  <Mail className="h-3 w-3" /> {m.email}
                </a>
              </div>
              <div className="mt-2 flex items-center justify-center gap-3 text-xs">
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gold underline decoration-gold underline-offset-4"
                >
                  <Linkedin className="h-3 w-3" /> in
                </a>
                {m.github && (
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gold underline decoration-gold underline-offset-4"
                  >
                    <Github className="h-3 w-3" /> gh
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-paper border border-border p-6 text-sm text-muted-foreground">
          Built at Järvaveckan Hackathon 2026, on Lovable. Riso Resistance brand by the team. Tactic taxonomy adapted
          from Bad News (DROG and Cambridge). Inoculation logic based on Roozenbeek and van der Linden, 2019 and 2022.
        </div>
      </section>
    </AppShell>
  );
}
