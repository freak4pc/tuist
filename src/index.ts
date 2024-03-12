import { red, green, gray, yellow } from 'console-log-colors';
import { open } from 'openurl';
import { getName } from './utils/getname';
import { pressAnyKeyToContinue } from './utils/question';
import { Step } from './steps/step';
import { formatTime } from './utils/time';
import { basicSteps } from './basicSteps';

export async function main() {
    const name = await getName();
    console.log(`Hello ${yellow(name.fullName)}! Let's set you up!`)

    let startedAllAt = new Date();
    let { skipped, stepsCount } = await runSteps(basicSteps);
    console.log(`all steps done in ${formatTime(new Date().getTime() - startedAllAt.getTime())}
    skipped ${skipped} steps / ${stepsCount} total steps`);
    console.log(`Press any key to finish...`);
    await pressAnyKeyToContinue();
}

main();

async function runSteps(steps: Step[]) {
    let idx = 0;
    const stepsCount = steps.length;
    const startedAllAt = new Date();
    let skipped = 0;
    for (const step of steps) {
        idx++;
        const startedCurrentStepAt = new Date();
        const canInstall = !step.checkPreinstall || await step.checkPreinstall();
        if(!canInstall.valid) {
            console.error(`${red(`Can't run step ${step.name()}.`)} ${idx}/${stepsCount}`);
            console.error(`reason: ${canInstall.reason}`);
            if(canInstall.fixAction) {
                await canInstall.fixAction();
            } else {
                console.error('Please write in #devs4devs for help.');
                console.error(`Press any key to open #devs4devs channel`);
                await pressAnyKeyToContinue();
                open("https://app.slack.com/client/T024J3LAA/C034VLARPJS");
            }
            
            process.exit(-1);
        }
        const isInstalledAlready = await step.beforeInstallCheck();
        if (isInstalledAlready.valid) {
            console.log(`${gray(`Skipped step ${step.name()}... ${isInstalledAlready.reason || "Already done before"}`)}. ${formatTime(new Date().getTime() - startedCurrentStepAt.getTime())} ${idx}/${stepsCount}`);
            skipped++;
            continue;
        }
        console.log(`${yellow('step')} ${step.name()}... ${idx}/${stepsCount}`);

        const result = await step.install();

        if (result.success) {
            console.log(`${green(`step ${step.name()}... success.`)} done in ${formatTime(new Date().getTime() - startedCurrentStepAt.getTime())}. passed ${formatTime(new Date().getTime() - startedAllAt.getTime())}`);
        } else {
            console.error(`${red(`step ${step.name()}... failed.`)} ${idx}/${stepsCount}`);
            console.error(`reason: ${result.reason}. error: ${result.error}`);
            console.log(`there are still ${stepsCount - (idx - 1)} steps left. `);
            console.error(`${red(`step ${step.name()}... failed.`)} ${idx}/${stepsCount}`);
            console.error('Please write in #devs4devs for help.');
            console.error(`Press any key to open #devs4devs channel`);
            await pressAnyKeyToContinue();
            open("https://app.slack.com/client/T024J3LAA/C034VLARPJS");
            process.exit(-1);
        }

    }
    return { skipped, stepsCount };
}
