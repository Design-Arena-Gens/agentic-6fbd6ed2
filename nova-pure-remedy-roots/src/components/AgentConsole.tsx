"use client";

import { useMemo, useState } from "react";
import { AgentId, AgentResponse } from "@/lib/agents";
import { herbs } from "@/data/herbs";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";

type AgentHistoryItem = {
  agentId: AgentId;
  response: AgentResponse;
  timestamp: string;
};

type HerbalistForm = {
  symptoms: string;
  constitution: string;
  sensitivities: string;
  preferredPreparations: string;
};

type EducatorForm = {
  herbs: string[];
};

type MarketerForm = {
  focus: string;
  platforms: string[];
  tone: string;
};

type CommunityForm = {
  theme: string;
  recentHighlights: string;
};

type FormState = {
  herbalist: HerbalistForm;
  educator: EducatorForm;
  marketer: MarketerForm;
  community: CommunityForm;
};

const agentDefinitions: Record<
  AgentId,
  {
    label: string;
    accent: string;
    description: string;
    gradient: string;
  }
> = {
  herbalist: {
    label: "Herbalist",
    accent: "text-emerald-300",
    gradient: "from-emerald-400/40 to-teal-400/10",
    description:
      "Personalized wellness guidance weaving African, Ayurvedic, and TCM herbalism.",
  },
  educator: {
    label: "Educator",
    accent: "text-sky-300",
    gradient: "from-sky-400/40 to-indigo-500/10",
    description:
      "Story-led curriculum sharing herb histories, ceremonies, and cross-cultural wisdom.",
  },
  marketer: {
    label: "Marketer",
    accent: "text-amber-300",
    gradient: "from-amber-400/40 to-rose-400/10",
    description:
      "Campaign architect producing captions, hashtags, image prompts, and calendars.",
  },
  community: {
    label: "Community",
    accent: "text-fuchsia-300",
    gradient: "from-fuchsia-400/40 to-purple-500/10",
    description:
      "Engagement strategist nurturing #MyRemedyRoots memories and response loops.",
  },
};

const defaultState: FormState = {
  herbalist: {
    symptoms:
      "fatigue, low mood, skin dryness, craving grounding rituals, seasonal immune dips",
    constitution: "Vata",
    sensitivities: "pregnancy, thyroid medication",
    preferredPreparations: "infusion, powder, culinary",
  },
  educator: {
    herbs: ["moringa", "ashwagandha", "hibiscus"],
  },
  marketer: {
    focus: "radiant immunity reset",
    platforms: ["Instagram", "TikTok", "Facebook"],
    tone: "vivid, roots-forward, celebratory",
  },
  community: {
    theme: "share the ritual that keeps your lineage close",
    recentHighlights:
      "Auntie Ama brewing hibiscus-moringa sun tea for family brunch; TikTok duet remixing turmeric milk ceremony.",
  },
};

