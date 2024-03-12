import axios from 'axios';
import { getName } from './getname';

async function sendSlackMessage({
    error,
    user,
    step
}: {
    error: string;
    user: string;
    step: string;
}) {
    console.error(`Sending message to slack`);
    const slackHook = "https://hooks.slack.com/triggers/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";
    await axios.post(slackHook, {
        error,
        person: user,
        step
    });
}
export async function reportError({error, step}: {error: string, step: string}) {
    console.error(`Hold on. We're reporting your issue to the channel `);
    try {
        const user = await getName();
        await sendSlackMessage({ error, user: user.fullName, step});
    } catch(e: any) {
        console.error(`We couldn't report the message, please report it manually.`);
    }
    
}