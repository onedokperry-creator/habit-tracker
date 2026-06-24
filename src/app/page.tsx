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
