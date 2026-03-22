import { KanbanBoard } from '@/components/kanban';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Personal Task Tracker</h1>
              <p className="text-xs text-gray-500 mt-0.5">Drag tasks between columns to update status</p>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <KanbanBoard />
      </main>
    </div>
  );
}
