// src/app/rhf-form/page.tsx
// ========================================
// react-hook-form を使ったフォーム
// JavaScript でバリデーションを行う
// ========================================

"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

// ========================================
// フォームのデータ型を定義
// TypeScript で型を定義しておくと、
// タイポを防げる & 入力補完が効く
// ========================================
type FormData = {
    email: string;
    name: string;
    category: string;
    message: string;
};

export default function RHFForm() {
    // 送信されたデータを保存する state
    const [submittedData, setSubmittedData] = useState<FormData | null>(null);

    // ========================================
    // useForm フックを使う
    // <FormData> で型を指定すると、型安全になる
    // ========================================
    const {
        register,      // 入力欄を登録する関数
        handleSubmit,  // 送信を処理する関数
        formState: { errors },  // エラー情報
    } = useForm<FormData>();

    // ========================================
    // 送信処理
    // handleSubmit を通すと、バリデーションが通った
    // データだけがこの関数に渡される
    // ========================================
    const onSubmit = (data: FormData) => {
        console.log("=== バリデーション通過！送信されるデータ ===");
        console.log(data);
        console.log("============================================");
        setSubmittedData(data);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-md mx-auto">
                {/* タイトル */}
                <h1 className="text-2xl font-bold text-center mb-2">
                    お問い合わせフォーム
                </h1>
                <p className="text-center text-blue-500 text-sm mb-8">
                    react-hook-form 版
                </p>

                {/* ========================================
            フォーム本体
            onSubmit に handleSubmit(onSubmit) を渡す
            ======================================== */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                    {/* ----------------------------------------
              メールアドレス
              register でフィールドを登録
              第2引数でバリデーションルールを指定
              ---------------------------------------- */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            メールアドレス <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "メールアドレスは必須です",
                            })}
                            className={`shadow border rounded w-full py-2 px-3 text-gray-700${errors.email ? "border-red-500" : ""
                                }`}
                            placeholder="example@email.com"
                        />
                        {/* エラーメッセージを表示 */}
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* ----------------------------------------
              お名前
              required: 必須
              maxLength: 最大文字数
              ---------------------------------------- */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            お名前 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register("name", {
                                required: "お名前は必須です",
                                maxLength: {
                                    value: 50,
                                    message: "50文字以内で入力してください",
                                },
                            })}
                            className={`shadow border rounded w-full py-2 px-3 text-gray-700${errors.name ? "border-red-500" : ""
                                }`}
                            placeholder="山田太郎"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name.message}
                            </p>
                        )}
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
                            {...register("category", {
                                required: "種別を選択してください",
                            })}
                            className={`shadow border rounded w-full py-2 px-3 text-gray-700${errors.category ? "border-red-500" : ""
                                }`}
                        >
                            <option value="">選択してください</option>
                            <option value="general">一般的なお問い合わせ</option>
                            <option value="support">サポート</option>
                            <option value="billing">お支払いについて</option>
                        </select>
                        {errors.category && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.category.message}
                            </p>
                        )}
                    </div>

                    {/* ----------------------------------------
              お問い合わせ内容
              ---------------------------------------- */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            お問い合わせ内容 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            {...register("message", {
                                required: "お問い合わせ内容は必須です",
                                maxLength: {
                                    value: 1000,
                                    message: "1000文字以内で入力してください",
                                },
                            })}
                            rows={5}
                            className={`shadow border rounded w-full py-2 px-3 text-gray-700${errors.message ? "border-red-500" : ""
                                }`}
                            placeholder="お問い合わせ内容を入力してください"
                        />
                        {errors.message && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.message.message}
                            </p>
                        )}
                    </div>

                    {/* 送信ボタン */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        送信する
                    </button>
                </form>

                {/* 送信されたデータを表示 */}
                {submittedData && (
                    <div className="bg-green-50 border border-green-200 rounded p-4">
                        <h2 className="font-bold text-lg mb-2">
                            ✅ バリデーション通過！送信されるデータ:
                        </h2>
                        <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-auto text-sm">
                            {JSON.stringify(submittedData, null, 2)}
                        </pre>
                    </div>
                )}

                {/* 他のフォームへのリンク */}
                <div className="mt-4 text-center">
                    <a href="/" className="text-blue-500 hover:underline text-sm">
                        ← 危険なフォームに戻る
                    </a>
                    <a href="/zod-form" className="text-red-500 hover:underline text-sm">
                        ← zod 版
                    </a>
                </div>
            </div>
        </div>
    );
}