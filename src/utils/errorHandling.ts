const axios = require("axios");
import { shouldSendSlackData } from "../config";
import { getDevice, getName } from "./device";

export async function sendGeneralSlackMessage({
  message,
}: {
  message: string;
}) {
  const slackHook =
    "https://hooks.slack.com/triggers/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";
  try {
    const person = await getName();
    const device = await getDevice();
    if (shouldSendSlackData()) {
      console.log(
        `Would have sent slack message: ${message} ${person.fullName} (Running on ${device})`
      );
      return;
    }
    await axios.post(slackHook, {
      message,
      person: `${person.fullName} (Running on ${device})`,
    });
  } catch (e) {
    console.error(e);
  }
}

async function sendSlackMessage({
  error,
  user,
  step,
}: {
  error: string;
  user: string;
  step: string;
}) {
  if (shouldSendSlackData()) {
    console.log(`Would have sent slack message: ${error} ${user} ${step}`);
    return;
  }
  console.error(`Sending message to slack`);
  const slackHook =
    "https://hooks.slack.com/triggers/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";
  await axios.post(slackHook, {
    error,
    person: user,
    step,
  });
}
export async function reportError({
  error,
  step,
}: {
  error: string;
  step: string;
}) {
  if (shouldSendSlackData()) {
    return;
  }
  console.error(`Hold on. We're reporting your issue to the channel `);
  try {
    const user = await getName();
    await sendSlackMessage({ error, user: user.fullName, step });
  } catch (e: any) {
    console.error(`We couldn't report the message, please report it manually.`);
  }
}
