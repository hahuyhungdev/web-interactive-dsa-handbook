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
        status: (idx === i ? "active" : "default") as NodeItem["status"],
      })),
      highlightedMarker: "@visit",
    });

    frames.push({
      nodes: list.map((node, idx) => ({
        ...node,
        status: (idx === i ? "active" : "default") as NodeItem["status"],
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
        status: (idx === i ? "active" : "default") as NodeItem["status"],
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
        status: (idx === i ? "active" : "default") as NodeItem["status"],
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

export function generateDeleteFrames(
  list: NodeItem[],
  target: string,
): VisualizerFrame[] {
  const frames: VisualizerFrame[] = [];
  const targetIndex = list.findIndex((node) => node.value === target);

  if (targetIndex === -1) {
    frames.push({
      nodes: list.map((node) => ({ ...node, status: "default" as const })),
      highlightedMarker: "@init",
    });
    return frames;
  }

  // 1. Initial State Frame
  frames.push({
    nodes: list.map((node) => ({ ...node, status: "default" as const })),
    highlightedMarker: "@init",
  });

  // 2. Traverse up to the target node
  for (let i = 0; i <= targetIndex; i++) {
    frames.push({
      nodes: list.map((node, idx) => ({
        ...node,
        status: (idx === i ? "active" : "default") as NodeItem["status"],
      })),
      highlightedMarker: i === 0 ? "@init" : "@next",
    });
  }

  // 3. Highlight target node as "deleted"
  // Keep targetIndex-1 node's pointer highlighted to indicate change
  frames.push({
    nodes: list.map((node, idx) => {
      let status: NodeItem["status"] = "default";
      let pointerStatus: NodeItem["pointerStatus"] = "default";
      if (idx === targetIndex) {
        status = "deleted";
      } else if (idx === targetIndex - 1) {
        status = "active";
        pointerStatus = "highlighted";
      }
      return { ...node, status, pointerStatus };
    }),
    highlightedMarker: "@loop",
  });

  // 4. Update the pointer of targetIndex - 1 to bypass target node
  frames.push({
    nodes: list.map((node, idx) => {
      let status: NodeItem["status"] = "default";
      let pointerStatus: NodeItem["pointerStatus"] = "default";
      if (idx === targetIndex) {
        status = "deleted";
      } else if (idx === targetIndex - 1) {
        pointerStatus = "skipped";
      }
      return { ...node, status, pointerStatus };
    }),
    highlightedMarker: "@link",
  });

  // 5. Final state: the target node is removed from the DOM
  const listAfterDelete = list.filter((_, idx) => idx !== targetIndex);
  frames.push({
    nodes: listAfterDelete.map((node) => ({ ...node, status: "default" as const })),
    highlightedMarker: "@link",
  });

  return frames;
}
