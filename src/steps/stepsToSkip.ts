import { shouldSkipInteractivity } from "../config";
import { GITHUB_AUTH_STEP } from "./auth/githubauth";
import { NPM_AUTH_STEP } from "./auth/npmauth";
import { DOTFILES_CONFIG_STEP } from "./config/dotfiles-config";
import { GIT_CLONE_STEP } from "./config/gitclone";
import { GIT_CONFIG_STEP } from "./config/gitconfig";
import { NPM_INSTALL_STEP } from "./prepare/npmpackages";

export function getStepsToSkip(): Set<string> {
  let stepsToSkip = new Set<string>();
  if (process.env.SKIP_STEPS) {
    const steps = process.env.SKIP_STEPS.split(",").filter(Boolean);
    stepsToSkip = new Set([...stepsToSkip, ...steps]);
  }
  if (shouldSkipInteractivity()) {
    const steps = [
      NPM_AUTH_STEP,
      GITHUB_AUTH_STEP,
      GIT_CONFIG_STEP,
      NPM_INSTALL_STEP,
      GIT_CLONE_STEP,
      DOTFILES_CONFIG_STEP,
    ];
    stepsToSkip = new Set([...stepsToSkip, ...steps]);
  }
  return stepsToSkip;
}
