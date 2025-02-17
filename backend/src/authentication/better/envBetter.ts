import fs from "fs-extra";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Props {
    authPath : string;
}

export async function setBetterEnv(): Promise<void> {

    fs.writeFileSync(path.join(process.cwd(), ".env.example"), 
    `
    BETTER_AUTH_SECRET=

    BETTER_AUTH_URL=                     #Base URL of your app

    DATABASE_URL=""

    GOOGLE_CLIENT_ID=""
    GOOGLE_CLIENT_SECRET=""

    GITHUB_CLIENT_ID=""
    GITHUB_CLIENT_SECRET=""
    `
  )
}