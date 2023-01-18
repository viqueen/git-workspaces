import { prompt } from 'inquirer';
import simpleGit from 'simple-git';

const selectBranchQuestion = async (branches: string[]) => {
    if (branches.length === 0) return undefined;
    return prompt([
        {
            name: 'branchDetails',
            type: 'list',
            message: 'select branch to switch to',
            choices: branches,
            pageSize: 30
        }
    ]);
};

const checkoutBranchAnswer =
    (branchPattern: RegExp) => async (answer?: { branchDetails: string }) => {
        if (!answer) return undefined;
        const matcher = answer.branchDetails.match(branchPattern);
        const branchName = matcher?.groups?.branchName;
        if (!branchName) {
            console.error('branch name selection not found');
            return undefined;
        }
        return simpleGit().checkout(branchName);
    };

export const selectAndCheckoutBranch =
    (branchPattern: RegExp) => async (branches: string[]) => {
        return await selectBranchQuestion(branches).then(
            checkoutBranchAnswer(branchPattern)
        );
    };
