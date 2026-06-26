import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { NodeItem } from "@/shared/types";

type InsertPosition = "head" | "tail" | "index";

interface LinkedListVisualizerProps {
  list: NodeItem[];
  onListChange: (newList: NodeItem[], insertedId: string | null) => void;
  onFind: (target: string | null) => void;
  currentNodesState: NodeItem[];
}

export function LinkedListVisualizer({
  list,
  onListChange,
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

    const newNode: NodeItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      value: trimmed,
      status: "inserted",
    };

    let newList: NodeItem[];
    if (insertPos === "head") {
      newList = [newNode, ...list];
    } else if (insertPos === "tail") {
      newList = [...list, newNode];
    } else {
      const rawIdx = Number(insertIdx);
      if (!Number.isInteger(rawIdx) || rawIdx < 0 || rawIdx > list.length) {
        setWarning(`Index must be between 0 and ${list.length}`);
        return;
      }
      newList = [...list.slice(0, rawIdx), newNode, ...list.slice(rawIdx)];
    }

    onListChange(newList, newNode.id);
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

    const newList = list.filter((_, idx) => idx !== index);
    onListChange(newList, null);
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
      <div className="flex flex-col gap-6 bg-paper border border-charcoal/10 rounded-2xl p-6 shadow-sm">
        {/* Insert Section */}
        <div className="flex flex-col gap-2">
          <label className="font-sans text-base font-bold uppercase tracking-wider text-charcoal">
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
              className="flex-1 min-w-[160px] px-3 py-2 text-base border border-charcoal/20 bg-paper-light rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal"
            />
            <select
              id="select-list-position"
              value={insertPos}
              onChange={(e) => setInsertPos(e.target.value as InsertPosition)}
              className="px-3 py-2 text-base font-mono border border-charcoal/20 bg-paper-light rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal"
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
                className="w-20 px-3 py-2 text-base font-mono border border-charcoal/20 bg-paper-light rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal"
                placeholder="idx"
              />
            )}
            <button
              id="btn-list-insert"
              onClick={handleInsert}
              className="px-4 py-2 bg-coral hover:bg-coral-dark text-paper rounded-xl font-sans text-base font-bold uppercase tracking-wider shadow-sm transition-all duration-300 shrink-0"
            >
              Insert
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-charcoal/10 w-full"></div>

        {/* Delete Section */}
        <div className="flex flex-col gap-2">
          <label className="font-sans text-base font-bold uppercase tracking-wider text-charcoal">
            Delete Node (by value)
          </label>
          <div className="flex gap-2">
            <input
              id="input-list-delete-val"
              type="text"
              placeholder="e.g. 30"
              value={deleteVal}
              onChange={(e) => setDeleteVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleDelete();
              }}
              className="flex-1 px-3 py-2 text-base border border-charcoal/20 bg-paper-light rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal"
            />
            <button
              id="btn-list-delete"
              onClick={handleDelete}
              className="px-4 py-2 border border-charcoal/20 hover:bg-charcoal/5 text-charcoal rounded-xl font-sans text-base font-bold uppercase tracking-wider transition-all duration-300 shrink-0"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-charcoal/10 w-full"></div>

        {/* Find Section */}
        <div className="flex flex-col gap-2">
          <label className="font-sans text-base font-bold uppercase tracking-wider text-charcoal">
            Find (animated traversal)
          </label>
          <div className="flex gap-2">
            <input
              id="input-list-find-val"
              type="text"
              placeholder="value to search"
              value={findVal}
              onChange={(e) => setFindVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleFind();
              }}
              className="flex-1 px-3 py-2 text-base border border-charcoal/20 bg-paper-light rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal"
            />
            <button
              id="btn-list-find"
              onClick={handleFind}
              className="px-4 py-2 bg-charcoal text-paper hover:bg-coral hover:text-paper rounded-xl font-sans text-base font-bold uppercase tracking-wider shadow-sm transition-all duration-300 shrink-0"
            >
              Find
            </button>
          </div>
        </div>

        {warning && (
          <p
            id="list-validation-warning"
            className="text-red-500 text-base font-sans font-semibold"
          >
            {warning}
          </p>
        )}
      </div>

      {/* Linked List Visualizer Container */}
      <div
        id="linked-list-visualizer-container"
        className="flex items-center justify-start gap-4 overflow-x-auto bg-paper-dark border border-charcoal/10 rounded-3xl p-8 min-h-[140px] flex-wrap md:flex-nowrap"
      >
        {currentNodesState.length === 0 ? (
          <div className="text-base text-charcoal font-mono italic w-full text-center py-4">
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
                className="flex items-center gap-4 shrink-0"
              >
                {/* Node Card */}
                <div
                  className={`list-node w-16 h-16 rounded-full border flex flex-col items-center justify-center font-mono font-bold shadow-sm transition-colors duration-300 ${
                    node.status === "traversing"
                      ? "bg-amber-400 border-amber-500 text-charcoal"
                      : node.status === "inserted"
                        ? "bg-emerald-500 border-emerald-600 text-paper"
                        : node.status === "deleted"
                          ? "bg-red-500 border-red-600 text-paper"
                          : node.status === "active"
                            ? "bg-blue-50 border-blue-200 text-blue-800"
                            : "bg-paper border-charcoal/20 text-charcoal"
                  }`}
                  data-value={node.value}
                  data-status={node.status}
                >
                  <span className="text-base font-mono">{node.value}</span>
                </div>

                {/* Connector Arrow */}
                {idx < currentNodesState.length - 1 && (
                  <div
                    className="list-pointer flex items-center justify-center text-charcoal"
                    data-element-type="linked-list-pointer"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2z" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
