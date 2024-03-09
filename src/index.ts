import { red, green, gray, yellow } from 'console-log-colors';
import { open } from 'openurl';
import { InstallBrewPackages } from "./steps/prepare/brew-package";
import { CreateDevelopmentFolder } from "./steps/prepare/createDevelopmentFolder";
import { InstallGit } from "./steps/prepare/git";
import { InstallIterm } from "./steps/prepare/installIterm";
import { InstallHomebrew } from "./steps/prepare/installhomebrew";
import { InstallNvm } from "./steps/prepare/nvm";
import { InstallPipPackages } from "./steps/prepare/pip-packages";
import { SetEnvVariable } from "./steps/prepare/setenv";
import { XCodeInstall } from "./steps/prepare/xcode";
import { getName } from './utils/getname';
import { NpmAuth } from './steps/auth/npmauth';
import { BrewAddRepos } from './steps/prepare/brew-add-repos';
import { InstallOkteto } from './steps/prepare/install-okteto';
import { AwsCreds } from './steps/prepare/awscreds';
import { PythonFixes } from './steps/prepare/pythonfixes';
import { InstallTeleport } from './steps/prepare/teleport';
import { RvmInstaller } from './steps/prepare/rvm';
import { GitConfig } from './steps/config/gitconfig';
import { GithubAuth } from './steps/auth/githubauth';
import { InstallNpmPackages } from './steps/prepare/npmpackages';
import { GitClone } from './steps/config/gitclone';
import { DotfilesConfig } from './steps/config/dotfiles-config';
import { pressAnyKeyToContinue } from './utils/question';

function formatTime(time: number) {
    if(time < 1000) return `${time}ms`
    if(time < 60000) return `${(time/1000).toFixed(2)}sec`
    if(time < 3600000) return `${Math.floor(time/60000)}min-${((time%60000)/1000).toFixed(2)}sec`;
    return `${Math.floor(time/3600000)}h-${Math.floor((time%3600000)/60000)}min-${((time%60000)/1000).toFixed(2)}sec`;
}

const steps = [
    new CreateDevelopmentFolder(),
    new XCodeInstall(),
    new InstallHomebrew(),
    new InstallIterm(),
    new InstallGit(),
    new InstallNvm(),
    new InstallPipPackages(["virtualenv"]),
    new InstallPipPackages(["octodns==0.9.10", "nsone", "boto3", "route53"]),
    new InstallBrewPackages(["cask", "make", "yarn"]),
    new InstallBrewPackages(["iterm2" ,"jq", "gpg", "kubectl" ,"kubectx" ,"warrensbox/tap/tfswitch", "aws-iam-authenticator", "pyenv", "awscli", "redis", "mysql"], { force: true }),
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

    new GitClone("git@github.com:DaPulse/dotfiles.git", "~/dotfiles"),
    new DotfilesConfig()
]
export async function main() {
    const name = await getName();
    console.log(`Hello ${yellow(name.fullName)}! Let's set you up!`)
    let idx = 0;
    let stepsCount = steps.length;
    let startedAllAt = new Date();
    let skipped = 0;
    for(const step of steps) {
        idx++;
        const startedCurrentStepAt = new Date();
        const isInstalledAlready = await step.beforeInstallCheck();
        if(isInstalledAlready.valid) {
            console.log(`${gray(`Skipped step ${step.name()}... ${isInstalledAlready.reason || "Already done before"}`)}. ${formatTime(new Date().getTime() - startedCurrentStepAt.getTime())} ${idx}/${stepsCount}`)
            skipped++;
            continue;
        }
        console.log(`${yellow('step')} ${step.name()}... ${idx}/${stepsCount}`)

        const result = await step.install();

        if(result.success) {
            console.log(`${green(`step ${step.name()}... success.`)} done in ${formatTime(new Date().getTime() - startedCurrentStepAt.getTime())}. passed ${formatTime(new Date().getTime() - startedAllAt.getTime())}`)
        } else {
            console.error(`${red(`step ${step.name()}... failed.`)} ${idx}/${stepsCount}`);
            console.error(`reason: ${result.reason}. error: ${result.error}`)
            console.log(`there are still ${stepsCount - (idx - 1)} steps left. `);
            console.error(`${red(`step ${step.name()}... failed.`)} ${idx}/${stepsCount}`);
            console.error('Please contact iow for help.');
            console.error(`Press any key to open a iow ticket`);
            await pressAnyKeyToContinue();
            open("https://iow.monday.beer/");
            process.exit(-1);
        }
        
    }
    console.log(`all steps done in ${formatTime(new Date().getTime() - startedAllAt.getTime())}
    skipped ${skipped} steps / ${stepsCount} total steps`);
    console.log(`Press any key to finish...`);
    await pressAnyKeyToContinue();

}

main();