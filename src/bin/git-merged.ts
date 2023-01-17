#! /usr/bin/env node

import simpleGit from 'simple-git';
import { prompt } from 'inquirer';
import { gitRawOutputHandler } from '../lib';

const listMergedBranches = async () => {
    return simpleGit()
        .raw([
            'for-each-ref',
            'refs/heads/',
            `--format='%(refname:short)'`,
            ' --merged'
        ])
        .then(gitRawOutputHandler);
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

listMergedBranches()
    .then(excludeOperationalBranches)
    .then(selectForDeleteQuestion)
    .then(selectForDeleteAnswer);
