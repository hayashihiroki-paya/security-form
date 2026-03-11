// src/app/page.tsx
// ========================================
// 危険なフォーム
// HTML の属性だけで入力を制限している
// → DevTools で簡単に突破される
// ========================================

"use client";

import { useState } from "react";

export default function DangerousForm() {
  // ========================================
  // State: 送信されたデータを保存
  // ========================================
  const [submittedData, setSubmittedData] = useState<Record<string, string> | null>(null);
  // Record<string, string> は「キーも値も文字列のオブジェクト」という意味
  // 例: { email: "test@example.com", name: "田中" }

  // ========================================
  // フォーム送信時の処理
  // ========================================
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // デフォルトの送信を止める（ページ遷移を防ぐ）
    e.preventDefault();

    // フォームからデータを取得
    // FormData はブラウザ標準の API
    const formData = new FormData(e.currentTarget);

    // FormData を普通のオブジェクトに変換
    const data = Object.fromEntries(formData) as Record<string, string>;

    // コンソールに表示（DevTools の Console タブで確認できる）
    console.log("=== 送信されるデータ ===");
    console.log(data);
    console.log("========================");

    // 画面に表示するために state を更新
    setSubmittedData(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* タイトル */}
        <h1 className="text-2xl font-bold text-center mb-2">
          お問い合わせフォーム
        </h1>
        <p className="text-center text-red-500 text-sm mb-8">
          ⚠️ 危険なフォーム（HTML属性のみ）
        </p>

        {/* ========================================
            フォーム本体
            ======================================== */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          {/* ----------------------------------------
              メールアドレス
              required: 必須入力
              type="email": メール形式のチェック（ブラウザ依存）
              ---------------------------------------- */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              placeholder="example@email.com"
            />
          </div>

          {/* ----------------------------------------
              お名前
              required: 必須入力
              maxLength: 最大50文字
              ---------------------------------------- */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              maxLength={50}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              placeholder="山田太郎"
            />
          </div>

          {/* ----------------------------------------
              お問い合わせ種別
              required: 必須選択
              ---------------------------------------- */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              お問い合わせ種別 <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">選択してください</option>
              <option value="general">一般的なお問い合わせ</option>
              <option value="support">サポート</option>
              <option value="billing">お支払いについて</option>
            </select>
          </div>

          {/* ----------------------------------------
              お問い合わせ内容
              required: 必須入力
              maxLength: 最大1000文字
              ---------------------------------------- */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              お問い合わせ内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              required
              maxLength={1000}
              rows={5}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              placeholder="お問い合わせ内容を入力してください"
            />
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            送信する
          </button>
        </form>

        {/* ========================================
            送信されたデータを表示
            ======================================== */}
        {submittedData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <h2 className="font-bold text-lg mb-2">
              📤 送信されるデータ:
            </h2>
            <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
            <p className="mt-2 text-sm text-gray-600">
              ※ 実際のサービスでは、このデータがサーバーに送信されます
            </p>
          </div>
        )}
      </div>
    </div>
  );
}