import React, { useState, type FormEvent, useRef, useEffect } from "react";
import type { TreeNode as TreeNodeType } from "./types";
import { useTreeContext } from "./context";
import {
  ChevronRight,
  File,
  Folder,
  Plus,
  Trash2,
  Edit2,
  Loader2,
} from "lucide-react";
import classNames from "classnames";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface TreeNodeProps {
  node: TreeNodeType;
}

export const TreeNode: React.FC<TreeNodeProps> = React.memo(({ node }) => {
  const {
    toggleNode,
    expandedIds,
    loadingIds,
    addNode,
    removeNode,
    updateNodeName,
  } = useTreeContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isExpanded = expandedIds.has(node.id);
  const isLoading = loadingIds.has(node.id);
  const hasChildren =
    node.hasChildren || (node.children && node.children.length > 0);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleNode(node.id);
  };

  const handleCreateFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const name = prompt("Enter new node name:");
    if (name) {
      addNode(node.id, name);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${node.name}" and all its children?`)) {
      removeNode(node.id);
    }
  };

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditName(node.name);
  };

  const submitEdit = (e: FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      updateNodeName(node.id, editName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditName(node.name);
    }
  };

  return (
    <div className="tree-node" ref={setNodeRef} style={style}>
      <div
        className={classNames("tree-node-content", { dragging: isDragging })}
        onClick={handleToggle}
        onDoubleClick={startEdit}
        {...attributes}
        {...listeners}
      >
        <span className={classNames("expand-icon", { expanded: isExpanded })}>
          {isLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : hasChildren ? (
            <ChevronRight size={16} />
          ) : (
            <span style={{ width: 16 }} />
          )}
        </span>

        <span
          className="file-icon"
          style={{ marginRight: 8, color: hasChildren ? "#60a5fa" : "#94a3b8" }}
        >
          {hasChildren ? <Folder size={18} /> : <File size={16} />}
        </span>

        {isEditing ? (
          <form
            onSubmit={submitEdit}
            style={{ flex: 1 }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={submitEdit}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 text-white border border-slate-600 rounded px-1 py-0.5 text-sm w-full"
            />
          </form>
        ) : (
          <span className="node-label">{node.name}</span>
        )}

        <div className="node-actions">
          <button
            className="action-btn"
            title="Add Child"
            onClick={handleCreateFolder}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Plus size={14} />
          </button>
          <button
            className="action-btn"
            title="Rename"
            onClick={startEdit}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Edit2 size={14} />
          </button>
          <button
            className="action-btn delete"
            title="Delete"
            onClick={handleDelete}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {isExpanded && node.children && (
        <div className="node-children">
          <SortableContext
            items={node.children.map((child) => child.id)}
            strategy={verticalListSortingStrategy}
          >
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
});

TreeNode.displayName = "TreeNode";
