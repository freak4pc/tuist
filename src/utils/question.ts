import prompt from "prompt-sync";
import promptsLib from "prompts";

export function askQuestion(
  question: string,
  options: prompt.Option | undefined = undefined
): string {
  const prom = prompt();
  const response = options ? prom(question, options) : prom(question);
  return response;
}

export function askPassword(
  question: string,
  options: prompt.Option | undefined = undefined
): string {
  return askQuestion(question, { echo: "*", ...options });
}

export function askQuestionAcceptingOnlyValues(
  question: string,
  acceptedValues: string[]
): string {
  let response = askQuestion(question, {
    autocomplete: (input: string) =>
      acceptedValues.filter((v) =>
        v.toLowerCase().startsWith(input.toLowerCase())
      ),
  });
  while (!acceptedValues.includes(response.toLowerCase().trim())) {
    console.log(
      `Invalid response. Accepted values are: ${acceptedValues
        .map((v) => v.toLowerCase())
        .join(", ")}`
    );
    response = askQuestion(question, {
      autocomplete: (input: string) =>
        acceptedValues.filter((v) =>
          v.toLowerCase().startsWith(input.toLowerCase())
        ),
    });
  }
  return response.toLowerCase().trim();
}

export async function yesOrNo(question: string): Promise<boolean> {
  const response = await promptsLib({
    type: "confirm",
    name: "value",
    message: question,
    initial: true,
  });
  return response.value === true;
}

export function pressAnyKeyToContinue(): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    stdin.resume();
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    stdin.on("data", function (key: string) {
      if (key === "\u0003") {
        process.exit();
      }
      stdin.setRawMode(false);
      stdin.pause();
      resolve(key);
    });
  });
}
