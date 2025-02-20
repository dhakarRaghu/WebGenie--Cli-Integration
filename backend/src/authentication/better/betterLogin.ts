import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

interface Props {
    loginPath : string;
}

export async function setBetterLogin(props : Props) : Promise<void>{
    const { loginPath } = props;


    const routePath1 = path.join(loginPath, "api");
    const routePath2 = path.join(routePath1, "auth");
    const routePath3 = path.join(routePath2, "[...all]");
    fs.ensureDirSync(routePath3);
    fs.writeFileSync(
        path.join(routePath3, "route.ts"),
        `
import { auth } from "@/lib/auth"; 
import { toNextJsHandler } from "better-auth/next-js";
        
export const { POST, GET } = toNextJsHandler(auth);
        `
    );
    
    const routePath4 = path.join(loginPath, "login");
    fs.ensureDirSync(routePath4);
    fs.writeFileSync(
        path.join(routePath4, "page.tsx"),
        `
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

        `
    );
}