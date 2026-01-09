import { createContext, useContext } from "react";
import type { TreeNode } from "./types";

interface TreeContextType {
  data: TreeNode[];
  expandedIds: Set<string>;
  loadingIds: Set<string>;
  toggleNode: (id: string) => void;
  addNode: (parentId: string | null, name: string) => void;
  removeNode: (id: string) => void;
  updateNodeName: (id: string, newName: string) => void;
  moveNode: (activeId: string, overId: string) => void;
}

export const TreeContext = createContext<TreeContextType | undefined>(
  undefined
);

export const useTreeContext = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTreeContext must be used within a TreeProvider");
  }
  return context;
};
