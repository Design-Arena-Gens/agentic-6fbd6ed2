"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { GraphLink, GraphNode } from "@/lib/knowledge-graph";
import { buildGraphData } from "@/lib/knowledge-graph";

const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d").then((mod) => mod.default),
  {
    ssr: false,
  },
) as unknown as React.ComponentType<any>;

interface KnowledgeGraphProps {
  highlightIds?: string[];
  onSelectNode?: (node: GraphNode) => void;
}

export function KnowledgeGraph({
  highlightIds = [],
  onSelectNode,
}: KnowledgeGraphProps) {
  const data = useMemo(() => buildGraphData(highlightIds), [highlightIds]);

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-2 shadow-inner backdrop-blur">
      <ForceGraph2D
        width={undefined}
        height={undefined}
        graphData={data as { nodes: GraphNode[]; links: GraphLink[] }}
        backgroundColor="rgba(0,0,0,0)"
        nodeRelSize={6}
        linkWidth={(link: GraphLink) => (link.type === "synergy" ? 2 : 1)}
        linkColor={(link: GraphLink) =>
          link.type === "synergy"
            ? "rgba(255,198,93,0.8)"
            : link.type === "tradition"
              ? "rgba(76,201,240,0.6)"
              : link.type === "system"
                ? "rgba(129,236,236,0.6)"
                : "rgba(255,255,255,0.4)"
        }
        nodeColor={(node: any) => {
          switch (node.group) {
            case "herb":
              return "rgba(52, 235, 164, 0.85)";
            case "herb-highlight":
              return "rgba(255, 173, 73, 1)";
            case "tradition":
              return "rgba(76,201,240,0.75)";
            case "system":
              return "rgba(129,236,236,0.75)";
            case "action":
              return "rgba(255,121,121,0.75)";
            default:
              return "rgba(255,255,255,0.6)";
          }
        }}
        nodeLabel={(node: any) =>
          [node.label, ...(node.metadata ? Object.entries(node.metadata).map(([key, value]) => `${key}: ${value}`) : [])].join("\n")
        }
        onNodeClick={(node: any) => {
          if (onSelectNode) onSelectNode(node as GraphNode);
        }}
      />
    </div>
  );
}
