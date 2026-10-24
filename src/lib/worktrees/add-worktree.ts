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
import * as path from 'path';

import { simpleGit } from 'simple-git';

import { listWorktrees } from './list-worktrees';

export const addWorktree = async (name: string) => {
    const worktrees = await listWorktrees();
    const main = worktrees.find((worktree) => worktree.main);
    if (!main) return;
    // Worktrees live in a sibling folder to the repo, named <item>-worktrees.
    const target = path.join(`${main.path}-worktrees`, name);
    const output = await simpleGit().raw(['worktree', 'add', target]);
    console.info(output);
    return target;
};
