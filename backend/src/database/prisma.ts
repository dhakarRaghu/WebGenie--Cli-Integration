import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function setupDatabase() {
    const { db } = await inquirer.prompt([
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
        console.log(chalk.red(`\n${projectPath} 🚀`));

        execSync(`npm install prisma @prisma/client`, { stdio: "inherit", cwd: projectPath });

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
