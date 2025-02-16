#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const sleep = (ms: number = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

async function welcome(): Promise<void> {
    const rainbowTitle = chalkAnimation.rainbow(
        "What framework do you choose? \n"
    );

    await sleep(500);
    rainbowTitle.stop(); // Stop the animation

    const { name }: { name: string } = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Please enter your name:",
        },
    ]);
    const { projectName }: { projectName: string } = await inquirer.prompt([
        {
            type: "input",
            name: "projectName",
            message: "Please enter your projectName:",
        },
    ]);

    const { projectFrame }: { projectFrame: "React" | "Vue" | "Angular" } = await inquirer.prompt([
        {
            type: "list",
            name: "projectFrame",
            message: "Please choose a project framework:",
            choices: ["React", "Vue", "Angular"],
        },
    ]);

    console.log(chalk.green(`\nWelcome, ${name}! Let's get started! 🚀`));


    if (projectFrame === "React") {
        console.log(chalk.green(`\nYou chose React! 🚀`));
        execSync(`npx create-vite ${projectName} --template react`, { stdio: "inherit" });
    } else if (projectFrame === "Vue") {
        console.log(chalk.green(`\nYou chose Vue! 🚀`));
        execSync(`npx create-vite ${projectName} --template vue`, { stdio: "inherit" });
    } else if (projectFrame === "Angular") {
        console.log(chalk.green(`\nYou chose Angular! 🚀`));
        execSync(`npx @angular/cli new ${projectName}`, { stdio: "inherit" });
    }

    console.log(chalk.green(`\n✅ Project "${projectName}" is ready!\n`));
}

async function setupDatabase(): Promise<void> {
    const { db }: { db: "MongoDB" | "PostgreSQL" | "MySQL" | "Prisma" } = await inquirer.prompt([
        {
            type: "list",
            name: "db",
            message: "Please choose a database:",
            choices: ["MongoDB", "PostgreSQL", "MySQL", "Prisma"],
        },
    ]);

    console.log(chalk.green(`\nYou chose ${db}! 🚀`));

    if (db === "Prisma") {
        console.log(chalk.yellow("\nSetting up Prisma... ⏳"));

        const projectPath = process.cwd();
        execSync(`cd ${projectPath} && npm install prisma @prisma/client`, { stdio: "inherit" });

        const prismaSchema = `
        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL")
        }

        model User {
          id    String @id @default(uuid())
          email String @unique
        }
        `;

        const prismaDir = path.join(projectPath, "prisma");
        fs.ensureDirSync(prismaDir);
        fs.writeFileSync(path.join(prismaDir, "schema.prisma"), prismaSchema.trim());

        console.log(chalk.green("\n✅ Prisma setup complete!\n"));
    } else {
        console.log(chalk.blue(`\nSkipping Prisma setup. ${db} selected instead.\n`));
    }
}

async function main(): Promise<void> {
    await welcome();
    await setupDatabase();
}

main();
// process.stdin.resume();