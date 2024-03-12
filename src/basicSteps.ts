import { InstallBrewPackages } from "./steps/prepare/brew-package";
import { CreateDevelopmentFolder } from "./steps/prepare/createDevelopmentFolder";
import { InstallGit } from "./steps/prepare/git";
import { InstallIterm } from "./steps/prepare/installIterm";
import { InstallHomebrew } from "./steps/prepare/installhomebrew";
import { InstallNvm } from "./steps/prepare/nvm";
import { InstallPipPackages } from "./steps/prepare/pip-packages";
import { SetEnvVariable } from "./steps/prepare/setenv";
import { XcodeInstall } from "./steps/prepare/xcode";
import { NpmAuth } from './steps/auth/npmauth';
import { BrewAddRepos } from './steps/prepare/brew-add-repos';
import { InstallOkteto } from './steps/prepare/install-okteto';
import { AwsCreds } from './steps/prepare/awscreds';
import { PythonFixes } from './steps/prepare/pythonfixes';
import { InstallTeleport } from './steps/prepare/teleport';
import { GitConfig } from './steps/config/gitconfig';
import { GithubAuth } from './steps/auth/githubauth';
import { InstallNpmPackages } from './steps/prepare/npmpackages';
import { GitClone } from './steps/config/gitclone';
import { DotfilesConfig } from './steps/config/dotfiles-config';
import { RvmInstaller } from './steps/prepare/rvm';
import { Step } from './steps/step';

export const basicSteps: Step[] = [
    new CreateDevelopmentFolder(),
    new XcodeInstall(),
    new InstallHomebrew(),
    new InstallIterm(),
    new InstallGit(),
    new InstallNvm(),
    new InstallPipPackages(["virtualenv"]),
    new InstallPipPackages(["octodns==0.9.10", "nsone", "boto3", "route53"]),
    new InstallBrewPackages(["cask", "make", "yarn"]),
    new InstallBrewPackages(["iterm2", "jq", "gpg", "kubectl", "kubectx", "warrensbox/tap/tfswitch", "aws-iam-authenticator", "pyenv", "awscli", "redis", "mysql"], { force: true }),
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

    new GitClone("DaPulse/dotfiles", "~/dotfiles"),
    new DotfilesConfig()
];
