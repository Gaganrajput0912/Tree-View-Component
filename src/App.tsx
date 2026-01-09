import { TreeView } from "./components/TreeView";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-10 pb-10">
      <h1 className="text-3xl font-bold mb-8 text-slate-100">
        Project Manager
      </h1>
      <TreeView />

      <div className="mt-8 text-slate-500 text-sm max-w-md text-center">
        <p>Instructions:</p>
        <ul className="list-disc text-left pl-6 mt-2 space-y-1">
          <li>
            Click <strong>&gt;</strong> to expand/collapse nodes.
          </li>
          <li>
            <strong>Double-click</strong> text to rename.
          </li>
          <li>Hover to see actions (Add Child, Delete).</li>
          <li>Expand "Documents" or "Images" to see lazy loading.</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
