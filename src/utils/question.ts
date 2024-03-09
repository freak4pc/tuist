import prompt from 'prompt-sync';

export function askQuestion(question: string, options: prompt.Option | undefined = undefined ): string {
    const prom = prompt();
    const response = options ? prom(question, options) : prom(question);
    return response;
}


export function askPassword(question: string, options: prompt.Option | undefined = undefined ): string {
    return askQuestion(question, { echo: "*", ...options});
}

export function askQuestionAcceptingOnlyValues(question: string, acceptedValues: string[]): string {
    let response = askQuestion(question);
    while(!acceptedValues.includes(response.toLowerCase().trim())) {
        console.log(`Invalid response. Accepted values are: ${acceptedValues.map(v => v.toLowerCase()).join(", ")}`);
        response = askQuestion(question);
    }
    return response.toLowerCase().trim();
}

export function yesOrNo(question: string): boolean {
    const response = askQuestionAcceptingOnlyValues(question + " (y/n)", ["y", "n", "yes", "no"]);
    return response === "y" || response === "yes";
}

export function pressAnyKeyToContinue(): Promise<void> {
    return new Promise((resolve) => {
        const stdin = process.stdin;
        stdin.resume();
        stdin.setRawMode(true);
        stdin.once('data', () => {
            stdin.setRawMode(false);
            stdin.pause();
            resolve();
        });
    });
}