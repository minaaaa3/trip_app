import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn, LogOut, Map } from "lucide-react";
import UserProfileHeader from "./UserProfileHeader";

export default async function Header() {
  const session = await auth();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-black text-indigo-600 tracking-tighter flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <Map size={20} strokeWidth={3} />
          </div>
          Trip Planner
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-4">
              <UserProfileHeader 
                initialName={session.user.name} 
                email={session.user.email!} 
              />
              <div className="h-4 w-[1px] bg-gray-200" />
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button variant="ghost" size="sm" type="submit" className="text-gray-500 hover:text-red-600 hover:bg-red-50">
                  <LogOut size={16} />
                </Button>
              </form>
            </div>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn();
              }}
            >
              <Button variant="default" size="sm" type="submit" className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold">
                <LogIn size={16} className="mr-2" />
                ログイン
              </Button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
