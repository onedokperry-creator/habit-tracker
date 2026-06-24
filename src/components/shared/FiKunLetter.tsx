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
