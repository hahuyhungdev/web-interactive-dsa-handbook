import type { GraphFrame, GraphNode, GraphEdge } from '../utils/generateFrames';

// ─── Color Maps ───────────────────────────────────────────────────────────────

const NODE_COLORS: Record<GraphNode['status'], { fill: string; stroke: string }> = {
  default:  { fill: '#e5e5e5', stroke: 'rgba(28,28,28,0.3)' },
  visiting: { fill: '#fbbf24', stroke: '#d97706' },
  visited:  { fill: '#22c55e', stroke: '#16a34a' },
  queued:   { fill: '#60a5fa', stroke: '#2563eb' },
  current:  { fill: '#ff6f61', stroke: '#dc2626' },
};

const EDGE_STYLES: Record<GraphEdge['status'], { stroke: string; width: number; opacity: number }> = {
  default:   { stroke: 'rgba(28,28,28,0.15)', width: 0.5, opacity: 1 },
  active:    { stroke: '#fbbf24', width: 1.2, opacity: 1 },
  traversed: { stroke: '#22c55e', width: 0.8, opacity: 0.8 },
};

// ─── Data Structure Strip ─────────────────────────────────────────────────────

function DataStructureStrip({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex items-center gap-3 mt-4 px-2">
      <span className="font-sans text-sm font-bold text-charcoal uppercase tracking-wider shrink-0">
        {label}:
      </span>
      <div className="flex items-center gap-1.5 flex-wrap min-h-[32px]">
        {items.length === 0 ? (
          <span className="text-sm text-charcoal/40 italic font-mono">empty</span>
        ) : (
          items.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="px-2.5 py-1 bg-paper border border-charcoal/15 rounded-lg font-mono text-sm font-bold text-charcoal shadow-sm transition-all"
            >
              {item}
            </div>
          ))
        )}
      </div>
      {label === 'Queue' && items.length > 0 && (
        <span className="text-xs text-charcoal/40 font-mono ml-auto">← front</span>
      )}
      {label === 'Stack' && items.length > 0 && (
        <span className="text-xs text-charcoal/40 font-mono ml-auto">top →</span>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface GraphVisualizerProps {
  frame: GraphFrame;
  activeAlgo: 'bfs' | 'dfs';
  startNode: string;
  onAlgoChange: (algo: 'bfs' | 'dfs') => void;
  onStartNodeChange: (nodeId: string) => void;
}

const NODE_IDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export function GraphVisualizer({
  frame,
  activeAlgo,
  startNode,
  onAlgoChange,
  onStartNodeChange,
}: GraphVisualizerProps) {
  const { nodes, edges, message, dataStructure } = frame;

  // Build position lookup
  const posMap = new Map(nodes.map((n) => [n.id, { x: n.x, y: n.y }]));

  return (
    <div className="flex flex-col gap-4">
      {/* Controls Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Algo tabs */}
        <div className="flex bg-paper-dark rounded-xl border border-charcoal/10 p-1">
          <button
            id="graph-tab-bfs"
            onClick={() => onAlgoChange('bfs')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
              activeAlgo === 'bfs'
                ? 'bg-coral text-paper shadow-sm'
                : 'text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5'
            }`}
          >
            BFS
          </button>
          <button
            id="graph-tab-dfs"
            onClick={() => onAlgoChange('dfs')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
              activeAlgo === 'dfs'
                ? 'bg-coral text-paper shadow-sm'
                : 'text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5'
            }`}
          >
            DFS
          </button>
        </div>

        {/* Start node selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="graph-start-node"
            className="text-sm font-bold text-charcoal uppercase tracking-wider"
          >
            Start:
          </label>
          <select
            id="graph-start-node"
            value={startNode}
            onChange={(e) => onStartNodeChange(e.target.value)}
            className="px-3 py-1.5 bg-paper border border-charcoal/15 rounded-xl text-sm font-mono font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-coral cursor-pointer"
          >
            {NODE_IDS.map((id) => (
              <option key={id} value={id}>
                Node {id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SVG Graph */}
      <div className="bg-paper-dark border border-charcoal/10 rounded-3xl p-6 md:p-8">
        <svg
          viewBox="0 0 100 80"
          className="w-full h-auto max-h-[400px]"
          role="img"
          aria-label="Graph visualization"
        >
          {/* Edges */}
          {edges.map((edge) => {
            const fromPos = posMap.get(edge.from);
            const toPos = posMap.get(edge.to);
            if (!fromPos || !toPos) return null;
            const style = EDGE_STYLES[edge.status];
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={style.stroke}
                strokeWidth={style.width * 1.2}
                strokeLinecap="round"
                opacity={style.opacity}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const colors = NODE_COLORS[node.status];
            const isActive = node.status === 'current' || node.status === 'visiting';
            return (
              <g key={node.id} className="transition-all duration-300">
                {/* Glow ring for active nodes */}
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="8.5"
                    fill="none"
                    stroke={colors.fill}
                    strokeWidth="0.6"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="r"
                      values="7.5;9.5;7.5"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.4;0.1;0.4"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="6.5"
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth="0.8"
                  className="transition-all duration-300"
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="4.2"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  fill={
                    (node.status === 'default' || node.status === 'visiting' || node.status === 'queued')
                      ? '#1e1e1e'
                      : '#fff'
                  }
                  className="pointer-events-none select-none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Data Structure Strip */}
        <DataStructureStrip label={dataStructure.label} items={dataStructure.items} />
      </div>

      {/* Message */}
      <div className="flex items-center gap-2 px-4 py-3 bg-paper border border-charcoal/10 rounded-2xl">
        <div className="w-2 h-2 rounded-full bg-coral shrink-0 animate-pulse" />
        <p className="text-sm font-mono text-charcoal">{message}</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-2">
        {([
          ['default', 'Unvisited'],
          ['queued', 'In Queue/Stack'],
          ['current', 'Current'],
          ['visiting', 'Visiting'],
          ['visited', 'Visited'],
        ] as const).map(([status, label]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full border"
              style={{
                backgroundColor: NODE_COLORS[status].fill,
                borderColor: NODE_COLORS[status].stroke,
              }}
            />
            <span className="text-xs text-charcoal/60 font-sans">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
