#! /usr/bin/env node

/**
 * Copyright 2025 Hasnae Rehioui
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

import { Command } from 'commander';
import { simpleGit } from 'simple-git';

const program = new Command();

program
    .description('create a worktree for a feature branch')
    .argument('<feature>', 'feature name for the worktree branch')
    .action(async (feature: string) => {
        const git = simpleGit();
        const slug = feature.replace(/\s+/g, '-').toLowerCase();
        const branchName = `feature/${slug}`;
        const repoRoot = await git.revparse(['--show-toplevel']);
        const repoName = path.basename(repoRoot.trim());
        const worktreePath = path.resolve(
            repoRoot.trim(),
            '..',
            `${repoName}-${slug}`
        );

        await git.raw(['worktree', 'add', '-b', branchName, worktreePath]);
        console.info({ worktreePath, branchName });
    });

program.parse(process.argv);
