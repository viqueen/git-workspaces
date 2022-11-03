#! /usr/bin/env node

import { leveldbStore } from '../data/leveldb-store';
import { Item } from '../data/types';
import { prompt } from 'inquirer';
import * as path from 'path';
import { spawn } from 'child_process';
import { Configuration, getConfiguration } from '../lib/get-configuration';
import { withProgram, WithProgram } from '../lib/with-program';

const switchRepoQuestion = async (items: Item[]) => {
    if (items.length === 0) return undefined;
    return prompt([
        {
            name: 'selectedRepo',
            type: 'list',
            message: 'select repo to switch to',
            choices: items.map((item) => path.join(item.workspace, item.slug)),
            pageSize: 20
        }
    ]);
};

const switchRepoAnswer = ({
    workspacesRoot
}: Pick<Configuration, 'workspacesRoot'>) => {
    return async (answer: { selectedRepo: string } | undefined) => {
        if (!answer) return;
        const target = path.resolve(workspacesRoot, answer.selectedRepo);
        const child = spawn('bash', ['-i'], { cwd: target, stdio: 'inherit' });
        child.on('exit', () => process.exit());
        child.on('close', () => process.exit());
    };
};

const listRepos: WithProgram = (
    { registry, workspacesRoot }: Configuration,
    program
) => {
    program.action(async (opts) => {
        const { workspace } = opts;
        await leveldbStore(registry)
            .list((item) => item.workspace === workspace)
            .then(switchRepoQuestion)
            .then(switchRepoAnswer({ workspacesRoot }));
    });
};

getConfiguration().then(withProgram(listRepos));
