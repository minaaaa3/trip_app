import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-6 text-gray-900">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-50 p-4 rounded-full">
            <MailCheck className="w-12 h-12 text-indigo-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          メールを確認してください
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          入力されたメールアドレスにログイン用リンクを送信しました。<br />
          メール内のリンクをクリックして、ログインを完了してください。
        </p>

        <div className="space-y-4">
          <p className="text-sm text-gray-400 font-medium">
            ※メールが届かない場合は、迷惑メールフォルダもご確認ください。
          </p>
          
          <div className="pt-4 border-t border-gray-50">
            <Link href="/login">
              <Button variant="outline" className="w-full py-6 rounded-xl text-gray-600 hover:text-indigo-600 transition-colors">
                ログイン画面に戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
