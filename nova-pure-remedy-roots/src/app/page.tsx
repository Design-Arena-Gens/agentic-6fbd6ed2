import { AgentConsole } from "@/components/AgentConsole";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-20 md:pt-28">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-slate-900 p-10 shadow-[0_0_120px_rgba(0,0,0,0.45)]">
        <div className="relative z-10 max-w-3xl space-y-6">
          <p className="text-xs uppercase tracking-[0.6em] text-emerald-200/80">
            Nova Pure Herbal · Remedy Roots
          </p>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">
            Multi-Agent Herbal Intelligence for Modern Rituals
          </h1>
          <p className="text-base text-emerald-50/90 md:text-lg">
            Harmonize ancient plant lineages with adaptive AI. Our four-agent
            ecosystem co-creates wellness formulas, cultural storytelling,
            marketing campaigns, and community resonance anchored in #MyRemedyRoots.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              Herbalist · Educator · Marketer · Community
            </span>
            <span className="rounded-full border border-emerald-300/40 bg-emerald-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-50">
              Knowledge Graph Orchestrated
            </span>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 hidden w-1/2 items-center justify-center md:flex">
          <div className="h-64 w-64 rounded-full bg-gradient-to-br from-emerald-200/30 via-teal-200/10 to-transparent blur-3xl" />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Herbalist Agent",
            body: "Personalizes plant allies across traditions with safety checks, energetics, and ritual integrations.",
          },
          {
            title: "Educator Agent",
            body: "Infuses curricula with origin stories, ceremonial practices, and cross-cultural bridges.",
          },
          {
            title: "Marketer & Community Agents",
            body: "Designs vibrant campaigns, content calendars, and #MyRemedyRoots engagement loops in sync.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-inner"
          >
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.body}</p>
          </div>
        ))}
      </section>

      <AgentConsole />

      <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white">
          Herbal Knowledge Substrate
        </h2>
        <p className="max-w-3xl text-sm text-slate-300 md:text-base">
          Moringa, Ashwagandha, Turmeric, Hibiscus, Ginger, Reishi, Baobab, and
          Burdock Root form the foundational graph. Nodes track traditions,
          energetics, body systems, and synergistic blends, powering each agent’s
          decision-making.
        </p>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            {
              label: "Traditions harmonized",
              value: "African · Ayurvedic · TCM",
            },
            { label: "Graph nodes", value: "40+" },
            { label: "Synergy pathways", value: "12" },
            { label: "Community tag", value: "#MyRemedyRoots" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {stat.label}
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
