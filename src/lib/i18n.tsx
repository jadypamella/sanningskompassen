import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "sv";

type Dict = Record<string, string>;

const EN: Dict = {
  // Nav / chrome
  "brand.tagline": "The Truth Compass",
  "nav.quickScan": "Quick Scan",
  "nav.vaccine": "Vaccine",
  "nav.swipeArena": "Swipe Arena",
  "nav.research": "Research",
  "nav.theCrew": "The Crew",
  "nav.language": "Language",
  "menu.open": "Open menu",
  "menu.close": "Close menu",

  // Footer
  "footer.about":
    "The vaccine against political disinformation. Paste any claim, see the trick behind it, and train your eye to spot the next lie on your own. Built for young voters in Järva.",
  "footer.team": "Team 4",
  "footer.event": "Järvaveckan 2026",
  "footer.challenge": "Challenge 2",
  "footer.playModes": "Play Modes",
  "footer.learn": "Learn",
  "footer.connect": "Connect",
  "footer.howToVote": "How To Vote",
  "footer.sourceGithub": "Source On GitHub",
  "footer.cambridgeStudy": "Cambridge Study",
  "footer.tacticsLabel": "The 5 Tactics We Label",
  "footer.tactic.clickbait": "Clickbait",
  "footer.tactic.falseAuthority": "False Authority",
  "footer.tactic.emotionBait": "Emotion Bait",
  "footer.tactic.polarisation": "Polarisation",
  "footer.tactic.fakeExpert": "Fake Expert",
  "footer.copyright": "© 2026 Sanningskompassen. Built at Järvaveckan Hackathon on Lovable.",

  // Index / landing
  "index.eventLine": "Järvaveckan · 2026 · Challenge 2",
  "index.h1": "Paste Any Political Claim. See The Trick Behind It.",
  "index.lead.before": "You know valkompassen. This is the compass for what is true. Every check earns you XP toward the",
  "index.lead.badge": " Truth Hunter",
  "index.lead.after": " badge, and shows you the playbook the lie used.",
  "index.placeholder":
    "Paste a headline, a TikTok caption, a friend's message. We will show you what is true, what is uncertain, what is false, and which tactics it used to deceive.",
  "index.tooShort": "Add at least 10 characters.",
  "index.chars": "{count} / 1000 characters",
  "index.loading.0": "Analysing the claim...",
  "index.loading.1": "Scanning for the 5 tactics...",
  "index.loading.2": "Building your X-ray...",
  "index.cta.scan": "Run Quick Scan",
  "index.cta.swipe": "Or Enter The Swipe Arena",
  "index.error": "Something went wrong. Try again.",
  "index.starterQuests": "Starter Quests · Tap To Load",
  "index.whyItWorks": "Why It Works",
  "index.whyHeadline":
    "Every Check Shows You The Verdict AND The Trick. After 3 Checks, You Do Not Need Us Anymore.",
  "index.feature1.h": "Tactics Labelled In Real Claims",
  "index.feature1.p":
    "Paste anything. We highlight which of 5 manipulation tactics it used and how.",
  "index.feature2.h": "Cambridge Inoculation Research",
  "index.feature2.p":
    "Roozenbeek and van der Linden (2019, 2022) show that seeing the playbook builds lasting resistance.",
  "index.feature3.p":
    "This Is Passive Inoculation. You Build Resistance By Seeing The Playbook Labelled Inside Every Check.",
  "index.modes.kicker": "Choose Your Mode",
  "index.modes.h": "Three Ways To Train Your Eye.",
  "index.modes.sub": "Earn XP. Unlock badges. Become a Truth Hunter.",
  "index.modes.quick.kicker": "Quick Mode",
  "index.modes.quick.h": "Quick Scan",
  "index.modes.quick.p": "2 Seconds. Verdict + Tactic X-Ray.",
  "index.modes.quick.cta": "Start scan →",
  "index.modes.arena.kicker": "Arena Mode",
  "index.modes.arena.h": "Swipe Arena",
  "index.modes.arena.p": "Swipe 10 Cards. Fact Or Fake. Earn The Sharp Eye Badge.",
  "index.modes.arena.cta": "Enter arena →",
  "index.modes.boss.kicker": "Boss Mode",
  "index.modes.boss.h": "Vaccine",
  "index.modes.boss.p": "Build A Fake Yourself In 5 Guided Steps. Final Boss Of Inoculation.",
  "index.modes.boss.cta": "Take the challenge →",

  // Spot / Swipe Arena
  "spot.intro.kicker": "Arena Mode · Lvl 1 · +50 XP",
  "spot.intro.h": "Swipe Arena: 10 Cards. Fact Or Fake.",
  "spot.intro.p.before": "Swipe Right For Fact, Left For Fake. Score 8+ to unlock the ",
  "spot.intro.p.badge": "Sharp Eye",
  "spot.intro.p.after": " badge.",
  "spot.intro.cta": "Enter The Arena",
  "spot.card.you_right": "You got this right",
  "spot.card.caught": "Caught you",
  "spot.card.see_results": "See results",
  "spot.card.next": "Next card",
  "spot.swipe.fake": "Fake",
  "spot.swipe.fact": "Fact",
  "spot.swipe.card_of": "Card {i} of {total} · swipe or tap",
  "spot.results.kicker": "Your Score",
  "spot.results.xp": "+{xp} XP Earned",
  "spot.results.breakdown": "Tactic Breakdown",
  "spot.results.spottedFooled": "Spotted {spotted} · Fooled {missed}",
  "spot.results.replay": "Replay Arena",
  "spot.results.toVaccine": "Enter The Vaccine →",
  "spot.results.secondaryQuick": "Run A Quick Scan",
  "spot.badge.truthHunter": "Truth Hunter",
  "spot.badge.sharpEye": "Sharp Eye",
  "spot.badge.rising": "Rising Recruit",
  "spot.badge.apprentice": "Apprentice",
  "spot.badge.caught": "Caught By The Lie",

  // Workshop / Vaccine
  "workshop.step0.kicker": "Step 1",
  "workshop.step0.h": "Pick your topic.",
  "workshop.step0.p": "Choose what you will write your fake story about.",
  "workshop.step0.loading": "Loading topics...",
  "workshop.step0.empty": "No topics available right now. Refresh the page.",
  "workshop.step0.recommended": "Recommended for first try",
  "workshop.step0.start": "Start",
  "workshop.submitting.tagline": "Hold on, the vaccine is forming.",
  "workshop.loading.0": "Analysing your tactics...",
  "workshop.loading.1": "Mixing the vaccine...",
  "workshop.loading.2": "Spotting your tricks...",
  "workshop.loading.3": "Reading between your lines...",
  "workshop.error":
    "Something went wrong while analysing your story. Try again, or pick a different topic.",
  "workshop.tryAgain": "Try again",
  "workshop.pickAnother": "Pick another topic",
  "workshop.tacticOf": "Tactic {step} of 5",
  "workshop.minChars": "Minimum 5 characters.",
  "workshop.back": "Back",
  "workshop.next": "Next tactic",
  "workshop.submit": "Submit and see the X-ray",
  "workshop.topicLabel": "Your topic",
  "workshop.changeTopic": "Change topic",


  // Result (check)
  "result.notFound": "That check was not found.",
  "result.loading": "Loading your X-ray...",
  "result.crumb.home": "Home",
  "result.crumb.your": "Your check",
  "result.claim": "The claim",
  "result.tacticsTitle": "Tactics used in this claim",
  "result.checksToday": "Checks completed today: {n}",
  "result.cta.spot": "Want to test your nose? Try the Spot game.",
  "result.cta.workshop": "Want to see how a fake is built? Try writing one yourself.",
  "result.confidence": "Confidence: {value}",
  "result.verdict.TRUE": "TRUE",
  "result.verdict.UNCERTAIN": "UNCERTAIN",
  "result.verdict.FALSE": "FALSE",

  // Result (run)
  "run.loading": "Loading your X-ray...",
  "run.notFound": "That session was not found. Returning home...",
  "run.crumb.workshop": "Vaccine",
  "run.crumb.your": "Your X-ray",
  "run.score.kicker": "Manipulation Score",
  "run.score.before": "Your fake would fool ",
  "run.score.after": " readers.",
  "run.band.high": "many",
  "run.band.medium": "some",
  "run.band.low": "few",
  "run.detected": "Detected",
  "run.missed": "Missed",
  "run.spotIt": "Spot it in the wild:",
  "run.badge.unlocked": "Badge unlocked",
  "run.cta.h": "You can now spot 5 manipulation tactics.",
  "run.cta.p": "Use them to navigate the next weeks of election news. Then vote.",
  "run.cta.polling": "How to vote",
  "run.cta.another": "Try another topic",
  "run.readResearch": "Read the research behind this",
  "run.workshopsToday": "Vaccines completed today:",

  // ClosingCTA
  "closing.h":
    "You can now spot 5 manipulation tactics. Use them to navigate the next weeks of election news. Then vote.",
  "closing.polling": "How to vote",
  "closing.checkAnother": "Check another claim",
  "closing.runQuick": "Run A Quick Scan",

  // Milestone
  "milestone.h": "The compass is yours now.",
  "milestone.p":
    "You spotted 5 manipulation tactics across 3 claims. From here, you do not need this app to see the next one.",

  // About
  "about.kicker": "About",
  "about.h": "Built by five people who picked the harder direction.",
  "about.p":
    "We built Sanningskompassen at the Järvaveckan Hackathon on May 27, 2026, as Team 4 for Challenge 2, countering disinformation. Instead of building yet another fact-checker, we built the vaccine. The mechanic is based on inoculation research from Cambridge (Roozenbeek and van der Linden).",
  "about.note":
    "Built at Järvaveckan Hackathon 2026 as Team 4, on Lovable. Riso Resistance brand by the team. Tactic taxonomy adapted from Bad News (DROG and Cambridge). Inoculation logic based on Roozenbeek and van der Linden, 2019 and 2022.",

  // Research
  "research.kicker": "Research",
  "research.h": "Why writing fakes makes you spot them.",
  "research.p1":
    "Inoculation theory is the idea that exposure to a weakened version of a manipulation builds mental antibodies against the real thing. The same way a vaccine works for the body, a guided practice with the tactics of misinformation works for the brain.",
  "research.p2":
    "Sanningskompassen turns that theory into a five-minute vaccine. By writing fake political content with your own hands, you internalise the shape of clickbait, false authority, displaced images, fear hooks, and us-vs-them framing. Once you have built one, you cannot un-see it on your feed.",
  "research.openSource": "Open source",
  "research.note":
    "The same logic powers anti-phishing training in cybersecurity. Sending employees a controlled fake phish measurably improves their ability to spot real ones. Sanningskompassen applies that pattern to political information.",
  "research.footer":
    "Sanningskompassen is built for the Järvaveckan Hackathon 2026. The tactic taxonomy is adapted from the Bad News game (DROG and Cambridge).",
};

