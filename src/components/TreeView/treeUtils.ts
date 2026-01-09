import type { TreeNode } from "./types";

export const findNode = (nodes: TreeNode[], id: string): TreeNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const updateNode = (
  nodes: TreeNode[],
  id: string,
  transform: (node: TreeNode) => TreeNode
): TreeNode[] => {
  return nodes.map((node) => {
    if (node.id === id) {
      return transform(node);
    }
    if (node.children) {
      const newChildren = updateNode(node.children, id, transform);

      if (newChildren !== node.children) {
        return { ...node, children: newChildren };
      }
    }
    return node;
  });
};

export const insertNode = (
  nodes: TreeNode[],
  parentId: string | null,
  newNode: TreeNode
): TreeNode[] => {
  if (parentId === null) {
    return [...nodes, newNode];
  }

  return nodes.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newNode],
        hasChildren: true,
        isExpanded: true,
      };
    }
    if (node.children) {
      const newChildren = insertNode(node.children, parentId, newNode);
      if (newChildren !== node.children) {
        return { ...node, children: newChildren };
      }
    }
    return node;
  });
};

export const removeNode = (nodes: TreeNode[], id: string): TreeNode[] => {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.children) {
        const newChildren = removeNode(node.children, id);
        if (newChildren !== node.children) {
          return { ...node, children: newChildren };
        }
      }
      return node;
    });
};

export const moveNodeInTree = (
  nodes: TreeNode[],
  activeId: string,
  overId: string
): TreeNode[] => {
  const sourceNode = findNode(nodes, activeId);

  if (!sourceNode) return nodes;

  const isAuChild = (parent: TreeNode, childId: string): boolean => {
    if (!parent.children) return false;
    for (const child of parent.children) {
      if (child.id === childId) return true;
      if (isAuChild(child, childId)) return true;
    }
    return false;
  };
  if (sourceNode!.children && isAuChild(sourceNode!, overId)) {
    return nodes;
  }

  const treeWithoutSource = removeNode(nodes, activeId);

  const insertRelatively = (list: TreeNode[]): TreeNode[] => {
    const overIndex = list.findIndex((n) => n.id === overId);
    if (overIndex !== -1) {
      const newList = [...list];
      newList.splice(overIndex, 0, sourceNode!);
      return newList;
    }

    return list.map((node: TreeNode) => {
      if (node.children) {
        const newChildren = insertRelatively(node.children);
        if (newChildren !== node.children) {
          return { ...node, children: newChildren };
        }
      }
      return node;
    });
  };

  return insertRelatively(treeWithoutSource);
};
