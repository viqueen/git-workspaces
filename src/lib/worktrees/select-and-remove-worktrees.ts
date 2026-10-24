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
import inquirer from 'inquirer';
import { simpleGit } from 'simple-git';

import { Worktree } from './list-worktrees';

const selectForRemoveQuestion = async (worktrees: Worktree[]) => {
    // The main worktree cannot be removed, so it is not offered as a choice.
    const removable = worktrees.filter((worktree) => !worktree.main);
    if (removable.length === 0) return undefined;
    return inquirer.prompt([
        {
            name: 'selectedPaths',
            type: 'checkbox',
            message: 'choose worktrees to remove',
            choices: removable.map((worktree) => ({
                name: worktree.branch
                    ? `${worktree.path} (${worktree.branch})`
                    : worktree.path,
                value: worktree.path
            })),
            pageSize: 10
        }
    ]);
};

const selectForRemoveAnswer = async (answer?: { selectedPaths: string[] }) => {
    if (!answer || answer.selectedPaths.length === 0) return;
    await Promise.all(
        answer.selectedPaths.map((target) =>
            simpleGit().raw(['worktree', 'remove', target])
        )
    );
    // `git worktree remove` is silent on success, so report what was removed.
    console.table(answer.selectedPaths.map((path) => ({ removed: path })));
};

export const selectAndRemoveWorktrees = async (worktrees: Worktree[]) => {
    return selectForRemoveQuestion(worktrees).then(selectForRemoveAnswer);
};
