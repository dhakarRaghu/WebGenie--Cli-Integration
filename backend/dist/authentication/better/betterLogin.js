var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
export function setBetterLogin(props) {
    return __awaiter(this, void 0, void 0, function* () {
        const { loginPath } = props;
        const routePath1 = path.join(loginPath, "api");
        const routePath2 = path.join(routePath1, "auth");
        const routePath3 = path.join(routePath2, "[...all]");
        fs.ensureDirSync(routePath3);
        fs.writeFileSync(path.join(routePath3, "route.ts"), `
import { auth } from "@/lib/auth"; 
import { toNextJsHandler } from "better-auth/next-js";
        
export const { POST, GET } = toNextJsHandler(auth);
        `);
        fs.writeFileSync(path.join(loginPath, "page.tsx"), `
    import Image from "next/image";
    import Link from "next/link";


    export default async function Home () {
    return (
        <main className="relative min-h-screen flex flex-col bg-gradient-to-b from-black via-zinc-900 to-zinc-800 text-white">
        <nav className="flex items-center justify-between py-4 px-8 bg-black bg-opacity-90 shadow-sm">
            <div className="flex items-center space-x-2">
            <Image
                src="/globe.svg"
                alt="WebGenie Logo"
                width={40}
                height={40}
            />
            <span className="text-xl font-bold tracking-wide">WebGenie</span>
            </div>
            <div>
            <Link
                href="/login"
                className="px-4 py-2 font-semibold border border-white rounded hover:bg-white hover:text-black transition"
            >
                Sign In
            </Link>
            </div>
        </nav>

        <section className="flex flex-col items-center justify-center flex-grow text-center p-6">
            <div className="max-w-2xl">
            <div className="mx-auto w-40 h-40  mb-4 relative">
                <Image
                src="/vercel.svg"
                alt="Next.js Logo"
                layout="fill"
                objectFit="contain"
                />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-gray-100">
                Welcome to <span className="text-blue-400">WebGenie</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 px-4 md:px-0 text-gray-300">
                Your project has been successfully generated! Build faster with{" "}
                <strong>Next.js</strong>, <strong>Prisma</strong>, and{" "}
                <strong>NextAuth</strong>—all set up and ready to go.
            </p>
            <div className="space-x-4">
                <Link
                href="/docs"
                className="inline-block px-6 py-2 text-lg font-medium bg-zinc-700 rounded hover:bg-zinc-600 transition"
                >
                Read Docs
                </Link>
                <Link
                href="/dashboard"
                className="inline-block px-6 py-2 text-lg font-medium bg-zinc-700 rounded hover:bg-zinc-600 transition"
                >
                Go to Dashboard
                </Link>
            </div>
            <p className="text-sm text-gray-400 mt-6">
                Edit{" "}
                <code className="bg-zinc-700 px-1 py-0.5 rounded">
                pages/index.tsx
                </code>{" "}
                to customize this page.
            </p>
            </div>
        </section>

        <footer className="w-full py-4 text-center bg-black bg-opacity-90">
            <p className="text-sm text-gray-400">
            © 2025 WebGenie · Built with Next.js ·{" "}
            <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
            >
                Deployed on Vercel
            </a>
            </p>
        </footer>
        </main>
    );
    }
        `);
        const routePath4 = path.join(loginPath, "login");
        fs.ensureDirSync(routePath4);
        fs.writeFileSync(path.join(routePath4, "page.tsx"), `
"use client"; // Marking as a client-side component
import { useState } from "react";
import { signIn } from "@/lib/auth-client"; // Import from BetterAuth
import { Github, Chrome, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider,
        callbackURL: "/", // Redirect after successful login
      });
    } catch (error) {
      console.error("OAuth sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black via-zinc-900 to-zinc-800">
      <Card className="w-full max-w-md p-8 bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl rounded-lg">
        <div className="flex flex-col items-center space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-white">Welcome back</h1>
            <p className="text-sm text-gray-300">
              Sign in to your account to continue
            </p>
          </div>

          {/* OAuth Providers */}
          <div className="w-full space-y-4">
            <div className="grid gap-3">
              {/* GitHub */}
              <Button
                variant="outline"
                className="w-full bg-black/40 text-gray-200 hover:bg-black/60 border-white/20"
                onClick={() => handleOAuthSignIn("github")}
                disabled={isLoading}
                aria-label="Continue with GitHub"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )}
                Continue with GitHub
              </Button>

              {/* Google */}
              <Button
                variant="outline"
                className="w-full bg-black/40 text-gray-200 hover:bg-black/60 border-white/20"
                onClick={() => handleOAuthSignIn("google")}
                disabled={isLoading}
                aria-label="Continue with Google"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Chrome className="mr-2 h-4 w-4" />
                )}
                Continue with Google
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

        `);
    });
}
