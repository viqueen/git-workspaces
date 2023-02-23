import { prompt } from 'inquirer';
import simpleGit from 'simple-git';

const selectForDeleteQuestion = async (branches: string[]) => {
    if (branches.length === 0) return undefined;
    return prompt([
        {
            name: 'selectedBranches',
            type: 'checkbox',
            message: 'choose branches to delete from local',
            choices: branches,
            pageSize: 10
        }
    ]);
};

const selectForDeleteAnswer =
    (branchPattern: RegExp, forceDelete: boolean) =>
    async (answer?: { selectedBranches: string[] }) => {
        if (!answer) return;
        const { selectedBranches } = answer;
        const mappedBranchNames = answer.selectedBranches.map((info) => {
            const matcher = info.match(branchPattern);
            return matcher?.groups?.branchName;
        });
        const output = await Promise.all(
            mappedBranchNames.map(
                (branch) =>
                    branch && simpleGit().deleteLocalBranch(branch, forceDelete)
            )
        );
        console.table(output);
    };

export const selectAndDeleteBranches =
    (branchPattern: RegExp, forceDelete: boolean = false) =>
    async (branches: string[]) => {
        return selectForDeleteQuestion(branches).then(
            selectForDeleteAnswer(branchPattern, forceDelete)
        );
    };
