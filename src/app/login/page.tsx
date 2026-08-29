import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-sm">
        <div className="-rotate-1 text-center">
          <p className="font-logo text-6xl leading-none text-red-500">DADÁ</p>
          <p className="font-logo text-2xl leading-none tracking-widest text-ink-900">STUDIO</p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
