'use client';

import { useAppStore, TaskType } from '@/store/useAppStore';

export default function TaskList() {
  const { tasks, toggleTask } = useAppStore();

  const renderSection = (type: TaskType, bgColor: string, labelColor: string) => {
    const filtered = tasks.filter(t => t.type === type);
    return (
      <div className="mb-6">
        <h4 className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${bgColor} ${labelColor} mb-3`}>
          {type}
        </h4>
        <div className="space-y-2">
          {filtered.map(task => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-white rounded-xl border border-pink-100/50 hover:scale-[1.01] transition-transform"
            >
              <label className="flex items-center gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 accent-[#F66E6D] rounded-full border-gray-300 transition-all"
                />
                <span className={task.completed ? 'line-through text-gray-400' : 'text-[#4A3E3D]'}>
                  {task.title}
                </span>
              </label>
              {task.category && (
                <span className="text-[10px] bg-orange-50 text-orange-400 px-2 py-0.5 rounded-md">
                  {task.category}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="soft-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">今日のタスク</h3>
        <button className="text-xs bg-pink-100 text-[#F66E6D] px-3 py-1 rounded-full font-medium hover:bg-pink-200 transition">
          + 追加
        </button>
      </div>
      {renderSection('Main', 'bg-[#FFF2F2]', 'text-[#F66E6D]')}
      {renderSection('Sub', 'bg-[#F2F7FF]', 'text-[#6D9EEB]')}
      {renderSection('Tiny', 'bg-[#F2FFF5]', 'text-[#6DEB8B]')}
    </div>
  );
}
