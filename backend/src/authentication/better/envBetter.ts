import fs from "fs-extra";
import path from "path";

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