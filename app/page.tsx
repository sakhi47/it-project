import KanbanBoard from "@/components/project/KanbanBoard";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <KanbanBoard />
      </div>
    </main>
  );
}
