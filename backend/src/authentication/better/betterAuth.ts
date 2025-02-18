import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Props {
    authPath : string;
    db : string;
}

export async function setBetterAuth(props : Props) : Promise<void>{
    const { authPath , db } = props;
    fs.ensureDirSync(authPath);
    fs.writeFileSync(
        path.join(authPath, "auth-client.ts"),
        `
        import { createAuthClient } from "better-auth/react"
        export const authClient = createAuthClient({
            baseURL: process.env.BETTER_AUTH_URL   // the base url of your auth server
        })

        export const { signIn, signUp, signOut, useSession } = createAuthClient()
        `
    );
    if(db === "Prisma"){
        fs.writeFileSync(
            path.join(authPath, "auth.ts"),
            `
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
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
            `
        )
    }
    else if(db === "drizzle"){
        fs.writeFileSync(
            path.join(authPath, "auth.ts"),
            `
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; // your drizzle instance
            
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
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
            `
        )
        fs.writeFileSync(
            path.join(authPath, "db.ts"),
            `
import { neon, neonConfig } from "@neondatabase/serverless"; // ✅ Correct import
import { drizzle } from "drizzle-orm/neon-http"; // ✅ Using neon-http for HTTP pooling

// neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql); 
            `
        )
    }
    else{
        fs.writeFileSync(
            path.join(authPath, "auth.ts"),
            ``)
    }
   
}