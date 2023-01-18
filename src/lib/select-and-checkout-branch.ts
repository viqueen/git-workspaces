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

const checkoutBranchAnswer = async (answer?: { branchDetails: string }) => {
    if (!answer) return undefined;
    const matcher = answer.branchDetails.match(
        /\d{4}-\d{2}-\d{2} (?<branchName>.*)/
    );
    const branchName = matcher?.groups?.branchName;
    if (!branchName) {
        console.error('branch name selection not found');
        return undefined;
    }
    return simpleGit().checkout(branchName);
};

export const selectAndCheckoutBranch = async (branches: string[]) => {
    return await selectBranchQuestion(branches).then(checkoutBranchAnswer);
};
