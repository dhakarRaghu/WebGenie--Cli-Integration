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
const __dirname = path.dirname(__filename);
export function setBetterAuth(props) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authPath } = props;
        fs.ensureDirSync(authPath);
        fs.writeFileSync(path.join(authPath, "auth-client.ts"), `
        import { createAuthClient } from "better-auth/react"
        export const authClient = createAuthClient({
            baseURL: process.env.BETTER_AUTH_URL   // the base url of your auth server
        })

        export const { signIn, signUp, signOut, useSession } = createAuthClient()
        `);
        fs.writeFileSync(path.join(authPath, "auth.ts"), `
        import { betterAuth } from "better-auth";
        import { prismaAdapter } from "better-auth/adapters/prisma";
        import { PrismaClient } from "@prisma/client";
        
        const prisma = new PrismaClient();
        export const auth = betterAuth({
            database: prismaAdapter(prisma, {
                provider: "postgresql", // or "mysql", "postgresql", ...etc
            }),
            socialProviders: {
                google: { 
                    clientId: process.env.GOOGLE_CLIENT_ID as string, 
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
                    redirectURI: process.env.BETTER_AUTH_URL + "/api/auth/callback/google",
                }, 
                github: { 
                    clientId: process.env.GITHUB_CLIENT_ID as string, 
                    clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
                    redirectURI: process.env.BETTER_AUTH_URL + "/api/auth/callback/github",
                },
            },
        });
        `);
    });
}
