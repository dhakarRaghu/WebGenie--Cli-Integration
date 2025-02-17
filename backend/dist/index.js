#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import welcome from "./Framework/framework.js";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const success = yield welcome();
        // if (!success) {
        //     console.log("❌ Project setup failed. Trying again...");
        //     const success_again = await welcome();
        //     if (!success_again) {
        //         console.log("❌ Project setup failed. Exiting...");
        //         process.exit(1); // Exit with failure
        //     }
        //     process.exit(1); // Exit with failure
        // }
        // await setupDatabase();
    });
}
main();
