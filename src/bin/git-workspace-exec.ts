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

import path from 'path';

import { getConfiguration, itemFilter, withProgram, WithProgram } from '../lib';
import { execItemTask } from '../tasks';

const execRepos: WithProgram = ({ registry, workspacesRoot }, program) => {
    program
        .description('execute script on workspace repos')
        .arguments('<executableFile> [args...]')
        .action(async (executableFile, args, opts) => {
            const { workspace, namespace, host, slug, keyword } = opts;
            await registry
                .list(itemFilter({ workspace, namespace, host, slug, keyword }))
                .then(async (items) => {
                    await Promise.all(
                        items.map(
                            execItemTask({
                                workspacesRoot,
                                executableFile: path.resolve(
                                    process.cwd(),
                                    executableFile
                                ),
                                args
                            })
                        )
                    );
                });
        });
};

getConfiguration().then(withProgram(execRepos)).catch(console.error);
