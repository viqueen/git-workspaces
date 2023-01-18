#! /usr/bin/env node

import simpleGit from 'simple-git';
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

listRemoteBranches({ pattern }).then(
    selectAndCheckoutBranch(/(?<branchName>.*)/)
);
