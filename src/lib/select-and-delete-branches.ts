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
        const mappedBranchNames = selectedBranches.map((info) => {
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
    (branchPattern: RegExp, forceDelete = false) =>
    async (branches: string[]) => {
        return selectForDeleteQuestion(branches).then(
            selectForDeleteAnswer(branchPattern, forceDelete)
        );
    };
