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
import axios from 'axios';

import { fromInput, Item, Link, linkParser } from '../../lib';

type ItemCallback = (item: Item) => Promise<Item>;

type GithubItem = {
    ssh_url: string;
    fork: boolean;
    archived: boolean;
};

type GithubItemFilter = (item: GithubItem) => boolean;

type GithubItemStreamProps = {
    githubUsername: string;
    githubPersonalToken: string;

    workspace: string;
    streamUrl: string;
    handler: ItemCallback;
    githubItemFilter: GithubItemFilter;
};

const githubItemStream = async ({
    githubUsername,
    githubPersonalToken,
    streamUrl,
    githubItemFilter,
    handler,
    workspace
}: GithubItemStreamProps) => {
    const client = axios.create({
        baseURL: `https://api.github.com`,
        auth: {
            username: githubUsername,
            password: githubPersonalToken
        }
    });

    const execute = async (params: unknown | undefined): Promise<void> => {
        if (!params) return Promise.resolve();

        const response = await client.get<GithubItem[]>(streamUrl, { params });
        const items = response.data
            .filter(githubItemFilter)
            .map(({ ssh_url }) =>
                fromInput({ urlConnection: ssh_url, workspace })
            )
            .filter((item) => item !== undefined);

        for (const item of items) {
            if (!item) continue;
            await handler(item).then(({ workspace, urlConnection }) =>
                console.info({ workspace, urlConnection })
            );
        }

        const linkHeader = response.headers.link || '';
        const nextLinks = linkHeader
            .split(',')
            .map(linkParser)
            .filter((link: Link | undefined) => {
                return link?.rel === 'next';
            });
        const nextParams =
            nextLinks.length === 1 ? nextLinks[0]?.params : undefined;
        return execute(nextParams);
    };

    await execute({});
};

export { githubItemStream };
