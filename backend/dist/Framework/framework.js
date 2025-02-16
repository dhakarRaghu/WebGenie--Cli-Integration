var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { setPrismaNextAuth } from "../database/nextauthPrisma.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));
export default function welcome() {
    return __awaiter(this, void 0, void 0, function* () {
        const rainbowTitle = chalkAnimation.rainbow("What framework do you want? \n");
        yield sleep(500);
        rainbowTitle.stop(); // Stop the animation
        const { name, projectName, projectFrame, auth } = yield inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Please enter your name:",
            },
            {
                type: "input",
                name: "projectName",
                message: "Please enter your projectName:",
            },
            {
                type: "list",
                name: "projectFrame",
                message: "Please choose a project framework:",
                choices: ["Nextjs", "T3-app", "React using Vite", "Angular"],
            },
            {
                type: "list",
                name: "auth",
                message: "Do you want authentication?",
                choices: (answers) => answers.projectFrame === "Nextjs" ? ["NextAuth", "None"] : ["None"],
                default: "None",
            },
        ]);
        console.log(chalk.green(`\nWelcome, ${name}! Let's get started! 🚀`));
        try {
            if (projectFrame === "Nextjs") {
                console.log(chalk.green(`\nYou chose Nextjs! 🚀`));
                execSync(`npx create-next-app ${projectName}`, { stdio: "inherit" });
                if (auth === "NextAuth") {
                    console.log(chalk.yellow("\nSetting up NextAuth... ⏳"));
                    yield setPrismaNextAuth({ projectName });
                    // Install dependencies
                    execSync(`cd ${projectName} && npm install next-auth @prisma/client @next-auth/prisma-adapter`, { stdio: "inherit" });
                    // Create necessary files
                    const up = projectName + "/src";
                    const authPath = path.join(process.cwd(), up, "lib");
                    fs.ensureDirSync(authPath);
                    fs.writeFileSync(path.join(authPath, "db.ts"), `import { PrismaClient } from "@prisma/client";\n
                    declare global {\n var prisma: PrismaClient | undefined;\n }\n
                    export const prisma = global.prisma || new PrismaClient();\n
                    if (process.env.NODE_ENV !== "production") {\n global.prisma = prisma;\n }`);
                    fs.writeFileSync(path.join(authPath, "auth.ts"), `import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
                    import { PrismaAdapter } from "@next-auth/prisma-adapter";
                    import GoogleProvider from "next-auth/providers/google";
                    import GithubProvider from "next-auth/providers/github";
                    import { prisma } from "./db";\n
                    declare module "next-auth" {\n
                      interface Session extends DefaultSession {\n
                        user: { id: string; credits: number } & DefaultSession["user"];
                      }\n
                    }\n
                    declare module "next-auth/jwt" {\n
                      interface JWT {\n
                        id: string;\n
                        credits: number;\n
                      }\n
                    }\n
                    export const authOptions: NextAuthOptions = {
                      session: { strategy: "jwt" },
                      callbacks: {
                        async jwt({ token, user }) {
                          if (user) {
                            token.id = user.id;
                            token.credits = (user as any).credits || 0;
                          }
                          return token;
                        },
                        async session({ session, token }) {
                          if (token && session.user) {
                            session.user.id = token.id;
                            session.user.credits = token.credits;
                          }
                          return session;
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
                      pages: { signIn: "/login" },
                      secret: process.env.NEXTAUTH_SECRET,
                    };
                    export const getAuthSession = () => getServerSession(authOptions);`);
                    console.log(chalk.green("\n✅ NextAuth setup complete!\n"));
                }
            }
            else if (projectFrame === "T3-app") {
                console.log(chalk.green(`\nYou chose T3-app! 🚀`));
                execSync(`npx create-t3-app ${projectName}`, { stdio: "inherit" });
            }
            else if (projectFrame === "React using Vite") {
                console.log(chalk.green(`\nYou chose React! 🚀`));
                execSync(`npx create-vite ${projectName} --template react`, { stdio: "inherit" });
            }
            else if (projectFrame === "Angular") {
                console.log(chalk.green(`\nYou chose Angular! 🚀`));
                execSync(`npx @angular/cli new ${projectName}`, { stdio: "inherit" });
            }
            console.log(chalk.green(`\n✅ Project "${projectName}" is ready!\n`));
        }
        catch (error) {
            console.error(chalk.red("\n❌ Error creating the project: "), error);
        }
    });
}
// import inquirer from "inquirer";
// import chalk from "chalk";
// import chalkAnimation from "chalk-animation";
// import { execSync } from "child_process";
// import fs from "fs-extra";
// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const sleep = (ms: number = 2000) => new Promise((resolve) => setTimeout(resolve, ms));
// interface PromptAnswers {
//     name: string;
//     projectName: string;
//     projectFrame: "Nextjs" | "T3-app" | "React using Vite" | "Angular" | "None";
// }
// export default async function welcome(): Promise<boolean> {
//     const rainbowTitle = chalkAnimation.rainbow("What framework do you want? \n");
//     await sleep(500);
//     rainbowTitle.stop(); // Stop the animation
//     const { name } = await inquirer.prompt<{ name: string }>([
//         {
//             type: "input",
//             name: "name",
//             message: "Please enter your name:",
//         },
//     ]);
//     const { projectName } = await inquirer.prompt<{ projectName: string }>([
//         {
//             type: "input",
//             name: "projectName",
//             message: "Please enter your projectName:",
//         },
//     ]);
//     const { projectFrame } = await inquirer.prompt<{ projectFrame: "Nextjs" | "T3-app" | "React using Vite" | "Angular" | "None"}>([
//         {
//             type: "list",
//             name: "projectFrame",
//             message: "Please choose a project framework:",
//             choices: ["Nextjs", "T3-app", "React using Vite", "Angular" , "None"],
//         },
//     ]);
//     console.log(chalk.green(`\nWelcome, ${name}! Let's get started! 🚀`));
//     try {
//         if (projectFrame === "Nextjs") {
//             console.log(chalk.green(`\nYou chose Nextjs! 🚀`));
//             execSync(`npx create-next-app ${projectName}`, { stdio: "inherit" });
//         } else if (projectFrame === "T3-app") {
//             console.log(chalk.green(`\nYou chose T3-app! 🚀`));
//             execSync(`npx create-t3-app ${projectName}`, { stdio: "inherit" });
//         } else if (projectFrame === "React using Vite") {
//             console.log(chalk.green(`\nYou chose React! 🚀`));
//             execSync(`npx create-vite ${projectName} --template react`, { stdio: "inherit" });
//         } else if (projectFrame === "Angular") {
//             console.log(chalk.green(`\nYou chose Angular! 🚀`));
//             execSync(`npx @angular/cli new ${projectName}`, { stdio: "inherit" });
//         }
//         else{
//             return true;
//         }
//         // ✅ Check if the project was successfully created
//         const projectPath = path.join(process.cwd(), projectName);
//         if (fs.existsSync(projectPath)) {
//             console.log(chalk.green(`\n✅ Project "${projectName}" was successfully created! 🎉\n`));
//             return true;
//         } else {
//             console.log(chalk.red(`\n❌ Project "${projectName}" creation failed. Please try again.`));
//             return false;
//         }
//     } catch (error) {
//         console.error(chalk.red("\n❌ Error creating the project: "), error);
//         return false;
//     }
// }
