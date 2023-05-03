#! /usr/bin/env node

import { simpleGit } from 'simple-git';

import { selectAndDeleteBranches } from '../lib/select-and-delete-branches';

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

const target = process.argv.slice(2).shift();

listMergedBranches({ target })
    .then(excludeOperationalBranches)
    .then(selectAndDeleteBranches(/(?<branchName>.*)/));
