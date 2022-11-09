#! /usr/bin/env node

import { getConfiguration, WithProgram, withProgram } from '../lib';
import { githubItemStream } from '../streams/github-item-stream';

const githubSync: WithProgram = (
    { githubUsername, githubPersonalToken, registry },
    program
) => {
    program.option('--user <namespace>', 'with user namespace');
    program.option('--org <namespace>', 'with org namespace');
    program.action(async (opts) => {
        const { workspace, user, org } = opts;
        if (!user && !org) {
            console.error(`missing input options: --user|--org <namespace>`);
            return;
        }
        await githubItemStream({
            githubUsername,
            githubPersonalToken,
            kind: user ? 'users' : 'orgs',
            namespace: user ?? org,
            workspace,
            handler: registry.add
        });
    });
};

getConfiguration().then(withProgram(githubSync));
