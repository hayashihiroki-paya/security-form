// app/register/page.tsx
// ========================================
// 会員登録フォーム（クロスフィールドバリデーション）
// ========================================

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

// ========================================
// スキーマ定義
// ========================================
const registerSchema = z
  .object({
    // メールアドレス
    email: z
      .string()
      .min(1, "メールアドレスは必須です")
      .email("正しいメール形式で入力してください"),

    // パスワード
    password: z
      .string()
      .min(8, "8文字以上で入力してください")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
        "英大文字・英小文字・数字を含めてください"
      ),

    // パスワード確認
    confirmPassword: z.string(),

    // お問い合わせ種別
    contactType: z.enum(["email", "phone", "none"], {
      message: "連絡方法を選択してください",
    }),

    // 電話番号（contactType が phone の場合に必須）
    phone: z.string().optional(),
  })
  // パスワード一致チェック
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  })
  // 条件付き必須: phone 選択時は電話番号必須
  .refine(
    (data) => {
      if (data.contactType === "phone") {
        return data.phone && /^[0-9]{10,11}$/.test(data.phone);
      }
      return true;
    },
    {
      message: "電話番号を正しく入力してください",
      path: ["phone"],
    }
  );

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [submittedData, setSubmittedData] = useState<RegisterFormData | null>(
    null
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // contactType を監視（条件付き表示に使う）
  const contactType = watch("contactType");

  const onSubmit = (data: RegisterFormData) => {
    console.log("=== 登録データ ===");
    console.log(data);
    setSubmittedData(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">会員登録</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          {/* メールアドレス */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("email")}
              className={`shadow border rounded w-full py-2 px-3${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* パスワード */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              パスワード <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("password")}
              className={`shadow border rounded w-full py-2 px-3${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              8文字以上、英大文字・英小文字・数字を含む
            </p>
          </div>

          {/* パスワード確認 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              パスワード（確認） <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className={`shadow border rounded w-full py-2 px-3${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* 連絡方法 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              ご希望の連絡方法 <span className="text-red-500">*</span>
            </label>
            <select
              {...register("contactType")}
              className={`shadow border rounded w-full py-2 px-3${
                errors.contactType ? "border-red-500" : ""
              }`}
            >
              <option value="">選択してください</option>
              <option value="email">メール</option>
              <option value="phone">電話</option>
              <option value="none">連絡不要</option>
            </select>
            {errors.contactType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contactType.message}
              </p>
            )}
          </div>

          {/* 電話番号（phone 選択時のみ表示） */}
          {contactType === "phone" && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                電話番号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("phone")}
                className={`shadow border rounded w-full py-2 px-3${
                  errors.phone ? "border-red-500" : ""
                }`}
                placeholder="09012345678"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                ハイフンなしで入力してください
              </p>
            </div>
          )}

          {/* 送信ボタン */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            登録する
          </button>
        </form>

        {/* 送信結果 */}
        {submittedData && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h2 className="font-bold text-lg mb-2">✅ 登録データ:</h2>
            <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}