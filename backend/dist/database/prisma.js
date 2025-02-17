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
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function setupDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const { db } = yield inquirer.prompt([
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
        }
        else {
            console.log(chalk.blue(`\nSkipping Prisma setup. ${db} selected instead.\n`));
        }
    });
}