export function AgentConsole() {
  const [activeAgent, setActiveAgent] = useState<AgentId>("herbalist");
  const [formState, setFormState] = useState<FormState>(
    () => JSON.parse(JSON.stringify(defaultState)) as FormState,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [history, setHistory] = useState<AgentHistoryItem[]>([]);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<string | null>(null);

  const activeDefinition = agentDefinitions[activeAgent];

  const highlightedHerbs = useMemo(() => {
    if (!response?.graph) return [];
    return response.graph.nodes
      .filter((node) => node.group === "herb-highlight")
      .map((node) => node.id);
  }, [response]);

  const handleChange = (field: string, value: string | string[]) => {
    setFormState((prev) => ({
      ...prev,
      [activeAgent]: {
        ...prev[activeAgent],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setSelectedNodeInfo(null);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: activeAgent,
          input: formState[activeAgent],
        }),
      });

      if (!res.ok) {
        throw new Error(`Agent request failed with status ${res.status}`);
      }

      const payload: AgentResponse = await res.json();
      setResponse(payload);
      setHistory((prev) => [
        {
          agentId: activeAgent,
          response: payload,
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 7),
      ]);
    } catch (error) {
      console.error(error);
      setResponse({
        title: "Agent unavailable",
        content:
          "The orchestrator paused. Please refresh or retry with refined inputs.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderHerbalistForm = () => (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-200">
        Symptom Story
        <textarea
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
          rows={4}
          value={formState.herbalist.symptoms}
          onChange={(event) => handleChange("symptoms", event.target.value)}
        />
      </label>
      <label className="block text-sm font-medium text-slate-200">
        Constitution Focus
        <select
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
          value={formState.herbalist.constitution}
          onChange={(event) => handleChange("constitution", event.target.value)}
        >
          <option value="">Select constitution</option>
          <option value="Vata">Vata</option>
          <option value="Pitta">Pitta</option>
          <option value="Kapha">Kapha</option>
          <option value="Hot">Hot (TCM)</option>
          <option value="Cold">Cold (TCM)</option>
          <option value="Damp">Damp (TCM)</option>
          <option value="Dry">Dry (TCM)</option>
        </select>
      </label>
      <label className="block text-sm font-medium text-slate-200">
        Sensitivities or Medications
        <input
          type="text"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
          placeholder="pregnancy, blood thinners, etc."
          value={formState.herbalist.sensitivities}
          onChange={(event) => handleChange("sensitivities", event.target.value)}
        />
      </label>
      <label className="block text-sm font-medium text-slate-200">
        Preferred Preparations
        <input
          type="text"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
          placeholder="infusion, decoction, culinary..."
          value={formState.herbalist.preferredPreparations}
          onChange={(event) =>
            handleChange("preferredPreparations", event.target.value)
          }
        />
      </label>
    </div>
  );

  const renderEducatorForm = () => {
    const selectedIds = new Set(formState.educator.herbs);

    const toggleHerb = (id: string) => {
      const next = new Set(selectedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      handleChange("herbs", Array.from(next));
    };

    return (
      <div className="space-y-4">
        <span className="block text-sm font-medium text-slate-200">
          Select up to 5 herbs to spotlight
        </span>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {herbs.map((herb) => (
            <button
              key={herb.id}
              type="button"
              onClick={() => toggleHerb(herb.id)}
              className={`rounded-xl border p-3 text-left text-sm transition ${
                selectedIds.has(herb.id)
                  ? "border-sky-400/80 bg-sky-400/10 text-sky-100"
                  : "border-white/10 bg-black/20 text-slate-200 hover:border-sky-400/40"
              }`}
            >
              <span className="font-semibold">{herb.name}</span>
              <p className="mt-1 text-xs text-slate-400">
                {herb.traditions.join(" • ")}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderMarketerForm = () => (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-200">
        Campaign Focus
        <input
          type="text"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
          value={formState.marketer.focus}
          onChange={(event) => handleChange("focus", event.target.value)}
        />
      </label>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-200">
          Platforms
        </legend>
        <div className="flex flex-wrap gap-2">
          {["Instagram", "TikTok", "Facebook", "Pinterest", "YouTube Shorts"].map(
            (platform) => {
              const platforms = new Set(formState.marketer.platforms);
              const isSelected = platforms.has(platform);
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      platforms.delete(platform);
                    } else {
                      platforms.add(platform);
                    }
                    handleChange("platforms", Array.from(platforms));
                  }}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    isSelected
                      ? "border-amber-300/80 bg-amber-400/10 text-amber-100"
                      : "border-white/10 bg-black/20 text-slate-200 hover:border-amber-300/50"
                  }`}
                >
                  {platform}
                </button>
              );
            },
          )}
        </div>
      </fieldset>
      <label className="block text-sm font-medium text-slate-200">
        Tone or Mood
        <input
          type="text"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
          value={formState.marketer.tone}
          onChange={(event) => handleChange("tone", event.target.value)}
        />
      </label>
    </div>
  );

  const renderCommunityForm = () => (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-200">
        Engagement Theme or Prompt
        <textarea
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
          rows={3}
          value={formState.community.theme}
          onChange={(event) => handleChange("theme", event.target.value)}
        />
      </label>
      <label className="block text-sm font-medium text-slate-200">
        Recent Highlights to Amplify
        <textarea
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
          rows={3}
          value={formState.community.recentHighlights}
          onChange={(event) =>
            handleChange("recentHighlights", event.target.value)
          }
        />
      </label>
    </div>
  );

  const activeForm = (() => {
    switch (activeAgent) {
      case "herbalist":
        return renderHerbalistForm();
      case "educator":
        return renderEducatorForm();
      case "marketer":
        return renderMarketerForm();
      case "community":
        return renderCommunityForm();
      default:
        return null;
    }
  })();

  return (
    <section className="space-y-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className={`text-xs uppercase tracking-[0.6em] text-slate-400`}>
            Multi-Agent Orchestrator
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
            {activeDefinition.label} Agent
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-300 md:text-base">
            {activeDefinition.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(agentDefinitions) as AgentId[]).map((agentId) => (
            <button
              key={agentId}
              type="button"
              onClick={() => {
                setActiveAgent(agentId);
                setResponse(null);
                setSelectedNodeInfo(null);
              }}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                activeAgent === agentId
                  ? "border-white bg-white/10 text-white shadow-lg shadow-white/20"
                  : "border-white/10 bg-black/20 text-slate-300 hover:border-white/40"
              }`}
            >
              {agentDefinitions[agentId].label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`grid gap-8 rounded-3xl border border-white/10 bg-gradient-to-br ${activeDefinition.gradient} p-8 shadow-2xl shadow-black/40 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]`}
      >
        <div className="space-y-6">
          {activeForm}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/90 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-white/40 md:w-auto"
          >
            {isLoading ? "Synthesizing..." : "Orchestrate Insight"}
          </button>
          <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-slate-300">
            <p className="font-semibold text-white">Recent Agent Dispatches</p>
            <ul className="space-y-2">
              {history.length === 0 && (
                <li className="text-slate-500">
                  No dispatches yet. Call an agent to see history.
                </li>
              )}
              {history.map((item) => (
                <li key={item.timestamp} className="flex items-start gap-3">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-white/70" />
                  <div>
                    <p className="text-slate-200">
                      {agentDefinitions[item.agentId].label}
                      <span className="ml-2 text-slate-500">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </p>
                    <p className="line-clamp-2 text-slate-400">
                      {item.response.title}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5 shadow-inner">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {response?.title ?? "Awaiting Agent Output"}
              </h3>
              {response?.highlights && (
                <span className="text-xs uppercase tracking-widest text-slate-400">
                  Highlights · {response.highlights.join(" · ")}
                </span>
              )}
            </div>
            <div className="mt-4 max-h-[280px] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
              {response?.content ?? (
                <span className="text-slate-500">
                  Dispatch an agent to receive personalized intelligence.
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Herbal Knowledge Graph
                </h3>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Traditions · Systems · Synergies
                </p>
              </div>
              {selectedNodeInfo && (
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-slate-200">
                  {selectedNodeInfo}
                </span>
              )}
            </div>
            <KnowledgeGraph
              highlightIds={highlightedHerbs}
              onSelectNode={(node) => {
                setSelectedNodeInfo(node.label);
                if (node.id && herbs.find((herb) => herb.id === node.id)) {
                  if (activeAgent === "educator") {
                    const selectedIds = new Set(formState.educator.herbs);
                    if (!selectedIds.has(node.id)) {
                      selectedIds.add(node.id);
                      handleChange("herbs", Array.from(selectedIds).slice(0, 5));
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
