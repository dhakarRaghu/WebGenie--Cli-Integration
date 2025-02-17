import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


interface RunInProjectProps {
    cmd: string;
    projectName: string;
}

const runInProject = ({ cmd, projectName }: RunInProjectProps): void => {
    execSync(cmd, { stdio: "inherit", cwd: projectName });
};

interface Props {
    projectName: string;
}

export async function setPrismaBetter(props : Props): Promise<void> {
    const { projectName } = props;
    const { db }: { db: "Prisma" | "None"} = await inquirer.prompt([
        {
            type: "list",
            name: "db",
            message: "Please choose a database:",
            choices: ["Prisma" , "None"],
        },
    ]);

    console.log(chalk.green(`\nYou chose ${db}! 🚀`));

    if (db === "Prisma") {
        console.log(chalk.yellow("\nSetting up Prisma... ⏳"));
        runInProject({ cmd: `npm install prisma @prisma/client`, projectName });
        runInProject({ cmd: `npx prisma init`, projectName });
        const projectPath = process.cwd() + `/${projectName}`;

        const prismaSchema = `
datasource db {
  provider = "postgresql" // Change this to your database type if needed
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String  @id @default(uuid())
  email     String  @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
}
        `;
        const prismaDir = path.join(projectPath, "prisma");
        fs.ensureDirSync(prismaDir);
        fs.writeFileSync(path.join(prismaDir, "schema.prisma"), prismaSchema.trim());

        runInProject({ cmd: `npx prisma generate`, projectName });
        console.log(chalk.red(`\n ${projectPath}! 🚀`));

        console.log(chalk.green("\n✅ Prisma setup complete!\n"));
    } else {
        console.log(chalk.blue(`\nSkipping Prisma setup. ${db} selected instead.\n`));
    }
}