#! /usr/bin/env node

import simpleGit from 'simple-git';
import { prompt } from 'inquirer';
import { gitRawOutputHandler } from '../lib';

const listRecentBranches = async () => {
    return simpleGit()
        .raw([
            'for-each-ref',
            'refs/heads/',
            '--sort=committerdate',
            `--format='%(committerdate:short) %(refname:short)'`
        ])
        .then(gitRawOutputHandler);
};

const switchRecentBranchQuestion = async (branches: string[]) => {
    if (branches.length === 0) return undefined;
    return prompt([
        {
            name: 'branchDetails',
            type: 'list',
            message: 'select recent branch to switch to',
            choices: branches,
            pageSize: 30
        }
    ]);
};

const switchRecentBranchAnswer = async (
    answer: { branchDetails: string } | undefined
) => {
    if (!answer) return undefined;
    const matcher = answer.branchDetails.match(
        /\d{4}-\d{2}-\d{2} (?<branchName>.*)/
    );
    const branchName = matcher?.groups?.branchName;
    if (!branchName) {
        console.error('recent branch name selection not found');
        return;
    }
    return simpleGit().checkout(branchName);
};

listRecentBranches()
    .then(switchRecentBranchQuestion)
    .then(switchRecentBranchAnswer);
