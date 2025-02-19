import fs from "fs-extra";
import path from "path";

interface Props{
    projectName : string ;
}

export async function setBetterEnv(props : Props): Promise<void> {
    const {projectName} = props;
    const path1 = path.join(process.cwd(), projectName);
    fs.writeFileSync(path.join(path1, ".env.example"), 
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