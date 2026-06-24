# 🍓 ふぃーくんといちご畑の習慣化アプリ - フロントエンド実装ベース

添付されたUIデザインカンプの世界観（パステルトーン、豊富な余白、手書き風の温かみ）を再現するための、Next.js (App Router) + TypeScript + Tailwind CSS + Zustand のコア実装一式です。

---

## 🏗️ ディレクトリ構成 (App Router)

```text
src/
├── app/
│   ├── layout.tsx         # 全体レイアウト（PWA設定、フォント読み込み）
│   └── page.tsx           # ホーム画面（カンプのメインレイアウト）
├── components/
│   └── shared/            # アプリ固有の共通UI
│       ├── FiKunLetter.tsx # ふぃーくんのおてがみ
│       └── TaskList.tsx    # Main/Sub/Tiny タスク一覧
├── store/
│   └── useAppStore.ts     # Zustandによる状態管理（タスク・いちご・気分）
└── styles/
    └── globals.css        # Tailwind & カスタムカラー・フォント設定
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

@layer base {
  body {
    background-color: #FFEEF3; /* 全体のベース背景（淡いピンク） */
    color: #4A3E3D;            /* 視認性を保ちつつ優しいダークブラウン */
    font-family: 'M PLUS Rounded 1c', 'Noto Sans JP', sans-serif;
  }
}

/* カンプを再現するふんわりとした影と角丸のカスタムクラス */
.soft-card {
  background-color: #FFFFFF;
  border-radius: 24px;
  box-shadow: 0 4px 20px -2px rgba(246, 110, 109, 0.05);
  border: 1px solid rgba(246, 110, 109, 0.1);
}
import { create } from 'zustand';

export type TaskType = 'Main' | 'Sub' | 'Tiny';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  completed: boolean;
  category?: string;
}

export type MoodType = '💪がんばる' | '🌱ゆるく' | '😴おやすみ';

interface AppState {
  tasks: Task[];
  strawberryCount: number;
  streakDays: number;
  currentMood: MoodType;
  setMood: (mood: MoodType) => void;
  toggleTask: (id: string) => void;
  addStrawberry: (amount: number) => void;
  getFiKunMessage: () => string;
  getStrawberryStage: () => string;
}

export const useAppStore = create<AppState>((set, get) => ({
  tasks: [
    { id: '1', title: 'ベリーダンス基礎練習 20分', type: 'Main', completed: false, category: 'ダンス' },
    { id: '2', title: 'ダイエット：夜ごはん記録', type: 'Main', completed: false, category: 'ダイエット' },
    { id: '3', title: 'TOEIC 単語 20分', type: 'Sub', completed: false, category: 'TOEIC' },
    { id: '4', title: 'ストレッチ 5分', type: 'Tiny', completed: true, category: '美容・健康' },
  ],
  strawberryCount: 8,
  streakDays: 3,
  currentMood: '🌱ゆるく',

  setMood: (mood) => set({ currentMood: mood }),

  toggleTask: (id) => set((state) => {
    const updatedTasks = state.tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    const targetTask = state.tasks.find(t => t.id === id);
    const strawberryDiff = (targetTask && !targetTask.completed) ? 1 : 0;

    return {
      tasks: updatedTasks,
      strawberryCount: state.strawberryCount + strawberryDiff
    };
  }),

  addStrawberry: (amount) => set((state) => ({ strawberryCount: state.strawberryCount + amount })),

  getStrawberryStage: () => {
    const count = get().strawberryCount;
    if (count >= 100) return '特別な畑 👑';
    if (count >= 51) return 'いちご畑 🍓';
    if (count >= 31) return '花 🌸';
    if (count >= 11) return '葉っぱ 🌿';
    return '芽 🌱';
  },

  getFiKunMessage: () => {
    const { tasks, streakDays, currentMood } = get();
    const remainingMain = tasks.filter(t => t.type === 'Main' && !t.completed).length;

    if (remainingMain === 0) return '今日のメインタスク達成！すごすぎるよ〜！完璧！';
    if (remainingMain === 1) return 'あとひとつで目標達成だよ！ふぃーくんも応援してる！';
    if (currentMood === '😴おやすみ') return '今日はゆっくり休む日。Tinyタスクだけでも十分えらいよ。';
    return `${streakDays}日連続でがんばってるね！一歩ずつ夢につながってるよ。`;
  }
}));
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
'use client';

import { useAppStore } from '@/store/useAppStore';

export default function FiKunLetter() {
  const { getFiKunMessage } = useAppStore();

  return (
    <div className="soft-card p-6 bg-gradient-to-br from-white to-[#FFF9FA] relative overflow-hidden">
      <span className="absolute top-3 left-3 bg-red-100 text-[#F66E6D] text-[10px] font-bold px-2 py-0.5 rounded-full">
        New!
      </span>
      
      <div className="mt-4 text-center">
        <div className="w-20 h-20 bg-pink-50 rounded-full mx-auto mb-3 flex items-center justify-center text-xs text-pink-300 border border-pink-100">
          🐰 [ふぃーくん]
        </div>
        
        <p className="text-xs text-gray-400 mb-1 text-left">みおさんへ</p>
        <div className="bg-pink-50/40 p-4 rounded-2xl text-sm leading-relaxed text-[#4A3E3D] text-left border border-dashed border-pink-200">
          {getFiKunMessage()}
        </div>
        
        <button className="mt-4 w-full bg-[#F66E6D] text-white text-sm font-medium py-2.5 rounded-full hover:bg-[#e25b5a] transition shadow-sm shadow-pink-100">
          おてがみを読む
        </button>
      </div>
    </div>
  );
}
import TaskList from '@/components/shared/TaskList';
import FiKunLetter from '@/components/shared/FiKunLetter';

export default function HomePage() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* ヘッダー */}
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-xl font-bold text-[#4A3E3D] flex items-center justify-center md:justify-start gap-2">
          <span>🍓</span> ふぃーくんといちご畑の習慣化アプリ
        </h1>
        <p className="text-xs text-gray-400 mt-1">シンプルでかわいい、うさぎのふぃーくんと一緒に目標を育てるWEBアプリ</p>
      </header>

      {/* 3カラムレイアウト */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左カラム */}
        <div className="space-y-6">
          <div className="soft-card p-6 bg-white">
            <h2 className="font-bold text-base mb-1">こんにちは、みおさん</h2>
            <p className="text-xs text-gray-500">今日もいっしょにがんばろうね！🐰</p>
          </div>
          <TaskList />
        </div>

        {/* 中カラム */}
        <div className="space-y-6">
          <div className="soft-card p-6 text-center">
            <h3 className="font-bold text-xs text-gray-400 mb-2">ポモドーロタイマー</h3>
            <div className="text-4xl font-mono font-bold text-[#F66E6D] my-4">25:00</div>
            <button className="bg-[#F66E6D] text-white px-6 py-1.5 rounded-full text-xs font-medium">
              スタート
            </button>
          </div>
        </div>

        {/* 右カラム */}
        <div className="space-y-6">
          <FiKunLetter />
        </div>
      </div>
    </main>
  );
}
