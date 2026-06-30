import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { NodeItem } from "@/shared/types";

type InsertPosition = "head" | "tail" | "index";

interface LinkedListVisualizerProps {
  list: NodeItem[];
  onInsert: (val: string, pos: InsertPosition, index?: number) => void;
  onDelete: (val: string) => void;
  onFind: (target: string) => void;
  currentNodesState: NodeItem[];
}

export function LinkedListVisualizer({
  list,
  onInsert,
  onDelete,
  onFind,
  currentNodesState,
}: LinkedListVisualizerProps) {
  const [insertVal, setInsertVal] = useState("");
  const [insertPos, setInsertPos] = useState<InsertPosition>("tail");
  const [insertIdx, setInsertIdx] = useState("0");
  const [deleteVal, setDeleteVal] = useState("");
  const [findVal, setFindVal] = useState("");
  const [warning, setWarning] = useState("");

  const handleInsert = () => {
    const trimmed = insertVal.trim();
    if (!trimmed) {
      setWarning("Value cannot be empty");
      return;
    }
    setWarning("");

    if (insertPos === "index") {
      const rawIdx = Number(insertIdx);
      if (!Number.isInteger(rawIdx) || rawIdx < 0 || rawIdx > list.length) {
        setWarning(`Index must be between 0 and ${list.length}`);
        return;
      }
      onInsert(trimmed, "index", rawIdx);
    } else {
      onInsert(trimmed, insertPos);
    }
    setInsertVal("");
  };

  const handleDelete = () => {
    const trimmed = deleteVal.trim();
    if (!trimmed) return;

    const index = list.findIndex((node) => node.value === trimmed);
    if (index === -1) {
      setWarning(`Value "${trimmed}" not in list`);
      return;
    }

    onDelete(trimmed);
    setDeleteVal("");
    setWarning("");
  };

  const handleFind = () => {
    const trimmed = findVal.trim();
    if (!trimmed) {
      setWarning("Enter a value to find");
      return;
    }
    setWarning("");
    onFind(trimmed);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Linked List Visualizer Container */}
      <div
        id="linked-list-visualizer-container"
        className="flex items-center justify-start gap-5 overflow-x-auto bg-paper-dark/35 border border-charcoal/10 rounded-2xl p-8 min-h-[170px] flex-nowrap shadow-inner"
      >
        {currentNodesState.length === 0 ? (
          <div className="text-sm sm:text-base text-charcoal/50 font-mono italic w-full text-center py-4 select-none">
            Empty Linked List
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {currentNodesState.map((node, idx) => {
              const isHead = idx === 0;
              const isTail = idx === currentNodesState.length - 1;

              return (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{
                    type: "spring",
                    stiffness: 340,
                    damping: 30,
                    mass: 0.6,
                  }}
                  className="flex items-center gap-4 shrink-0 font-sans"
                >
                  {/* Node Card Container */}
                  <div className="relative flex flex-col items-center pb-6">
                    <div
                      className={`list-node w-14 h-14 sm:w-16 sm:h-16 rounded-full border flex items-center justify-center font-mono font-black shadow-md transition-all duration-300 ${
                        node.status === "traversing"
                          ? "bg-gradient-to-br from-amber-400 to-amber-300 border-amber-500 text-charcoal shadow-[0_4px_16px_rgba(245,158,11,0.3)] scale-110"
                          : node.status === "inserted"
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-400 border-emerald-600 text-paper shadow-[0_4px_16px_rgba(16,185,129,0.3)] scale-110"
                            : node.status === "deleted"
                              ? "bg-gradient-to-br from-coral to-rose-400 border-coral-dark text-paper shadow-[0_4px_16px_rgba(224,83,66,0.3)] scale-110"
                              : node.status === "active"
                                ? "bg-gradient-to-br from-violet-600 to-violet-500 border-violet-700 text-paper shadow-[0_4px_16px_rgba(139,92,246,0.3)] scale-110"
                                : "bg-gradient-to-br from-paper to-paper-dark border-charcoal/15 text-charcoal hover:border-charcoal/30 shadow-sm"
                      }`}
                      data-value={node.value}
                      data-status={node.status}
                    >
                      <span className="text-base sm:text-lg font-mono">{node.value}</span>
                    </div>
                    {/* Head / Tail Labels */}
                    {(isHead || isTail) && (
                      <span className="absolute bottom-0 text-[10px] font-sans font-black uppercase tracking-widest text-coral select-none whitespace-nowrap">
                        {isHead && isTail ? "head / tail" : isHead ? "head" : "tail"}
                      </span>
                    )}
                  </div>

                  {/* Connector Arrow */}
                  {idx < currentNodesState.length - 1 && (
                    node.pointerStatus === "skipped" ? (
                      <div
                        className="list-pointer flex items-center justify-center text-coral relative pb-6"
                        data-element-type="linked-list-pointer"
                        style={{ width: "96px", marginLeft: "-24px", marginRight: "-24px", zIndex: 10 }}
                      >
                        <svg className="w-24 h-12 overflow-visible" viewBox="0 0 96 48">
                          <path
                            d="M 12,24 C 36,-6 60,-6 84,24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray="4,4"
                          />
                          <polygon points="84,24 82,15 89,19" fill="currentColor" />
                        </svg>
                        <span className="absolute top-2 text-[9px] font-sans font-black bg-paper px-1.5 py-0.5 rounded border border-coral text-coral uppercase tracking-widest shadow-sm select-none">
                          Bypass
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`list-pointer flex items-center justify-center transition-all duration-300 px-1 pb-6 ${
                          node.pointerStatus === "highlighted"
                            ? "text-coral animate-pulse scale-110"
                            : "text-charcoal/30"
                        }`}
                        data-element-type="linked-list-pointer"
                      >
                        <svg className="w-12 h-6 overflow-visible" viewBox="0 0 48 24">
                          <defs>
                            <marker
                              id={`arrow-${node.id}`}
                              viewBox="0 0 10 10"
                              refX="6"
                              refY="5"
                              markerWidth="6"
                              markerHeight="6"
                              orient="auto-start-reverse"
                            >
                              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                            </marker>
                          </defs>
                          <line
                            x1="0"
                            y1="12"
                            x2="38"
                            y2="12"
                            stroke="currentColor"
                            strokeWidth={node.pointerStatus === "highlighted" ? "4" : "3"}
                            markerEnd={`url(#arrow-${node.id})`}
                          />
                        </svg>
                      </div>
                    )
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Interaction Controls */}
      <div className="flex flex-col gap-5 bg-paper border border-charcoal/10 rounded-2xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Insert Section */}
          <div className="flex flex-col gap-2.5">
            <label className="font-sans text-[11px] font-black uppercase tracking-wider text-charcoal/50">
              Insert Node
            </label>
            <div className="flex flex-col gap-2">
              <input
                id="input-list-val"
                type="text"
                placeholder="value, e.g. 42"
                value={insertVal}
                onChange={(e) => {
                  setInsertVal(e.target.value);
                  if (warning) setWarning("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleInsert();
                }}
                className="w-full px-3.5 py-2.5 text-[14px] border border-charcoal/15 bg-paper-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral/50 text-charcoal transition-all shadow-inner font-mono font-bold"
              />
              <div className="flex gap-2">
                <select
                  id="select-list-position"
                  value={insertPos}
                  onChange={(e) => setInsertPos(e.target.value as InsertPosition)}
                  className="flex-1 px-3 py-2.5 text-[13px] border border-charcoal/15 bg-paper rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral/50 text-charcoal cursor-pointer font-sans font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2523555%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_14px_center] bg-no-repeat pr-8"
                >
                  <option value="tail">at tail</option>
                  <option value="head">at head</option>
                  <option value="index">at index…</option>
                </select>
                {insertPos === "index" && (
                  <input
                    id="input-list-index"
                    type="number"
                    min={0}
                    max={list.length}
                    value={insertIdx}
                    onChange={(e) => setInsertIdx(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleInsert();
                    }}
                    className="w-16 px-2.5 py-2.5 text-center text-[13px] border border-charcoal/15 bg-paper rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral/50 text-charcoal font-mono font-bold shadow-inner"
                    placeholder="idx"
                  />
                )}
              </div>
              <button
                id="btn-list-insert"
                onClick={handleInsert}
                className="w-full py-2.5 bg-gradient-to-r from-coral to-coral-dark text-paper hover:shadow-[0_4px_12px_rgba(224,83,66,0.2)] rounded-xl font-sans text-xs font-black uppercase tracking-wider transition-all"
              >
                Insert Node
              </button>
            </div>
          </div>

          {/* Delete Section */}
          <div className="flex flex-col gap-2.5">
            <label className="font-sans text-[11px] font-black uppercase tracking-wider text-charcoal/50">
              Delete Node
            </label>
            <div className="flex flex-col gap-2 h-full justify-between">
              <input
                id="input-list-delete-val"
                type="text"
                placeholder="value, e.g. 30"
                value={deleteVal}
                onChange={(e) => setDeleteVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleDelete();
                }}
                className="w-full px-3.5 py-2.5 text-[14px] border border-charcoal/15 bg-paper-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral/50 text-charcoal transition-all shadow-inner font-mono font-bold"
              />
              <button
                id="btn-list-delete"
                onClick={handleDelete}
                className="w-full py-2.5 border border-charcoal/15 hover:border-coral/30 bg-paper hover:bg-coral/5 text-charcoal hover:text-coral hover:shadow-[0_4px_12px_rgba(224,83,66,0.08)] rounded-xl font-sans text-xs font-black uppercase tracking-wider transition-all md:mt-[44px]"
              >
                Delete Node
              </button>
            </div>
          </div>

          {/* Find Section */}
          <div className="flex flex-col gap-2.5">
            <label className="font-sans text-[11px] font-black uppercase tracking-wider text-charcoal/50">
              Find Node
            </label>
            <div className="flex flex-col gap-2 h-full justify-between">
              <input
                id="input-list-find-val"
                type="text"
                placeholder="value to search"
                value={findVal}
                onChange={(e) => setFindVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFind();
                }}
                className="w-full px-3.5 py-2.5 text-[14px] border border-charcoal/15 bg-paper-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral/50 text-charcoal transition-all shadow-inner font-mono font-bold"
              />
              <button
                id="btn-list-find"
                onClick={handleFind}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-paper hover:shadow-[0_4px_12px_rgba(99,102,241,0.2)] rounded-xl font-sans text-xs font-black uppercase tracking-wider transition-all md:mt-[44px]"
              >
                Find (Animate)
              </button>
            </div>
          </div>
        </div>

        {warning && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-bold shadow-sm select-none">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            {warning}
          </div>
        )}
      </div>
    </div>
  );
}
