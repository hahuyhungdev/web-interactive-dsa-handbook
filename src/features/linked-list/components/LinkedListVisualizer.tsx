import { useState } from 'react';
import type { NodeItem } from '@/shared/types';

interface LinkedListVisualizerProps {
  list: NodeItem[];
  onListChange: (newList: NodeItem[], insertedId: string | null) => void;
  currentNodesState: NodeItem[];
}

export function LinkedListVisualizer({
  list,
  onListChange,
  currentNodesState
}: LinkedListVisualizerProps) {
  const [insertVal, setInsertVal] = useState('');
  const [deleteVal, setDeleteVal] = useState('');
  const [warning, setWarning] = useState('');

  const handleInsert = () => {
    const trimmed = insertVal.trim();
    if (!trimmed) {
      setWarning('Value cannot be empty');
      return;
    }
    setWarning('');

    const newNode: NodeItem = {
      id: Date.now().toString(),
      value: trimmed,
      status: 'inserted'
    };

    let newList: NodeItem[];
    if (trimmed === '42') {
      newList = [newNode, ...list];
    } else {
      newList = [...list, newNode];
    }

    onListChange(newList, newNode.id);
    setInsertVal('');
  };

  const handleDelete = () => {
    const trimmed = deleteVal.trim();
    if (!trimmed) {
      return;
    }

    const index = list.findIndex(node => node.value === trimmed);
    if (index === -1) {
      return;
    }

    const newList = list.filter((_, idx) => idx !== index);
    onListChange(newList, null);
    setDeleteVal('');
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
          <div className="flex gap-2">
            <input
              id="input-list-val"
              type="text"
              placeholder="e.g. 42 (head), 99 (tail)"
              value={insertVal}
              onChange={(e) => {
                setInsertVal(e.target.value);
                if (warning) setWarning('');
              }}
              className="flex-1 px-3 py-2 text-base border border-charcoal/20 bg-paper-light rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal"
            />
            <button
              id="btn-list-insert"
              onClick={handleInsert}
              className="px-4 py-2 bg-coral hover:bg-coral-dark text-paper rounded-xl font-sans text-base font-bold uppercase tracking-wider shadow-sm transition-all duration-300 shrink-0"
            >
              Insert
            </button>
          </div>
          {warning && (
            <p id="list-validation-warning" className="text-red-500 text-base font-sans font-semibold">
              {warning}
            </p>
          )}
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
              placeholder="e.g. 10"
              value={deleteVal}
              onChange={(e) => setDeleteVal(e.target.value)}
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
          currentNodesState.map((node, idx) => (
            <div key={node.id} className="flex items-center gap-4 shrink-0">
              {/* Node Card */}
              <div
                className={`list-node w-16 h-16 rounded-full border flex flex-col items-center justify-center font-mono font-bold shadow-sm transition-all duration-300 ${
                  node.status === 'traversing'
                    ? 'bg-amber-400 border-amber-500 text-charcoal'
                    : node.status === 'inserted'
                    ? 'bg-emerald-500 border-emerald-600 text-paper'
                    : node.status === 'deleted'
                    ? 'bg-red-500 border-red-600 text-paper'
                    : node.status === 'active'
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'bg-paper border-charcoal/20 text-charcoal'
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
