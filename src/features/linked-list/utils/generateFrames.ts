import type { NodeItem, VisualizerFrame } from '@/shared/types';

export function generateListFrames(list: NodeItem[], insertedNodeId: string | null = null): VisualizerFrame[] {
  const frames: VisualizerFrame[] = [];

  // Frame 0: Initial state
  frames.push({
    nodes: list.map(node => ({
      ...node,
      status: (node.id === insertedNodeId ? 'inserted' : 'default') as NodeItem['status']
    })),
    highlightedMarker: '@init'
  });

  // Loop through list to visit nodes
  for (let i = 0; i < list.length; i++) {
    frames.push({
      nodes: list.map((node, idx) => ({
        ...node,
        status: (idx === i ? 'traversing' : 'default') as NodeItem['status']
      })),
      highlightedMarker: '@visit'
    });

    frames.push({
      nodes: list.map((node, idx) => ({
        ...node,
        status: (idx === i ? 'traversing' : 'default') as NodeItem['status']
      })),
      highlightedMarker: '@next'
    });
  }

  // Final Frame
  frames.push({
    nodes: list.map(node => ({ ...node, status: 'default' as NodeItem['status'] })),
    highlightedMarker: '@loop'
  });

  return frames;
}
