#! /usr/bin/env node

import simpleGit from 'simple-git';
import { prompt } from 'inquirer';
import { gitRawOutputHandler } from '../lib';

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

const selectForDeleteQuestion = async (branches: string[]) => {
    if (branches.length === 0) return undefined;
    return prompt([
        {
            name: 'selectedBranches',
            type: 'checkbox',
            message: 'choose merged branches to delete from local',
            choices: branches,
            pageSize: 10
        }
    ]);
};

const selectForDeleteAnswer = async (answer?: {
    selectedBranches: string[];
}) => {
    if (!answer) return;
    const { selectedBranches } = answer;
    const output = await Promise.all(
        selectedBranches.map((branch) => simpleGit().deleteLocalBranch(branch))
    );
    console.table(output);
};

const target = process.argv.slice(2).shift();

listMergedBranches({ target })
    .then(excludeOperationalBranches)
    .then(selectForDeleteQuestion)
    .then(selectForDeleteAnswer);
