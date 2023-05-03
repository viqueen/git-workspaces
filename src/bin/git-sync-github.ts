#! /usr/bin/env node

import { getConfiguration, WithProgram, withProgram } from '../lib';
import { githubItemStream } from '../streams';

const githubSync: WithProgram = (
    { githubUsername, githubPersonalToken, registry },
    program
) => {
    program
        .option('--user <namespace>', 'with user namespace')
        .option('--org <namespace>', 'with org namespace')
        .option('--archived', 'include archived repos', false)
        .option('--forked', 'include forked repos', false)
        .description('sync workspace with github')
        .action(async (opts) => {
            const { workspace, user, org, archived, forked } = opts;
            if (!user && !org) {
                console.error(
                    `missing input options: --user|--org <namespace>`
                );
                return;
            }
            await githubItemStream({
                githubUsername,
                githubPersonalToken,
                kind: user ? 'users' : 'orgs',
                namespace: user ?? org,
                workspace,
                handler: registry.add,
                githubItemFilter: (item) => {
                    const withArchived = item.archived ? archived : true;
                    const withForks = item.fork ? forked : true;
                    return withArchived && withForks;
                }
            });
        });
};

getConfiguration().then(withProgram(githubSync)).catch(console.error);
