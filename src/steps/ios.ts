import { getDevelopmentPath } from "lib/utils/paths";
import { GitClone } from "./config/gitclone";
import { InstallMise } from "./ios/mise";
import { InstallXcode } from "./ios/xcode";
import { InstallBrewPackages } from "./prepare/brew-package";
import { CreateDevelopmentFolder } from "./prepare/createDevelopmentFolder";
import { Step } from "./step";

export default [
    new CreateDevelopmentFolder(),
    new InstallBrewPackages(["xcodesorg/made/xcodes", "aria2", "libyaml"]),
    new InstallXcode(),
    new GitClone("DaPulse/iOS", `${getDevelopmentPath()}/iOS`, true),
    new InstallMise()
] as Step[];