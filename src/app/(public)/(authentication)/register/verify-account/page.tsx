import Link from "next/link";
import Logo from "@/assets/svg/Logo";
import VerifyAccountForm from "@/components/form/verify-account-form";
import { Suspense } from "react";

export default function VerifyAccountPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium justify-center"
          >
            <Logo />
            <span className="font-heading">PH Healthcare</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">
            <Suspense fallback={<p>Loading...</p>}>
              <VerifyAccountForm />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/register-pic.jpg"
          alt="it is img"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

