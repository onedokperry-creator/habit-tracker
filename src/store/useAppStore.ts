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
