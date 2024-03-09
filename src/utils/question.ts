import prompt from 'prompt-sync';

export function askQuestion(question: string, options: prompt.Option | undefined = undefined ): string {
    const prom = prompt();
    const response = options ? prom(question, options) : prom(question);
    return response;
}


export function askPassword(question: string, options: prompt.Option | undefined = undefined ): string {
    return askQuestion(question, { echo: "*", ...options});
}

export function yesOrNo(question: string): boolean {
    const response = askQuestion(question + " (y/n)");
    return response.toLowerCase() === "y" || response.toLowerCase() === "yes";
}

export function pressAnyKeyToContinue(): Promise<void> {
    return new Promise((resolve) => {
        const stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.once('data', () => {
            stdin.setRawMode(false);
            resolve();
        });
    });
}