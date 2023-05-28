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
import { simpleGit } from 'simple-git';

import { selectAndDeleteBranches } from '../lib/select-and-delete-branches';

const listMergedBranches = async ({ target }: { target?: string }) => {
    const params = ['--merged'];
    const mergedWithTarget =
        target !== undefined ? [...params, target] : [...params];
    return simpleGit()
        .branch(mergedWithTarget)
        .then((output) => {
            const { all, current } = output;
            return all.filter((i) => i !== current);
        });
};

const excludeOperationalBranches = async (branches: string[]) => {
    return branches.filter(
        (branch) =>
            !branch.match(/^(main|master|production|demo|website|development)$/)
    );
};

const target = process.argv.slice(2).shift();

listMergedBranches({ target })
    .then(excludeOperationalBranches)
    .then(selectAndDeleteBranches(/(?<branchName>.*)/))
    .catch(console.error);
