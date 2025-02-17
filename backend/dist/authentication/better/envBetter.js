var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs-extra";
import path from "path";
export function setBetterEnv(props) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectName } = props;
        const path1 = path.join(process.cwd(), projectName);
        fs.writeFileSync(path.join(path1, ".env.example"), `
BETTER_AUTH_SECRET=

BETTER_AUTH_URL=                     #Base URL of your app

DATABASE_URL=""

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
    `);
    });
}
