#! /usr/bin/env node

/**
 * Copyright 2023 Hasnae Rehioui
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { getConfiguration, WithProgram, withProgram } from '../lib';
import { githubItemStream } from '../streams';

const getStreamUrl = ({ user, org }: { user?: string; org?: string }) => {
    if (user) {
        return `/users/${user}/repos`;
    }
    if (org) {
        return `/orgs/${org}/repos`;
    }
    return `/user/repos?affiliation=owner`;
}

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
            const streamUrl = getStreamUrl({ user, org })
            await githubItemStream({
                githubUsername,
                githubPersonalToken,
                streamUrl,
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
