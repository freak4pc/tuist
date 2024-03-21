import { red, green, gray, yellow, cyan } from "console-log-colors";
import { open } from "openurl";
import { getName } from "./utils/device";
import { pressAnyKeyToContinue } from "./utils/question";
import { Step } from "./steps/step";
import { formatTime } from "./utils/time";
import { reportError, sendGeneralSlackMessage } from "./utils/errorHandling";
import prompts from "prompts";
import rndSteps from "./steps/rnd";
import iOSSteps from "./steps/ios";

export async function main() {
  await sendGeneralSlackMessage({ message: "Started setup" });
  const name = await getName();
  console.log(`Hello ${yellow(name.fullName)}! Let's set you up!`);

  const flavor = await prompts(
    {
      type: 'select',
      name: 'value',
      message: 'What kind of developer are you?',
      choices: [
        { title: 'Fullstack (General R&D)', description: 'Everything you need to get started in the R&D', value: 'general' },
        { title: 'iOS', description: 'Everything from R&D + Additional iOS-specific setup', value: 'ios'  }
      ]
    }
   )

   await processSteps(rndSteps, "R&D");

   switch (flavor.value) {
      case "ios":
        await processSteps(iOSSteps, "iOS");
        break;
      // Add additional flavors down here
    }

   console.log(green("All done ✨🎉! Time to write some code 👩‍💻👨‍💻"))
   console.log(`Press any key to finish...`);
   await pressAnyKeyToContinue();
}

main();

async function processSteps(steps: Step[], label: string) {
  console.log(cyan(`Running steps for ${label}`));
  await sendGeneralSlackMessage({ message: `Running steps for ${label}` });
  let startedAllAt = new Date();
  let { skipped, stepsCount } = await runSteps(steps);
  await sendGeneralSlackMessage({
    message: `Finished running steps for ${label} in ${formatTime(
      new Date().getTime() - startedAllAt.getTime()
    )}`,
  });
  console.log();
  console.log(cyan(`All ${label} steps done in ${formatTime(
    new Date().getTime() - startedAllAt.getTime()
  )}
    skipped ${skipped} steps / ${stepsCount} total steps`));
  console.log();
}

async function runSteps(steps: Step[]) {
  let idx = 0;
  const stepsCount = steps.length;
  const startedAllAt = new Date();
  let skipped = 0;
  for (const step of steps) {
    idx++;
    const startedCurrentStepAt = new Date();
    const canInstall = await step.checkIfCanInstall();
    if (!canInstall.valid) {
      console.error(
        `${red(`Can't run step ${step.name()}.`)} ${idx}/${stepsCount}`
      );
      console.error(`reason: ${canInstall.reason}`);
      await reportError({
        step: step.name(),
        error: canInstall.reason || "",
      });
      if (canInstall.fixAction) {
        await canInstall.fixAction();
      } else {
        console.error("Please write in #devs4devs for help.");
        console.error(`Press any key to open #devs4devs channel`);
        await pressAnyKeyToContinue();
        open("https://app.slack.com/client/T024J3LAA/C034VLARPJS");
      }

      process.exit(-1);
    }
    const isInstalledAlready = await step.checkIfShouldInstall();
    if (isInstalledAlready.valid) {
      console.log(
        `${gray(
          `Skipped step ${step.name()}... ${
            isInstalledAlready.reason || "Already done before"
          }`
        )}. ${formatTime(
          new Date().getTime() - startedCurrentStepAt.getTime()
        )} ${idx}/${stepsCount}`
      );
      skipped++;
      continue;
    }
    console.log(`${yellow("step")} ${step.name()}... ${idx}/${stepsCount}`);

    const result = await step.install();

    if (result.success) {
      console.log(
        `${green(`step ${step.name()}... success.`)} done in ${formatTime(
          new Date().getTime() - startedCurrentStepAt.getTime()
        )}. passed ${formatTime(new Date().getTime() - startedAllAt.getTime())}`
      );
    } else {
      console.error(
        `${red(`step ${step.name()}... failed.`)} ${idx}/${stepsCount}`
      );
      console.error(`reason: ${result.reason}. error: ${result.error}`);
      console.log(`there are still ${stepsCount - (idx - 1)} steps left. `);
      console.error(
        `${red(`step ${step.name()}... failed.`)} ${idx}/${stepsCount}`
      );
      console.error("Please write in #devs4devs for help.");
      await reportError({
        step: step.name(),
        error: result.reason || "",
      });
      console.error(`Press any key to open #devs4devs channel`);
      await pressAnyKeyToContinue();
      open("https://app.slack.com/client/T024J3LAA/C034VLARPJS");
      process.exit(-1);
    }
  }
  return { skipped, stepsCount };
}
