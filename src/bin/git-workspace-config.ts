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
import * as os from 'os';
import * as path from 'path';

import { prompt } from 'inquirer';
import { simpleGit, GitConfigScope } from 'simple-git';

import { Configuration } from '../lib';

const configureGitWorkspaceQuestions = async () => {
    return prompt([
        {
            name: 'workspacesRoot',
            type: 'input',
            message: 'set workspaces.root',
            default: path.resolve(os.homedir(), 'workspaces')
        },
        {
            name: 'workspacesDefault',
            type: 'input',
            message: 'set workspaces.default',
            default: 'projects'
        },
        {
            name: 'githubUsername',
            type: 'input',
            message: 'set github username'
        },
        {
            name: 'githubPersonalToken',
            type: 'password',
            message: 'set github personal token'
        }
    ]);
};

const configureGitWorkspaceAnswers = async (
    answer: Omit<Configuration, 'registry'> | undefined
) => {
    if (!answer) return;
    await simpleGit()
        .addConfig(
            'git.workspaces.root',
            answer.workspacesRoot,
            false,
            GitConfigScope.global
        )
        .addConfig(
            'git.workspaces.default',
            answer.workspacesDefault,
            false,
            GitConfigScope.global
        )
        .addConfig(
            'git.workspaces.github.username',
            answer.githubUsername,
            false,
            GitConfigScope.global
        )
        .addConfig(
            'git.workspaces.github.personal.token',
            answer.githubPersonalToken,
            false,
            GitConfigScope.global
        );
};

configureGitWorkspaceQuestions()
    .then(configureGitWorkspaceAnswers)
    .catch(console.error);
