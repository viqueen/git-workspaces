#! /usr/bin/env node

import * as os from 'os';
import * as path from 'path';

import { prompt } from 'inquirer';
import { simpleGit, GitConfigScope } from 'simple-git';

import { Configuration } from '../lib';

const configureGitDevboxQuestions = async () => {
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

const configureGitDevboxAnswers = async (
    answer: Omit<Configuration, 'registry'> | undefined
) => {
    if (!answer) return;
    simpleGit().addConfig(
        'devbox.workspaces.root',
        answer.workspacesRoot,
        false,
        GitConfigScope.global
    );
    simpleGit().addConfig(
        'devbox.workspaces.default',
        answer.workspacesDefault,
        false,
        GitConfigScope.global
    );
    simpleGit().addConfig(
        'devbox.github.username',
        answer.githubUsername,
        false,
        GitConfigScope.global
    );
    simpleGit().addConfig(
        'devbox.github.personal.token',
        answer.githubPersonalToken,
        false,
        GitConfigScope.global
    );
};

configureGitDevboxQuestions().then(configureGitDevboxAnswers);
