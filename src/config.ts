export function isDevelopment() {
  return process.env.DEV === "true";
}

export function isVerbose() {
  return process.env.VERBOSE === "true";
}

export function shouldSkipInteractivity() {
  return process.env.SKIP_INTERACTIVE_STEPS === "true";
}
