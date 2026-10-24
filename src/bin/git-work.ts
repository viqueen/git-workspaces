#! /usr/bin/env node

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
import { Command } from 'commander';

import {
    addWorktree,
    listWorktrees,
    selectAndRemoveWorktrees
} from '../lib/worktrees';

const program = new Command();
program.description('manage git worktrees for the current repo');

program
    .command('add')
    .description('add a worktree under the <item>-worktrees sibling folder')
    .argument('<name>', 'worktree name')
    .action(async (name) => {
        await addWorktree(name);
    });

program
    .command('remove')
    .description('list worktrees and select the ones to remove')
    .action(async () => {
        await listWorktrees().then(selectAndRemoveWorktrees);
    });

program.parseAsync(process.argv).catch(console.error);
