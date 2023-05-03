import simpleGit from 'simple-git';

import { gitRawOutputHandler } from './git-raw-output-handler';

export const listRecentBranches = async () => {
    return simpleGit()
        .raw([
            'for-each-ref',
            'refs/heads/',
            '--sort=committerdate',
            `--format='%(committerdate:short) %(refname:short)'`
        ])
        .then(gitRawOutputHandler);
};
