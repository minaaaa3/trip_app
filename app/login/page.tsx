import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default function LoginPage() {
  async function loginAction(formData: FormData) {
    "use server";
    try {
      await signIn("nodemailer", formData);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      console.error("Sign in error:", error);
      throw error;
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">おかえりなさい</h1>
          <p className="text-gray-500 mt-2">
            メールアドレスを入力してログインリンクを受け取りましょう
          </p>
        </div>

        <form action={loginAction} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              メールアドレス
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
          >
            ログインリンクを送信
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            ログインすることで、利用規約およびプライバシーポリシーに同意したものとみなされます。
          </p>
        </div>
      </div>
    </div>
  );
}
