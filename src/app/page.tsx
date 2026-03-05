// src/app/page.tsx
// ========================================
// 事前課題: トップページ
// ========================================

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          セキュリティ講座
        </h1>
        <p className="text-gray-600 mb-2">
          事前課題が完了しました！
        </p>
        <p className="text-sm text-gray-400">
          作成者: F_DEV18_林弘基
        </p>
      </div>
    </div>
  );
}