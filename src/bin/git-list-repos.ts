#! /usr/bin/env node

import { Command } from 'commander';
import { leveldbStore } from '../data/leveldb-store';
import { Item } from '../data/types';
import { prompt } from 'inquirer';
import * as path from 'path';
import { spawn } from 'child_process';
import { configuration, Configuration } from '../data/configuration';

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

const switchRepoAnswer =
    ({ workspacesRoot }: Pick<Configuration, 'workspacesRoot'>) =>
    async (answer: { selectedRepo: string } | undefined) => {
        if (!answer) return;
        const target = path.resolve(workspacesRoot, answer.selectedRepo);
        const child = spawn('bash', ['-i'], { cwd: target, stdio: 'inherit' });
        child.on('exit', () => process.exit());
        child.on('close', () => process.exit());
    };

const listRepos = ({
    registry,
    workspacesDefault,
    workspacesRoot
}: Configuration) => {
    const program = new Command();
    program.option(
        '-w, --workspace <name>',
        'with workspace',
        workspacesDefault
    );
    program.action(async (opts) => {
        const { workspace } = opts;
        const items = await leveldbStore(registry).list(
            (item) => item.workspace === workspace
        );
        await switchRepoQuestion(items).then(
            switchRepoAnswer({ workspacesRoot })
        );
    });
    program.parse(process.argv);
};

configuration().then(listRepos);
