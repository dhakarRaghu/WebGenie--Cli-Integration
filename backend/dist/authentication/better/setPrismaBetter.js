var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const runInProject = ({ cmd, projectName }) => {
    execSync(cmd, { stdio: "inherit", cwd: projectName });
};
export function setPrismaBetter(props) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectName } = props;
        console.log(chalk.yellow("\nSetting up Prisma... ⏳"));
        try {
            runInProject({ cmd: `npm install prisma @prisma/client dotenv`, projectName });
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
        }
        catch (err) {
            console.error(chalk.red(`\n❌ Error setting up Prisma: ${err}`));
        }
    });
}
