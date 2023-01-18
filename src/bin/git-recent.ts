#! /usr/bin/env node

import simpleGit from 'simple-git';
import { gitRawOutputHandler } from '../lib';
import { selectAndCheckoutBranch } from '../lib/select-and-checkout-branch';

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

listRecentBranches().then(
    selectAndCheckoutBranch(/\d{4}-\d{2}-\d{2} (?<branchName>.*)/)
);
