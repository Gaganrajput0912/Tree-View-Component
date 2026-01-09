import type { TreeNode } from "./types";

// Simulate API delay
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const MOCK_INITIAL_DATA: TreeNode[] = [
  {
    id: "root-1",
    name: "Documents",
    hasChildren: true,
    children: [
      { id: "child-1-1", name: "Project Plans", hasChildren: false },
      { id: "child-1-2", name: "Design Assets", hasChildren: true },
    ],
  },
  {
    id: "root-2",
    name: "Images",
    hasChildren: true,
  },
  {
    id: "root-3",
    name: "System",
    hasChildren: false,
  },
];

export const fetchMockChildren = async (
  parentId: string
): Promise<TreeNode[]> => {
  await delay(800); // Simulate network latency

  return [
    {
      id: `${parentId}-new-1`,
      name: `New Item 1 (${parentId})`,
      hasChildren: false,
    },
    {
      id: `${parentId}-new-2`,
      name: `New Item 2 (${parentId})`,
      hasChildren: true,
    },
  ];
};
