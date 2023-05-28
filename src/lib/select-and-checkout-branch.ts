/**
 * Copyright 2023 Hasnae Rehioui
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { prompt } from 'inquirer';
import { simpleGit } from 'simple-git';

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
