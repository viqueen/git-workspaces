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
import { simpleGit } from 'simple-git';

export type Worktree = {
    path: string;
    head?: string;
    branch?: string;
    // The first worktree reported by git is always the main one and cannot be
    // removed.
    main: boolean;
};

export const listWorktrees = async (): Promise<Worktree[]> => {
    const output = await simpleGit().raw(['worktree', 'list', '--porcelain']);
    const worktrees: Worktree[] = [];
    let current: Partial<Worktree> | undefined;
    for (const line of output.split('\n')) {
        if (line.startsWith('worktree ')) {
            current = { path: line.slice('worktree '.length) };
        } else if (!current) {
            continue;
        } else if (line.startsWith('HEAD ')) {
            current.head = line.slice('HEAD '.length);
        } else if (line.startsWith('branch ')) {
            current.branch = line
                .slice('branch '.length)
                .replace(/^refs\/heads\//, '');
        } else if (line.trim() === '') {
            worktrees.push({
                ...current,
                main: worktrees.length === 0
            } as Worktree);
            current = undefined;
        }
    }
    if (current) {
        worktrees.push({
            ...current,
            main: worktrees.length === 0
        } as Worktree);
    }
    return worktrees;
};
