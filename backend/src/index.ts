#!/usr/bin/env node
import { setupDatabase } from "./database/prisma.js";
import welcome from "./Framework/framework.js";


async function main(): Promise<void> {
    const success = await welcome();

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
}

main();