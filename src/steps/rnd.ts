import { getPath } from "lib/utils/paths";
import { GithubAuth } from "./auth/githubauth";
import { NpmAuth } from "./auth/npmauth";
import { DotfilesConfig } from "./config/dotfiles-config";
import { GitClone } from "./config/gitclone";
import { GitConfig } from "./config/gitconfig";
import { AwsCreds } from "./prepare/awscreds";
import { BrewAddRepos } from "./prepare/brew-add-repos";
import { InstallBrewPackages } from "./prepare/brew-package";
import { CreateDevelopmentFolder } from "./prepare/createDevelopmentFolder";
import { InstallGit } from "./prepare/git";
import { InstallOkteto } from "./prepare/install-okteto";
import { InstallIterm } from "./prepare/installIterm";
import { InstallHomebrew } from "./prepare/installhomebrew";
import { InstallNpmPackages } from "./prepare/npmpackages";
import { InstallNvm } from "./prepare/nvm";
import { InstallPipPackages } from "./prepare/pip-packages";
import { PythonFixes } from "./prepare/pythonfixes";
import { SetEnvVariable } from "./prepare/setenv";
import { InstallTeleport } from "./prepare/teleport";
import { InstallXcodeCLI } from "./prepare/xcode";
import { Step } from "./step";

export default [
  new CreateDevelopmentFolder(),
  new InstallXcodeCLI(),
  new InstallHomebrew(),
  new InstallIterm(),
  new InstallGit(),
  new InstallNvm(),
  new InstallPipPackages(["virtualenv"]),
  new InstallPipPackages(["octodns==0.9.10", "nsone", "boto3", "route53"]),
  new InstallBrewPackages(["cask", "make", "yarn"]),
  new InstallBrewPackages(
    [
      "iterm2",
      "jq",
      "gpg",
      "kubectl",
      "kubectx",
      "warrensbox/tap/tfswitch",
      "aws-iam-authenticator",
      "pyenv",
      "awscli",
      "redis",
      "mysql",
    ],
    { force: true }
  ),
  new InstallBrewPackages(["gh"]),

  new PythonFixes(),

  new SetEnvVariable("AWS_PROFILE", "default"),
  new SetEnvVariable("AWS_REGION", "us-east-1"),
  new InstallBrewPackages(["dbeaver-community"], { cask: true }),

  new BrewAddRepos(["codefresh-io/cli", "versent/taps"]),
  new InstallBrewPackages(["codefresh", "saml2aws"]),
  new AwsCreds(),
  new InstallOkteto(),
  // new RvmInstaller(),
  /*
      Need to add these:
  
      # installing Ruby - version 2.7.2
      # This workaround is because of a dependency mismatch
      # brew defaults openssl to V3 while ruby 2.X only supports V1
      # so we temporarily remove openssl3 while building ruby
      brew uninstall --ignore-dependencies openssl@3
      brew reinstall openssl@1.1
      rvm install 2.7.2 --with-openssl-dir=`brew --prefix openssl@1.1`
      brew reinstall openssl@3
      rvm --default use 2.7.2
      */
  new InstallTeleport(),
  new NpmAuth(),

  new GitConfig(),
  new GithubAuth(),

  new InstallNpmPackages(["@mondaydotcomorg/monday-dev-cli"]),

  new GitClone("DaPulse/dotfiles", getPath("~/dotfiles")),
  new DotfilesConfig(),
] as Step[];