const SV: Dict = {
  // Nav / chrome
  "brand.tagline": "Vaccinet mot desinformation",
  "nav.quickScan": "Snabbskanning",
  "nav.vaccine": "Vaccin",
  "nav.swipeArena": "Svep-arenan",
  "nav.research": "Forskning",
  "nav.theCrew": "Teamet",
  "nav.language": "Språk",
  "menu.open": "Öppna meny",
  "menu.close": "Stäng meny",

  // Footer
  "footer.about":
    "Vaccinet mot politisk desinformation. Klistra in vilket påstående som helst, se tricket bakom, och träna ditt öga att upptäcka nästa lögn på egen hand. Byggt för unga väljare i Järva.",
  "footer.team": "Team 4",
  "footer.event": "Järvaveckan 2026",
  "footer.challenge": "Utmaning 2",
  "footer.playModes": "Spellägen",
  "footer.learn": "Lär dig",
  "footer.connect": "Kontakt",
  "footer.howToVote": "Så röstar du",
  "footer.sourceGithub": "Källkod på GitHub",
  "footer.cambridgeStudy": "Cambridge-studien",
  "footer.tacticsLabel": "De 5 taktikerna vi märker upp",
  "footer.tactic.clickbait": "Klickbete",
  "footer.tactic.falseAuthority": "Falsk auktoritet",
  "footer.tactic.emotionBait": "Känslobete",
  "footer.tactic.polarisation": "Polarisering",
  "footer.tactic.fakeExpert": "Falsk expert",
  "footer.copyright": "© 2026 Sanningskompassen. Byggt på Järvaveckans hackathon med Lovable.",

  // Index / landing
  "index.eventLine": "Järvaveckan · 2026 · Utmaning 2",
  "index.h1": "Klistra in vilket politiskt påstående som helst. Se tricket bakom.",
  "index.lead.before":
    "Du känner till valkompassen. Det här är kompassen för vad som är sant. Varje koll ger dig XP mot",
  "index.lead.badge": " Sanningsjägaren",
  "index.lead.after": "-märket, och visar dig spelboken lögnen använde.",
  "index.placeholder":
    "Klistra in en rubrik, en TikTok-text, ett meddelande från en vän. Vi visar vad som är sant, osäkert eller falskt, och vilka taktiker som användes för att vilseleda.",
  "index.tooShort": "Lägg till minst 10 tecken.",
  "index.chars": "{count} / 1000 tecken",
  "index.loading.0": "Analyserar påståendet...",
  "index.loading.1": "Söker efter de 5 taktikerna...",
  "index.loading.2": "Bygger din röntgenbild...",
  "index.cta.scan": "Kör snabbskanning",
  "index.cta.swipe": "Eller gå till svep-arenan",
  "index.error": "Något gick fel. Försök igen.",
  "index.starterQuests": "Startuppdrag · Tryck för att ladda",
  "index.whyItWorks": "Varför det fungerar",
  "index.whyHeadline":
    "Varje koll visar både domen OCH tricket. Efter 3 koller behöver du inte oss längre.",
  "index.feature1.h": "Taktiker märkta i riktiga påståenden",
  "index.feature1.p":
    "Klistra in vad som helst. Vi lyfter fram vilka av de 5 manipulationstaktikerna som användes och hur.",
  "index.feature2.h": "Cambridge-forskning om inokulering",
  "index.feature2.p":
    "Roozenbeek och van der Linden (2019, 2022) visar att om man ser spelboken bygger man långvarig motståndskraft.",
  "index.feature3.p":
    "Det här är passiv inokulering. Du bygger motståndskraft genom att se spelboken etiketterad inuti varje koll.",
  "index.modes.kicker": "Välj ditt läge",
  "index.modes.h": "Tre sätt att träna ögat.",
  "index.modes.sub": "Tjäna XP. Lås upp märken. Bli en sanningsjägare.",
  "index.modes.quick.kicker": "Snabbläge",
  "index.modes.quick.h": "Snabbskanning",
  "index.modes.quick.p": "2 sekunder. Dom + taktikröntgen.",
  "index.modes.quick.cta": "Starta skanning →",
  "index.modes.arena.kicker": "Arenaläge",
  "index.modes.arena.h": "Svep-arenan",
  "index.modes.arena.p": "Svep 10 kort. Fakta eller fejk. Vinn märket Skarpt öga.",
  "index.modes.arena.cta": "Gå till arenan →",
  "index.modes.boss.kicker": "Bossläge",
  "index.modes.boss.h": "Vaccin",
  "index.modes.boss.p": "Bygg en fejk själv i 5 vägledda steg. Inokuleringens slutboss.",
  "index.modes.boss.cta": "Anta utmaningen →",

  // Spot
  "spot.intro.kicker": "Arenaläge · Nivå 1 · +50 XP",
  "spot.intro.h": "Svep-arenan: 10 kort. Fakta eller fejk.",
  "spot.intro.p.before": "Svep höger för Fakta, vänster för Fejk. Få 8+ rätt för att låsa upp ",
  "spot.intro.p.badge": "Skarpt öga",
  "spot.intro.p.after": "-märket.",
  "spot.intro.cta": "Gå in i arenan",
  "spot.card.you_right": "Du hade rätt",
  "spot.card.caught": "Du gick på det",
  "spot.card.see_results": "Se resultat",
  "spot.card.next": "Nästa kort",
  "spot.swipe.fake": "Fejk",
  "spot.swipe.fact": "Fakta",
  "spot.swipe.card_of": "Kort {i} av {total} · svep eller tryck",
  "spot.results.kicker": "Ditt resultat",
  "spot.results.xp": "+{xp} XP intjänat",
  "spot.results.breakdown": "Taktiköversikt",
  "spot.results.spottedFooled": "Upptäckta {spotted} · Lurad {missed}",
  "spot.results.replay": "Spela arenan igen",
  "spot.results.toVaccine": "Till vaccinet →",
  "spot.results.secondaryQuick": "Kör en snabbskanning",
  "spot.badge.truthHunter": "Sanningsjägare",
  "spot.badge.sharpEye": "Skarpt öga",
  "spot.badge.rising": "Lovande rekryt",
  "spot.badge.apprentice": "Lärling",
  "spot.badge.caught": "Lurad av lögnen",

  // Workshop
  "workshop.step0.kicker": "Steg 1",
  "workshop.step0.h": "Välj ditt ämne.",
  "workshop.step0.p": "Välj vad du ska skriva din fejkberättelse om.",
  "workshop.step0.loading": "Laddar ämnen...",
  "workshop.step0.empty": "Inga ämnen tillgängliga just nu. Ladda om sidan.",
  "workshop.step0.recommended": "Rekommenderas för första försöket",
  "workshop.step0.start": "Starta",
  "workshop.submitting.tagline": "Vänta lite, vaccinet bildas.",
  "workshop.loading.0": "Analyserar dina taktiker...",
  "workshop.loading.1": "Blandar vaccinet...",
  "workshop.loading.2": "Hittar dina trick...",
  "workshop.loading.3": "Läser mellan dina rader...",
  "workshop.error":
    "Något gick fel när din berättelse skulle analyseras. Försök igen eller välj ett annat ämne.",
  "workshop.tryAgain": "Försök igen",
  "workshop.pickAnother": "Välj ett annat ämne",
  "workshop.tacticOf": "Taktik {step} av 5",
  "workshop.minChars": "Minst 5 tecken.",
  "workshop.back": "Tillbaka",
  "workshop.next": "Nästa taktik",
  "workshop.submit": "Skicka och se röntgenbilden",
  "workshop.topicLabel": "Ditt ämne",
  "workshop.changeTopic": "Byt ämne",


  // Result (check)
  "result.notFound": "Den kollen hittades inte.",
  "result.loading": "Laddar din röntgenbild...",
  "result.crumb.home": "Hem",
  "result.crumb.your": "Din koll",
  "result.claim": "Påståendet",
  "result.tacticsTitle": "Taktiker som använts i påståendet",
  "result.checksToday": "Koller idag: {n}",
  "result.cta.spot": "Vill du testa luktsinnet? Prova svepspelet.",
  "result.cta.workshop": "Vill du se hur en fejk byggs? Skriv en själv.",
  "result.confidence": "Säkerhet: {value}",
  "result.verdict.TRUE": "SANT",
  "result.verdict.UNCERTAIN": "OSÄKERT",
  "result.verdict.FALSE": "FALSKT",

  // Result (run)
  "run.loading": "Laddar din röntgenbild...",
  "run.notFound": "Den sessionen hittades inte. Återvänder hem...",
  "run.crumb.workshop": "Vaccin",
  "run.crumb.your": "Din röntgenbild",
  "run.score.kicker": "Manipulationspoäng",
  "run.score.before": "Din fejk skulle lura ",
  "run.score.after": " läsare.",
  "run.band.high": "många",
  "run.band.medium": "några",
  "run.band.low": "få",
  "run.detected": "Upptäckt",
  "run.missed": "Missad",
  "run.spotIt": "Så känner du igen den i vilt tillstånd:",
  "run.badge.unlocked": "Märke upplåst",
  "run.cta.h": "Du kan nu upptäcka 5 manipulationstaktiker.",
  "run.cta.p": "Använd dem för att navigera de kommande veckornas valnyheter. Sedan röstar du.",
  "run.cta.polling": "Så röstar du",
  "run.cta.another": "Prova ett annat ämne",
  "run.readResearch": "Läs forskningen bakom",
  "run.workshopsToday": "Vacciner idag:",

  // ClosingCTA
  "closing.h":
    "Du kan nu upptäcka 5 manipulationstaktiker. Använd dem för att navigera de kommande veckornas valnyheter. Sedan röstar du.",
  "closing.polling": "Så röstar du",
  "closing.checkAnother": "Kolla ett annat påstående",
  "closing.runQuick": "Kör en snabbskanning",

  // Milestone
  "milestone.h": "Kompassen är din nu.",
  "milestone.p":
    "Du upptäckte 5 manipulationstaktiker i 3 påståenden. Härifrån behöver du inte den här appen för att se nästa.",

  // About
  "about.kicker": "Om oss",
  "about.h": "Byggt av fem personer som valde den svårare vägen.",
  "about.p":
    "Vi byggde Sanningskompassen på Järvaveckans hackathon den 27 maj 2026, som Team 4 för Utmaning 2, att motverka desinformation. Istället för att bygga ännu en faktagranskare byggde vi vaccinet. Mekaniken bygger på inokuleringsforskning från Cambridge (Roozenbeek och van der Linden).",
  "about.note":
    "Byggt på Järvaveckans hackathon 2026 som Team 4, på Lovable. Riso Resistance-varumärket av teamet. Taktiktaxonomin är anpassad från Bad News (DROG och Cambridge). Inokuleringslogiken baseras på Roozenbeek och van der Linden, 2019 och 2022.",

  // Research
  "research.kicker": "Forskning",
  "research.h": "Varför man upptäcker fejk genom att skriva fejk.",
  "research.p1":
    "Inokuleringsteorin går ut på att exponering för en försvagad version av en manipulation bygger mentala antikroppar mot den riktiga varan. På samma sätt som ett vaccin fungerar för kroppen fungerar guidad övning med desinformationstaktiker för hjärnan.",
  "research.p2":
    "Sanningskompassen omvandlar den teorin till ett femminutersvaccin. Genom att med egna händer skriva falskt politiskt innehåll internaliserar du formen hos klickbete, falsk auktoritet, förflyttade bilder, rädslokrokar och vi-mot-dem-ramar. När du har byggt en kan du inte avse den i ditt flöde.",
  "research.openSource": "Öppen källa",
  "research.note":
    "Samma logik driver anti-phishing-träning inom cybersäkerhet. Att skicka kontrollerade fejk-phishingmejl till anställda förbättrar mätbart deras förmåga att upptäcka riktiga. Sanningskompassen tillämpar samma mönster på politisk information.",
  "research.footer":
    "Sanningskompassen byggs för Järvaveckans hackathon 2026. Taktiktaxonomin är anpassad från spelet Bad News (DROG och Cambridge).",
};

const DICTS: Record<Lang, Dict> = { en: EN, sv: SV };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "sk:lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "sv") {
        setLangState(stored);
        return;
      }
      const nav = (typeof navigator !== "undefined" && navigator.language) || "";
      if (nav.toLowerCase().startsWith("sv")) setLangState("sv");
    } catch {
      // ignore
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }

  function t(key: string, vars?: Record<string, string | number>) {
    const dict = DICTS[lang];
    let s = dict[key] ?? EN[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replaceAll(`{${k}}`, String(v));
      }
    }
    return s;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Safe fallback if used outside provider (e.g. error pages)
    return {
      lang: "en" as Lang,
      setLang: () => {},
      t: (key: string, vars?: Record<string, string | number>) => {
        let s = EN[key] ?? key;
        if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
        return s;
      },
    } satisfies Ctx;
  }
  return ctx;
}
