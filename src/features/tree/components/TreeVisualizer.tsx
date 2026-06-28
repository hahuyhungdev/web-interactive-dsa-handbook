import { motion } from 'motion/react';
import type { TreeFrame, TreeNode } from '../utils/generateFrames';

// ── Constants ──────────────────────────────────────────────────────────────────

const SVG_WIDTH = 800;
const SVG_HEIGHT = 400;
const NODE_RADIUS = 24;

const NODE_FILL: Record<TreeNode['status'], string> = {
  default: '#f3f4f6', // lighter gray for clean look
  visiting: '#fbbf24',
  visited: '#10b981', // premium emerald
  inserted: '#10b981',
  found: '#ef4444', // premium coral/red
  comparing: '#fbbf24',
};

const NODE_STROKE: Record<TreeNode['status'], string> = {
  default: 'rgba(0,0,0,0.15)',
  visiting: '#d97706',
  visited: '#059669',
  inserted: '#059669',
  found: '#dc2626',
  comparing: '#d97706',
};

// ── Component ──────────────────────────────────────────────────────────────────

interface TreeVisualizerProps {
  frame: TreeFrame;
}

export function TreeVisualizer({ frame }: TreeVisualizerProps) {
  const { nodes, edges, message } = frame;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-paper-dark border border-charcoal/10 rounded-3xl p-6 overflow-x-auto w-full">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-auto max-h-[480px] min-w-[650px]"
        >
          {/* Edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.x * SVG_WIDTH;
            const y1 = fromNode.y * 105 + 50;
            const x2 = toNode.x * SVG_WIDTH;
            const y2 = toNode.y * 105 + 50;

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={edge.status === 'active' ? '#fbbf24' : 'rgba(45,45,45,0.2)'}
                strokeWidth={edge.status === 'active' ? 3.5 : 2}
                strokeLinecap="round"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const cx = node.x * SVG_WIDTH;
            const cy = node.y * 105 + 50;
            const fill = NODE_FILL[node.status] ?? NODE_FILL.default;
            const stroke = NODE_STROKE[node.status] ?? NODE_STROKE.default;

            return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: cx,
                  y: cy,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 28,
                  mass: 0.8,
                }}
              >
                {/* Glow effect for active states */}
                {(node.status === 'visiting' || node.status === 'comparing') && (
                  <circle
                    r={NODE_RADIUS + 6}
                    fill="none"
                    stroke={fill}
                    strokeWidth={2.5}
                    opacity={0.4}
                  />
                )}
                {node.status === 'found' && (
                  <circle
                    r={NODE_RADIUS + 6}
                    fill="none"
                    stroke={fill}
                    strokeWidth={2.5}
                    opacity={0.5}
                  />
                )}
                <circle
                  r={NODE_RADIUS}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-mono text-sm font-bold select-none"
                  fill={
                    (node.status === 'default' || node.status === 'visiting' || node.status === 'comparing')
                      ? '#2d2d2d'
                      : '#fff'
                  }
                  style={{ fontSize: '13px', fontWeight: 700 }}
                >
                  {node.value}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Message display */}
      {message && (
        <div className="bg-paper-light border border-charcoal/10 rounded-2xl px-5 py-3 shadow-sm">
          <p className="font-sans text-base text-charcoal font-medium">
            <span className="text-coral font-bold mr-2">→</span>
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
