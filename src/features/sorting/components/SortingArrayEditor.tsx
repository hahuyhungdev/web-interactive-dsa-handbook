import { useState } from "react";
import {
  Shuffle,
  FlipHorizontal2,
  ArrowDownAZ,
  ArrowUpAZ,
  Check,
  X,
} from "lucide-react";

interface SortingArrayEditorProps {
  array: number[];
  onChange: (next: number[]) => void;
}

const MIN_SIZE = 3;
const MAX_SIZE = 30;
const MIN_VAL = 1;
const MAX_VAL = 99;

function randomArray(size: number): number[] {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * (MAX_VAL - MIN_VAL + 1)) + MIN_VAL,
  );
}

function nearlySortedArray(size: number): number[] {
  const arr = Array.from({ length: size }, (_, i) =>
    Math.round(((i + 1) * MAX_VAL) / (size + 1)),
  );
  // swap two adjacent pairs to break perfect order
  if (arr.length >= 4) {
    [arr[1], arr[2]] = [arr[2], arr[1]];
    [arr[arr.length - 2], arr[arr.length - 3]] = [
      arr[arr.length - 3],
      arr[arr.length - 2],
    ];
  }
  return arr;
}

function sortedArray(size: number, descending = false): number[] {
  const base = Array.from({ length: size }, (_, i) =>
    Math.round(((i + 1) * MAX_VAL) / (size + 1)),
  );
  return descending ? base.reverse() : base;
}

function parseCustom(input: string): {
  values: number[] | null;
  error: string | null;
} {
  const tokens = input
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (tokens.length === 0)
    return { values: null, error: "Enter at least one number." };
  if (tokens.length < MIN_SIZE)
    return { values: null, error: `Need at least ${MIN_SIZE} numbers.` };
  if (tokens.length > MAX_SIZE)
    return { values: null, error: `Max ${MAX_SIZE} numbers.` };
  const values: number[] = [];
  for (const t of tokens) {
    const n = Number(t);
    if (!Number.isFinite(n) || !Number.isInteger(n)) {
      return { values: null, error: `"${t}" is not a whole number.` };
    }
    if (n < MIN_VAL || n > MAX_VAL) {
      return {
        values: null,
        error: `${n} is out of range (${MIN_VAL}–${MAX_VAL}).`,
      };
    }
    values.push(n);
  }
  return { values, error: null };
}

export function SortingArrayEditor({
  array,
  onChange,
}: SortingArrayEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(array.join(", "));
  const [error, setError] = useState<string | null>(null);

  const size = array.length;

  const startEdit = () => {
    setDraft(array.join(", "));
    setError(null);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const applyEdit = () => {
    const { values, error: err } = parseCustom(draft);
    if (!values) {
      setError(err);
      return;
    }
    onChange(values);
    setIsEditing(false);
    setError(null);
  };

  const handleSize = (delta: number) => {
    const nextSize = Math.min(MAX_SIZE, Math.max(MIN_SIZE, size + delta));
    if (nextSize === size) return;
    if (nextSize > size) {
      onChange([...array, ...randomArray(nextSize - size)]);
    } else {
      onChange(array.slice(0, nextSize));
    }
  };

  return (
    <div className="flex flex-col gap-3.5 glass-panel rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-array-shuffle"
            type="button"
            onClick={() => onChange(randomArray(size))}
            title="Shuffle"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-charcoal/15 bg-paper hover:bg-charcoal/5 text-charcoal rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-spring hover-spring active-spring"
          >
            <Shuffle className="w-3.5 h-3.5" /> Shuffle
          </button>
          <button
            id="btn-array-reverse"
            type="button"
            onClick={() => onChange([...array].reverse())}
            title="Reverse"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-charcoal/15 bg-paper hover:bg-charcoal/5 text-charcoal rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-spring hover-spring active-spring"
          >
            <FlipHorizontal2 className="w-3.5 h-3.5" /> Reverse
          </button>
          <button
            id="btn-array-sorted"
            type="button"
            onClick={() => onChange(sortedArray(size, false))}
            title="Sorted ascending"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-charcoal/15 bg-paper hover:bg-charcoal/5 text-charcoal rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-spring hover-spring active-spring"
          >
            <ArrowDownAZ className="w-3.5 h-3.5" /> Sorted
          </button>
          <button
            id="btn-array-reversed"
            type="button"
            onClick={() => onChange(sortedArray(size, true))}
            title="Sorted descending (worst case)"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-charcoal/15 bg-paper hover:bg-charcoal/5 text-charcoal rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-spring hover-spring active-spring"
          >
            <ArrowUpAZ className="w-3.5 h-3.5" /> Reversed
          </button>
          <button
            id="btn-array-nearly"
            type="button"
            onClick={() => onChange(nearlySortedArray(size))}
            title="Nearly sorted"
            className="px-3 py-1.5 border border-charcoal/15 bg-paper hover:bg-charcoal/5 text-charcoal rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-spring hover-spring active-spring"
          >
            Nearly Sorted
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-charcoal/50">
            Size
          </span>
          <button
            type="button"
            onClick={() => handleSize(-1)}
            disabled={size <= MIN_SIZE}
            className="w-7 h-7 rounded-lg border border-charcoal/15 hover:bg-charcoal/5 text-charcoal font-mono disabled:opacity-30 disabled:cursor-not-allowed transition-spring hover-spring active-spring"
            aria-label="Decrease array size"
          >
            −
          </button>
          <span className="font-mono text-base font-bold tabular-nums w-6 text-center">
            {size}
          </span>
          <button
            type="button"
            onClick={() => handleSize(1)}
            disabled={size >= MAX_SIZE}
            className="w-7 h-7 rounded-lg border border-charcoal/15 hover:bg-charcoal/5 text-charcoal font-mono disabled:opacity-30 disabled:cursor-not-allowed transition-spring hover-spring active-spring"
            aria-label="Increase array size"
          >
            +
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <label
            htmlFor="input-array-custom"
            className="font-sans text-xs font-bold uppercase tracking-wider text-charcoal/50"
          >
            Custom array (comma or space separated, {MIN_VAL}–{MAX_VAL})
          </label>
          <div className="flex gap-2">
            <input
              id="input-array-custom"
              type="text"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              autoFocus
              className="flex-1 px-3 py-2 text-sm font-mono border border-charcoal/15 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal"
              placeholder="e.g. 25, 40, 15, 55, 30, 20"
            />
            <button
              type="button"
              onClick={applyEdit}
              className="flex items-center gap-1 px-3 py-2 bg-coral hover:bg-coral-dark text-paper rounded-xl font-sans text-xs font-bold uppercase tracking-wider shadow-sm transition-spring hover-spring active-spring"
            >
              <Check className="w-3.5 h-3.5" /> Apply
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="flex items-center gap-1 px-3 py-2 border border-charcoal/15 hover:bg-charcoal/5 text-charcoal rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-spring hover-spring active-spring"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
          {error && (
            <p
              id="array-validation-warning"
              className="text-red-500 text-xs font-sans font-semibold animate-pulse"
            >
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 border-t border-charcoal/5 pt-3.5">
          <div className="font-mono text-sm text-charcoal/70 truncate">
            <span className="font-bold text-charcoal mr-2">array</span>[{" "}
            {array.join(", ")} ]
          </div>
          <button
            id="btn-array-edit"
            type="button"
            onClick={startEdit}
            className="px-3 py-1.5 border border-charcoal/15 hover:bg-charcoal/5 text-charcoal rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-spring hover-spring active-spring shrink-0"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
