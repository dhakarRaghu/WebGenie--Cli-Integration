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
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { setPrismaNextAuth } from "../authentication/nextauthPrisma.js";
import { setNextAuthLibs } from "../authentication/nextLibs.js";
import { setBetterEnv } from "../authentication/better/envBetter.js";
import { setBetterAuth } from "../authentication/better/betterAuth.js";
import { setBetterLogin } from "../authentication/better/betterLogin.js";
import { setPrismaBetter } from "../authentication/better/setPrismaBetter.js";
import { setFrontPage } from "./frontpage.js";
import { setNextLogin } from "../authentication/NextLoginPage.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const runInProject = ({ cmd, projectName }) => {
    execSync(cmd, { stdio: "inherit", cwd: projectName });
};
const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));
export default function welcome() {
    return __awaiter(this, void 0, void 0, function* () {
        const rainbowTitle = chalkAnimation.rainbow("\n🚀 Welcome to WebGenie - Build your project in seconds! 🚀\n");
        yield sleep(1000);
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
                choices: (answers) => answers.projectFrame === "Nextjs" ? ["NextAuth", "BetterAuth", "None"] : ["None"],
            },
        ]);
        console.log(chalk.green(`\nWelcome, ${name}! Let's get started! 🚀`));
        try {
            if (projectFrame === "Nextjs") {
                console.log(chalk.green(`\nYou chose Nextjs! 🚀`));
                execSync(`npx create-next-app ${projectName}`, { stdio: "inherit" });
                yield setFrontPage({ frontpagePath: projectName });
                if (auth === "NextAuth") {
                    console.log(chalk.yellow("\nSetting up NextAuth... ⏳"));
                    try {
                        yield setPrismaNextAuth({ projectName });
                        // Install dependencies
                        execSync(`cd ${projectName} && npm install next-auth @prisma/client @next-auth/prisma-adapter`, { stdio: "inherit" });
                        const up = projectName + "/src";
                        const authPath = path.join(process.cwd(), up, "lib");
                        yield setNextAuthLibs({ authPath });
                        console.log(chalk.green("\n✅ NextAuth setup complete!\n"));
                        console.log(chalk.green("\n✅ Wants to create your login page ?!\n "));
                        const { login } = yield inquirer.prompt({
                            type: "list",
                            name: "login",
                            message: "Want us to create your login page ?",
                            choices: ["Yes", "No"],
                        });
                        if (login === "Yes") {
                            const nextPath = `${projectName}/src/`;
                            console.log(chalk.green("\n✅ For Components we are installing Shadcn library"));
                            const loginPath = path.join(process.cwd(), nextPath, "app");
                            yield setNextLogin({ loginPath });
                            runInProject({ cmd: `npx shadcn@latest init -d`, projectName });
                            runInProject({ cmd: `npx shadcn@latest add button`, projectName });
                            runInProject({ cmd: `npx shadcn@latest add card`, projectName });
                        }
                        else {
                            const { components } = yield inquirer.prompt({
                                type: "list",
                                name: "components",
                                message: "Initialize Shadcn ?",
                                choices: ["Yes", "No"],
                            });
                            if (components === "Yes") {
                                runInProject({ cmd: `npx shadcn@latest init -d`, projectName });
                                runInProject({ cmd: `npx shadcn@latest add button`, projectName });
                                runInProject({ cmd: `npx shadcn@latest add card`, projectName });
                            }
                            else {
                                console.log(chalk.red("No components added"));
                            }
                        }
                    }
                    catch (error) {
                        console.error(chalk.red("\n❌ Error setting up NextAuth: "), error);
                    }
                }
                else if (auth === "BetterAuth") {
                    console.log(chalk.yellow("\nSetting up BetterAuth...  ⏳"));
                    try {
                        runInProject({ cmd: `npm install better-auth`, projectName });
                        console.log(chalk.green(process.cwd()));
                        const { db } = yield inquirer.prompt([
                            {
                                type: "list",
                                name: "db",
                                message: "Please choose a database :",
                                choices: ["Prisma", "drizzle", "None"],
                            },
                        ]);
                        console.log(chalk.green(`\nYou chose ${db}! 🚀`));
                        if (db === "Prisma") {
                            yield setPrismaBetter({ projectName });
                        }
                        else if (db === "drizzle") {
                            try {
                                runInProject({ cmd: `npm i drizzle-orm @neondatabase/serverless dotenv`, projectName });
                                runInProject({ cmd: `npm i -D drizzle-kit tsx`, projectName });
                                const path1 = path.join(process.cwd(), projectName);
                                fs.writeFileSync(path.join(path1, "drizzle.config.ts"), `
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  out: './drizzle',
  schema: './auth-schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
                                        `);
                            }
                            catch (error) {
                                console.error(chalk.red("\n❌ Error setting up Drizzle: "), error);
                            }
                        }
                        else {
                            console.log(chalk.red("No database selected"));
                        }
                        yield setBetterEnv({ projectName });
                        const up = projectName + "/src";
                        const authPath = path.join(process.cwd(), up, "lib");
                        yield setBetterAuth({ authPath, db });
                        if (db === "Prisma") {
                            runInProject({ cmd: `npx @better-auth/cli generate`, projectName });
                            console.log(chalk.green("\n✅ Your schema is also generated, Now you can migrate your schema!\n"));
                        }
                        else {
                            console.log(chalk.blue("\n @Load your .env file then run!\n 'npx @better-auth/cli generate' to generate schema!! \n "));
                        }
                        console.log(chalk.green("\n✅ Wants to create your login page ?!\n "));
                        const { login } = yield inquirer.prompt({
                            type: "list",
                            name: "login",
                            message: "Want us to create your login page ?",
                            choices: ["Yes", "No"],
                        });
                        if (login === "Yes") {
                            const nextPath = `${projectName}/src/`;
                            console.log(chalk.green("\n✅ For Components we are installing Shadcn library"));
                            const loginPath = path.join(process.cwd(), nextPath, "app");
                            yield setBetterLogin({ loginPath });
                            runInProject({ cmd: `npx shadcn@latest init -d`, projectName });
                            runInProject({ cmd: `npx shadcn@latest add button`, projectName });
                            runInProject({ cmd: `npx shadcn@latest add card`, projectName });
                        }
                        else {
                            const { components } = yield inquirer.prompt({
                                type: "list",
                                name: "components",
                                message: "Initialize Shadcn ?",
                                choices: ["Yes", "No"],
                            });
                            if (components === "Yes") {
                                runInProject({ cmd: `npx shadcn@latest init -d`, projectName });
                                runInProject({ cmd: `npx shadcn@latest add button`, projectName });
                                runInProject({ cmd: `npx shadcn@latest add card`, projectName });
                            }
                            else {
                                console.log(chalk.red("No components added"));
                            }
                        }
                    }
                    catch (error) {
                        console.error(chalk.red("\n❌ Error setting up BetterAuth: "), error);
                    }
                }
                else {
                    console.log(chalk.red("No authentication selected"));
                    const { components } = yield inquirer.prompt({
                        type: "list",
                        name: "components",
                        message: "Initialize Shadcn ?",
                        choices: ["Yes", "No"],
                    });
                    if (components === "Yes") {
                        runInProject({ cmd: `npx shadcn@latest init -d`, projectName });
                        runInProject({ cmd: `npx shadcn@latest add button`, projectName });
                        runInProject({ cmd: `npx shadcn@latest add card`, projectName });
                    }
                    else {
                        console.log(chalk.red("No components added"));
                    }
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
            console.log(chalk.blue.bold("🚀 Check it out here: ") + chalk.underline("https://web-genie-one.vercel.app/\n"));
            console.log(`cd ${projectName} \n npm run dev\n`);
        }
        catch (error) {
            console.error(chalk.red("\n❌ Error creating the project: "), error);
        }
    });
}
