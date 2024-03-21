export function isDevelopment() {
  return process.env.DEV === "true";
}

export function isVerbose() {
  return process.env.VERBOSE === "true" || isDevelopment();
}
