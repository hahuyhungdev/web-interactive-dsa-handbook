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
      {/* Interaction Controls */}
      <div className="flex flex-col gap-6 glass-panel rounded-2xl p-5 sm:p-6 shadow-sm">
        {/* Insert Section */}
        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-charcoal/60">
            Insert Node
          </label>
          <div className="flex flex-wrap gap-2">
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
              className="flex-1 min-w-[140px] px-3 py-2 text-sm sm:text-base border border-charcoal/15 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal transition-all shadow-inner"
            />
            <select
              id="select-list-position"
              value={insertPos}
              onChange={(e) => setInsertPos(e.target.value as InsertPosition)}
              className="px-3 py-2 text-sm sm:text-base font-mono border border-charcoal/15 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal"
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
                className="w-20 px-3 py-2 text-sm font-mono border border-charcoal/15 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal transition-all shadow-inner"
                placeholder="idx"
              />
            )}
            <button
              id="btn-list-insert"
              onClick={handleInsert}
              className="px-4 py-2 bg-coral hover:bg-coral-dark text-paper rounded-xl font-sans text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-spring hover-spring active-spring shrink-0"
            >
              Insert
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-charcoal/5 w-full"></div>

        {/* Delete Section */}
        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-charcoal/60">
            Delete Node (by value)
          </label>
          <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full">
            <input
              id="input-list-delete-val"
              type="text"
              placeholder="e.g. 30"
              value={deleteVal}
              onChange={(e) => setDeleteVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleDelete();
              }}
              className="flex-1 min-w-0 px-3 py-2 text-sm sm:text-base border border-charcoal/15 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal transition-all shadow-inner"
            />
            <button
              id="btn-list-delete"
              onClick={handleDelete}
              className="px-4 py-2 border border-charcoal/15 bg-paper hover:bg-charcoal/5 text-charcoal rounded-xl font-sans text-xs sm:text-sm font-bold uppercase tracking-wider transition-spring hover-spring active-spring shrink-0"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-charcoal/5 w-full"></div>

        {/* Find Section */}
        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-charcoal/60">
            Find (animated traversal)
          </label>
          <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full">
            <input
              id="input-list-find-val"
              type="text"
              placeholder="value to search"
              value={findVal}
              onChange={(e) => setFindVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleFind();
              }}
              className="flex-1 min-w-0 px-3 py-2 text-sm sm:text-base border border-charcoal/15 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal transition-all shadow-inner"
            />
            <button
              id="btn-list-find"
              onClick={handleFind}
              className="px-4 py-2 bg-charcoal text-paper hover:bg-coral hover:text-paper rounded-xl font-sans text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-spring hover-spring active-spring shrink-0"
            >
              Find
            </button>
          </div>
        </div>

        {warning && (
          <p
            id="list-validation-warning"
            className="text-red-500 text-xs sm:text-sm font-sans font-semibold animate-pulse"
          >
            {warning}
          </p>
        )}
      </div>

      {/* Linked List Visualizer Container */}
      <div
        id="linked-list-visualizer-container"
        className="flex items-center justify-start gap-4 overflow-x-auto glass-panel-dark border border-charcoal/10 rounded-3xl p-8 min-h-[140px] flex-nowrap shadow-inner"
      >
        {currentNodesState.length === 0 ? (
          <div className="text-sm sm:text-base text-charcoal/50 font-mono italic w-full text-center py-4">
            Empty Linked List
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {currentNodesState.map((node, idx) => (
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
                {/* Node Card */}
                <div
                  className={`list-node w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex flex-col items-center justify-center font-mono font-bold shadow-md transition-all duration-300 ${
                    node.status === "traversing"
                      ? "bg-gradient-to-br from-amber-400 to-amber-300 border-amber-500 text-charcoal shadow-[0_4px_12px_rgba(251,191,36,0.25)]"
                      : node.status === "inserted"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-400 border-emerald-600 text-paper shadow-[0_4px_12px_rgba(16,185,129,0.25)]"
                        : node.status === "deleted"
                          ? "bg-gradient-to-br from-coral to-coral-light border-coral-dark text-paper shadow-[0_4px_12px_rgba(224,83,66,0.25)]"
                          : node.status === "active"
                            ? "bg-gradient-to-br from-violet-500 to-fuchsia-400 border-violet-600 text-paper shadow-[0_4px_12px_rgba(139,92,246,0.25)]"
                            : "bg-gradient-to-br from-paper to-paper-dark border-charcoal/15 text-charcoal hover:border-charcoal/30 shadow-sm"
                  }`}
                  data-value={node.value}
                  data-status={node.status}
                >
                  <span className="text-base font-mono">{node.value}</span>
                </div>

                {/* Connector Arrow */}
                {idx < currentNodesState.length - 1 && (
                  node.pointerStatus === "skipped" ? (
                    <div
                      className="list-pointer flex items-center justify-center text-coral relative"
                      data-element-type="linked-list-pointer"
                      style={{ width: "96px", marginLeft: "-24px", marginRight: "-24px", zIndex: 10 }}
                    >
                      <svg className="w-24 h-12 overflow-visible" viewBox="0 0 96 48">
                        <path
                          d="M 12,24 C 36,0 60,0 84,24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray="4,4"
                        />
                        <polygon points="84,24 80,16 88,20" fill="currentColor" />
                      </svg>
                      <span className="absolute top-0 text-[9px] font-sans font-bold bg-paper px-1 rounded border border-coral text-coral uppercase tracking-wide shadow-sm">
                        Bypass
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`list-pointer flex items-center justify-center transition-all duration-300 ${
                        node.pointerStatus === "highlighted"
                          ? "text-coral animate-pulse scale-125"
                          : "text-charcoal/40"
                      }`}
                      data-element-type="linked-list-pointer"
                    >
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2z" />
                      </svg>
                    </div>
                  )
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
