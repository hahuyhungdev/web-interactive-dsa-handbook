import type { NodeItem, VisualizerFrame } from "@/shared/types";

export function generateListFrames(
  list: NodeItem[],
  insertedNodeId: string | null = null,
): VisualizerFrame[] {
  const frames: VisualizerFrame[] = [];

  // Frame 0: Initial state
  frames.push({
    nodes: list.map((node) => ({
      ...node,
      status: (node.id === insertedNodeId
        ? "inserted"
        : "default") as NodeItem["status"],
    })),
    highlightedMarker: "@init",
  });

  // Loop through list to visit nodes
  for (let i = 0; i < list.length; i++) {
    frames.push({
      nodes: list.map((node, idx) => ({
        ...node,
        status: (idx === i ? "traversing" : "default") as NodeItem["status"],
      })),
      highlightedMarker: "@visit",
    });

    frames.push({
      nodes: list.map((node, idx) => ({
        ...node,
        status: (idx === i ? "traversing" : "default") as NodeItem["status"],
      })),
      highlightedMarker: "@next",
    });
  }

  // Final Frame
  frames.push({
    nodes: list.map((node) => ({
      ...node,
      status: "default" as NodeItem["status"],
    })),
    highlightedMarker: "@loop",
  });

  return frames;
}

/**
 * Traversal frames that stop on the first node matching `target`.
 * The matched node is marked `inserted` (green) to read as "found".
 */
export function generateFindFrames(
  list: NodeItem[],
  target: string,
): VisualizerFrame[] {
  const frames: VisualizerFrame[] = [];

  frames.push({
    nodes: list.map((node) => ({
      ...node,
      status: "default" as NodeItem["status"],
    })),
    highlightedMarker: "@init",
  });

  for (let i = 0; i < list.length; i++) {
    frames.push({
      nodes: list.map((node, idx) => ({
        ...node,
        status: (idx === i ? "traversing" : "default") as NodeItem["status"],
      })),
      highlightedMarker: "@visit",
    });

    if (list[i].value === target) {
      frames.push({
        nodes: list.map((node, idx) => ({
          ...node,
          status: (idx === i ? "inserted" : "default") as NodeItem["status"],
        })),
        highlightedMarker: "@visit",
      });
      return frames;
    }

    frames.push({
      nodes: list.map((node, idx) => ({
        ...node,
        status: (idx === i ? "traversing" : "default") as NodeItem["status"],
      })),
      highlightedMarker: "@next",
    });
  }

  // Not found — leave every node muted at the end
  frames.push({
    nodes: list.map((node) => ({
      ...node,
      status: "default" as NodeItem["status"],
    })),
    highlightedMarker: "@loop",
  });

  return frames;
}
