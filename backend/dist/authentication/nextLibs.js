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
export function setNextAuthLibs(props) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authPath } = props;
        fs.ensureDirSync(authPath);
        fs.writeFileSync(path.join(authPath, "db.ts"), `
            import { PrismaClient } from "@prisma/client";
            import "server-only";

            declare global {
                // eslint-disable-next-line no-var, no-unused-vars
                var cachedPrisma: PrismaClient;
            }

            export let prisma: PrismaClient;
            if (process.env.NODE_ENV === "production") {
                prisma = new PrismaClient();
            } else {
                if (!global.cachedPrisma) {
                global.cachedPrisma = new PrismaClient();
                }
                prisma = global.cachedPrisma;
            }
            `);
        fs.writeFileSync(path.join(authPath, "auth.ts"), `
        import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth"
        import { PrismaAdapter } from "@next-auth/prisma-adapter"
        import GoogleProvider from "next-auth/providers/google"
        import GithubProvider from "next-auth/providers/github"
        import {prisma} from "./db"

        declare module "next-auth" {
            interface Session extends DefaultSession {
            user: {
                id: string
            } & DefaultSession["user"]
            }
        }

        declare module "next-auth/jwt" {
            interface JWT {
            id: string
            }
        }

        export const authOptions: NextAuthOptions = {
            session: {
            strategy: "jwt",
            },
            callbacks: {
            async signIn({ user, account }) {
                try {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                })

                if (existingUser) {
                    const existingAccount = await prisma.account.findFirst({
                    where: {
                        userId: existingUser.id,
                        provider: account?.provider,
                        providerAccountId: account?.providerAccountId,
                    },
                    })

                    if (!existingAccount && account) {
                    await prisma.account.create({
                        data: {
                        userId: existingUser.id,
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                        type: account.type,
                        access_token: account.access_token,
                        refresh_token: account.refresh_token,
                        expires_at: account.expires_at,
                        token_type: account.token_type,
                        scope: account.scope,
                        id_token: account.id_token,
                        session_state: account.session_state,
                        },
                    })
                    }
                }

                return true
                } catch (error) {
                console.error("Error during sign-in:", error)
                return false
                }
            },
            async jwt({ token, user }) {
                if (user) {
                token.id = user.id
                }
                return token
            },
            async session({ session, token }) {
                if (token && session.user) {
                session.user.id = token.id
                }
                return session
            },
            },
            adapter: PrismaAdapter(prisma),
            providers: [
            GithubProvider({
                clientId: process.env.GITHUB_CLIENT_ID!,
                clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            }),
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            }),
            ],
            pages: {
            signIn: "/login",
            },
            secret: process.env.NEXTAUTH_SECRET,
        }

        export const getAuthSession = () => {
            return getServerSession(authOptions);
        };
            `);
    });
}
