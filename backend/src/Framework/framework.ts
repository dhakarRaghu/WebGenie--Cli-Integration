import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { setPrismaNextAuth } from "../authentication/nextauthPrisma.js";
import { setNextAuthLibs } from "../authentication/nextLibs.js";
import { setBetterEnv } from "../authentication/better/envBetter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms: number = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function welcome(): Promise<void> {
    const rainbowTitle = chalkAnimation.rainbow("What framework do you want? \n");

    await sleep(500);
    rainbowTitle.stop(); // Stop the animation

    const { name, projectName, projectFrame, auth } = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Please enter your name:",
        },
        {
            type: "input",
            name: "projectName",
            message: "Please enter your projectName:",
        },
        {
            type: "list",
            name: "projectFrame",
            message: "Please choose a project framework:",
            choices: ["Nextjs", "T3-app", "React using Vite", "Angular"],
        },
        {
            type: "list",
            name: "auth",
            message: "Do you want authentication?",
            choices: (answers) => answers.projectFrame === "Nextjs" ? ["NextAuth", "BetterAuth" , "None"] : ["None"],
        },
    ]);

    console.log(chalk.green(`\nWelcome, ${name}! Let's get started! 🚀`));

    try{
        if (projectFrame === "Nextjs") {
            console.log(chalk.green(`\nYou chose Nextjs! 🚀`));
            execSync(`npx create-next-app ${projectName}`, { stdio: "inherit" });
    
            if (auth === "NextAuth") {
              console.log(chalk.yellow("\nSetting up NextAuth... ⏳"));
              try{
                await setPrismaNextAuth({ projectName });
                // Install dependencies
                execSync(`cd ${projectName} && npm install next-auth @prisma/client @next-auth/prisma-adapter`, { stdio: "inherit" });
                const up = projectName + "/src" ; 
                const authPath = path.join(process.cwd(), up, "lib");
                 await setNextAuthLibs({ authPath });
                 console.log(chalk.green("\n✅ NextAuth setup complete!\n"));
              }
              catch(error){
                console.error(chalk.red("\n❌ Error setting up NextAuth: "), error);
              }
            }
            else if(auth === "BetterAuth"){
                console.log(chalk.yellow("\nSetting up BetterAuth... ⏳"));
                try{
                    // Install dependencies
                    execSync(`cd ${projectName} && npm install betterauth`, { stdio: "inherit" });
          
                    await setBetterEnv();
                    
                    console.log(chalk.green("\n✅ BetterAuth setup complete!\n"));
                }
                catch(error){
                    console.error(chalk.red("\n❌ Error setting up BetterAuth: "), error);
                }
            }


        } else if (projectFrame === "T3-app") {
            console.log(chalk.green(`\nYou chose T3-app! 🚀`));
            execSync(`npx create-t3-app ${projectName}`, { stdio: "inherit" });
        } else if (projectFrame === "React using Vite") {
            console.log(chalk.green(`\nYou chose React! 🚀`));
            execSync(`npx create-vite ${projectName} --template react`, { stdio: "inherit" });
        } else if (projectFrame === "Angular") {
            console.log(chalk.green(`\nYou chose Angular! 🚀`));
            execSync(`npx @angular/cli new ${projectName}`, { stdio: "inherit" });
        }
        console.log(chalk.green(`\n✅ Project "${projectName}" is ready!\n`));
    }
    catch (error) {
        console.error(chalk.red("\n❌ Error creating the project: "), error);
    }
   

}


// import inquirer from "inquirer";
// import chalk from "chalk";
// import chalkAnimation from "chalk-animation";
// import { execSync } from "child_process";
// import fs from "fs-extra";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const sleep = (ms: number = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

// interface PromptAnswers {
//     name: string;
//     projectName: string;
//     projectFrame: "Nextjs" | "T3-app" | "React using Vite" | "Angular" | "None";
// }

// export default async function welcome(): Promise<boolean> {
//     const rainbowTitle = chalkAnimation.rainbow("What framework do you want? \n");
//     await sleep(500);
//     rainbowTitle.stop(); // Stop the animation

//     const { name } = await inquirer.prompt<{ name: string }>([
//         {
//             type: "input",
//             name: "name",
//             message: "Please enter your name:",
//         },
//     ]);

//     const { projectName } = await inquirer.prompt<{ projectName: string }>([
//         {
//             type: "input",
//             name: "projectName",
//             message: "Please enter your projectName:",
//         },
//     ]);

//     const { projectFrame } = await inquirer.prompt<{ projectFrame: "Nextjs" | "T3-app" | "React using Vite" | "Angular" | "None"}>([
//         {
//             type: "list",
//             name: "projectFrame",
//             message: "Please choose a project framework:",
//             choices: ["Nextjs", "T3-app", "React using Vite", "Angular" , "None"],
//         },
//     ]);

//     console.log(chalk.green(`\nWelcome, ${name}! Let's get started! 🚀`));

//     try {
//         if (projectFrame === "Nextjs") {
//             console.log(chalk.green(`\nYou chose Nextjs! 🚀`));
//             execSync(`npx create-next-app ${projectName}`, { stdio: "inherit" });
//         } else if (projectFrame === "T3-app") {
//             console.log(chalk.green(`\nYou chose T3-app! 🚀`));
//             execSync(`npx create-t3-app ${projectName}`, { stdio: "inherit" });
//         } else if (projectFrame === "React using Vite") {
//             console.log(chalk.green(`\nYou chose React! 🚀`));
//             execSync(`npx create-vite ${projectName} --template react`, { stdio: "inherit" });
//         } else if (projectFrame === "Angular") {
//             console.log(chalk.green(`\nYou chose Angular! 🚀`));
//             execSync(`npx @angular/cli new ${projectName}`, { stdio: "inherit" });
//         }
//         else{
//             return true;
//         }

//         // ✅ Check if the project was successfully created
//         const projectPath = path.join(process.cwd(), projectName);
//         if (fs.existsSync(projectPath)) {
//             console.log(chalk.green(`\n✅ Project "${projectName}" was successfully created! 🎉\n`));
//             return true;
//         } else {
//             console.log(chalk.red(`\n❌ Project "${projectName}" creation failed. Please try again.`));
//             return false;
//         }
//     } catch (error) {
//         console.error(chalk.red("\n❌ Error creating the project: "), error);
//         return false;
//     }
// }
