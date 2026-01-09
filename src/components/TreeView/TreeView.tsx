import React, { useState } from "react";
import type { TreeViewProps, TreeNode as TreeNodeType } from "./types";
import { useTree } from "./useTree";
import { TreeContext } from "./context";
import { TreeNode } from "./TreeNode";
import { MOCK_INITIAL_DATA } from "./data";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import "./styles.css";

export const TreeView: React.FC<TreeViewProps> = ({
  initialData = MOCK_INITIAL_DATA,
}) => {
  const treeState = useTree(initialData);
  const { data, addNode, moveNode } = treeState;
  const [activeNode, setActiveNode] = useState<TreeNodeType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Find unit logic
    const findNode = (nodes: TreeNodeType[]): TreeNodeType | null => {
      for (const n of nodes) {
        if (n.id === active.id) return n;
        if (n.children) {
          const found = findNode(n.children);
          if (found) return found;
        }
      }
      return null;
    };
    setActiveNode(findNode(data));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      moveNode(active.id as string, over.id as string);
    }
    setActiveNode(null);
  };

  return (
    <TreeContext.Provider value={treeState}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="tree-view-wrapper">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-lg font-semibold text-slate-200">
              System Explorer
            </h2>
            <button
              onClick={() => {
                const name = prompt("Enter root node name:");
                if (name) addNode(null, name);
              }}
              className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded transition-colors"
            >
              <Plus size={14} /> New Root
            </button>
          </div>

          <div className="tree-view-container">
            {data.length === 0 ? (
              <div className="text-slate-500 text-center py-8 text-sm italic">
                No items. Click 'New Root' to begin.
              </div>
            ) : (
              <SortableContext
                items={data.map((n) => n.id)}
                strategy={verticalListSortingStrategy}
              >
                {data.map((node) => (
                  <TreeNode key={node.id} node={node} />
                ))}
              </SortableContext>
            )}
          </div>

          {createPortal(
            <DragOverlay>
              {activeNode ? (
                <div
                  className="tree-node-content dragging"
                  style={{
                    background: "#1e293b",
                    border: "1px solid #3b82f6",
                    borderRadius: "6px",
                  }}
                >
                  <span className="node-label" style={{ padding: "8px" }}>
                    {activeNode.name}
                  </span>
                </div>
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </div>
      </DndContext>
    </TreeContext.Provider>
  );
};
