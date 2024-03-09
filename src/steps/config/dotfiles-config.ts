import { getPath } from "lib/utils/paths";
import { Step } from "../step";
import fs from "fs";

export class DotfilesConfig extends Step {
    async installCheck() {
        const zshrc = fs.readFileSync(getPath('~/.zshrc'), 'utf8');
        if(!zshrc.includes('source ~/dotfiles/.bash_profile')) {
            return { valid: false, reason: "dotfiles is not configured in ~/.zshrc" };
        }
        
        return { valid: true };
    }
    name() {
        return "Dotfiles Config";
    }
    async installStep() {
        const zshrc = fs.readFileSync(getPath('~/.zshrc'), 'utf8');
        if(!zshrc.includes('source ~/dotfiles/.bash_profile')) {
            fs.appendFileSync(getPath('~/.zshrc'), 'source ~/dotfiles/.bash_profile');
        }
    }
}