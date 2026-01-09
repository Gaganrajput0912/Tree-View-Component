export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[]; // Children nodes
  hasChildren?: boolean; // Indicator for lazy loading
  isExpanded?: boolean; // UI state for expansion
}

export interface TreeViewProps {
  initialData?: TreeNode[];
}
