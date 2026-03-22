import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">📋 Personal Task Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your tasks efficiently</p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <TaskList />
      </main>
    </div>
  );
}
