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

import { selectAndCheckoutBranch } from '../lib/select-and-checkout-branch';

const listRemoteBranches = async ({ pattern }: { pattern?: string }) => {
    const params = ['--remote'];
    const remoteWithPattern =
        pattern !== undefined
            ? [...params, `--list`, `*${pattern}*`]
            : [...params];

    const remote = (await simpleGit().remote([])) as string;
    return simpleGit()
        .branch(remoteWithPattern)
        .then(({ all }) => all.map((b) => b.replace(`${remote.trim()}/`, '')));
};

const pattern = process.argv.slice(2).shift();

listRemoteBranches({ pattern })
    .then(selectAndCheckoutBranch(/(?<branchName>.*)/))
    .catch(console.error);
