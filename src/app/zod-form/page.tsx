// src/app/zod-form/page.tsx
// ========================================
// react-hook-form + zod で守られたフォーム
// これが「安全なフォーム」の完成形
// ========================================

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

// ========================================
// zod でスキーマを定義
// ここでバリデーションルールを一元管理
// ========================================
const formSchema = z.object({
    // メールアドレス
    // - 文字列であること
    // - 1文字以上（空文字禁止）
    // - メール形式であること
    email: z
        .string()
        .min(1, "メールアドレスは必須です")
        .email("正しいメール形式で入力してください"),

    // 名前
    // - 文字列であること
    // - 1文字以上（空文字禁止）
    // - 50文字以下
    name: z
        .string()
        .min(1, "お名前は必須です")
        .max(50, "50文字以内で入力してください"),

    // 種別
    // - 許可された値のみ（enum）
    // - これで DevTools で追加した値は弾かれる！
    category: z.enum(["general", "support", "billing"], {
        message: "正しい種別を選択してください",
    }),

    //   電話番号
    // - 許可された文字列（数字、１０～１１桁）のみ
    phone: z
        .string()
        .regex(/^[0-9]{10,11}$/, "10〜11桁の数字で入力してください")
        .optional()         // 任意入力
        .or(z.literal("")), // 空文字も OK にする

    // 内容
    // - 文字列であること
    // - 1文字以上（空文字禁止）
    // - 1000文字以下
    message: z
        .string()
        .min(1, "お問い合わせ内容は必須です")
        .max(1000, "1000文字以内で入力してください"),
});

// ========================================
// スキーマから型を自動生成
// z.infer を使うと、スキーマから TypeScript の型を作れる
// 手動で型を書く必要がない！
// ========================================
type FormData = z.infer<typeof formSchema>;
// これで FormData は以下の型になる:
// {
//   email: string;
//   name: string;
//   category: "general" | "support" | "billing";
//   message: string;
// }

export default function ZodForm() {
    const [submittedData, setSubmittedData] = useState<FormData | null>(null);

    // ========================================
    // useForm に zodResolver を渡して連携
    // これで zod のスキーマでバリデーションされる
    // ========================================
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),  // ← ここがポイント！
    });

    const onSubmit = (data: FormData) => {
        console.log("=== zod バリデーション通過！送信されるデータ ===");
        console.log(data);
        console.log("================================================");
        setSubmittedData(data);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-md mx-auto">
                {/* タイトル */}
                <h1 className="text-2xl font-bold text-center mb-2">
                    お問い合わせフォーム
                </h1>
                <p className="text-center text-green-600 text-sm mb-8">
                    ✅ react-hook-form + zod 版（安全）
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                    {/* メールアドレス */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            メールアドレス <span className="text-red-500">*</span>
                        </label>
                        {/* type="text" にしている理由:
                type="email" にすると、ブラウザのチェックと zod のチェックが
                両方走ってしまう。zod に任せるために text にする */}
                        <input
                            type="text"
                            {...register("email")}
                            className={`shadow border rounded w-full py-2 px-3 text-gray-700${errors.email ? "border-red-500" : ""
                                }`}
                            placeholder="example@email.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* お名前 */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            お名前 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register("name")}
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

                    {/* お問い合わせ種別 */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            お問い合わせ種別 <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register("category")}
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

                    {/* 電話番号（任意） */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            電話番号（任意）
                        </label>
                        <input
                            type="text"
                            {...register("phone")}
                            className={`shadow border rounded w-full py-2 px-3 text-gray-700${errors.phone ? "border-red-500" : ""
                                }`}
                            placeholder="09012345678(ハイフンなし)"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    {/* お問い合わせ内容 */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            お問い合わせ内容 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            {...register("message")}
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
                        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        送信する
                    </button>
                </form>

                {/* 送信されたデータを表示 */}
                {submittedData && (
                    <div className="bg-green-50 border border-green-200 rounded p-4">
                        <h2 className="font-bold text-lg mb-2">
                            ✅ zod バリデーション通過！送信されるデータ:
                        </h2>
                        <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-auto text-sm">
                            {JSON.stringify(submittedData, null, 2)}
                        </pre>
                    </div>
                )}

                {/* 他のフォームへのリンク */}
                <div className="mt-4 text-center space-x-4">
                    <a href="/" className="text-red-500 hover:underline text-sm">
                        ← 危険なフォーム
                    </a>
                    <a href="/rhf-form" className="text-blue-500 hover:underline text-sm">
                        react-hook-form 版 →
                    </a>
                </div>
            </div>
        </div>
    );
}