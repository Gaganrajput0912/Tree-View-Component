import { useState, useCallback } from "react";
import type { TreeNode } from "./types";
import { fetchMockChildren } from "./data";
import {
  findNode,
  updateNode,
  insertNode,
  removeNode,
  moveNodeInTree,
} from "./treeUtils";

export const useTree = (initialData: TreeNode[]) => {
  const [data, setData] = useState<TreeNode[]>(initialData);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  // Toggle Expansion & Lazy Load
  const toggleNode = useCallback(
    async (id: string) => {
      const isExpanded = expandedIds.has(id);
      const newExpanded = new Set(expandedIds);

      if (isExpanded) {
        newExpanded.delete(id);
        setExpandedIds(newExpanded);
      } else {
        newExpanded.add(id);
        setExpandedIds(newExpanded);

        // Check for Lazy Load
        const node = findNode(data, id);
        if (node && node.hasChildren && !node.children && !loadingIds.has(id)) {
          setLoadingIds((prev) => new Set(prev).add(id));
          try {
            const newChildren = await fetchMockChildren(id);
            setData((prevData) =>
              updateNode(prevData, id, (n) => ({ ...n, children: newChildren }))
            );
          } finally {
            setLoadingIds((prev) => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          }
        }
      }
    },
    [data, expandedIds, loadingIds]
  );

  // CRUD: Add Node
  const addNode = useCallback((parentId: string | null, name: string) => {
    const newNode: TreeNode = {
      id: crypto.randomUUID(),
      name,
      hasChildren: false,
    };

    setData((prev) => insertNode(prev, parentId, newNode));
    if (parentId) {
      setExpandedIds((prev) => new Set(prev).add(parentId));
    }
  }, []);

  // CRUD: Remove Node
  const removeNodeHandler = useCallback((id: string) => {
    setData((prev) => removeNode(prev, id));
  }, []);

  // CRUD: Edit Node
  const updateNodeName = useCallback((id: string, newName: string) => {
    setData((prev) => updateNode(prev, id, (n) => ({ ...n, name: newName })));
  }, []);

  // DnD: Move Node
  const moveNode = useCallback((activeId: string, overId: string) => {
    if (activeId === overId) return;
    setData((prev) => moveNodeInTree(prev, activeId, overId));
  }, []);

  return {
    data,
    setData,
    expandedIds,
    loadingIds,
    toggleNode,
    addNode,
    removeNode: removeNodeHandler,
    updateNodeName,
    moveNode,
  };
};
