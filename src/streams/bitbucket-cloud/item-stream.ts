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
import { fromInput, Item } from '../../lib';

type ItemCallback = (item: Item) => Promise<Item>;

interface BitbucketCloudItemStreamProps {
    bitbucketCloudUsername: string;
    bitbucketCloudToken: string;
    namespace: string;
    workspace: string;
    handler: ItemCallback;
}

interface BitbucketCloudItem {
    links: {
        clone: { name: string; href: string }[];
    };
}

interface BitbucketCloudItemsResponse {
    values: BitbucketCloudItem[];
    next: string | undefined;
}

const bitbucketCloudItemStream = async ({
    bitbucketCloudUsername,
    bitbucketCloudToken,
    namespace,
    workspace,
    handler
}: BitbucketCloudItemStreamProps) => {
    const credentials = btoa(
        `${bitbucketCloudUsername}:${bitbucketCloudToken}`
    );
    const streamUrl = `https://api.bitbucket.org/2.0/repositories/${namespace}`;

    const execute = async (url: string | undefined): Promise<void> => {
        if (!url) return Promise.resolve();

        const response = await fetch(url, {
            headers: {
                Authorization: `Basic ${credentials}`
            }
        });
        const data: BitbucketCloudItemsResponse = await response.json();
        const items = data.values.map(({ links }) => {
            const sshUrl = links.clone.find((l) => l.name === 'ssh')?.href;
            return sshUrl
                ? fromInput({ urlConnection: sshUrl, workspace })
                : undefined;
        });

        for (const item of items) {
            if (!item) continue;
            await handler(item).then(({ workspace, urlConnection }) =>
                console.info({ workspace, urlConnection })
            );
        }

        return execute(data.next);
    };

    await execute(streamUrl);
};

export { bitbucketCloudItemStream };
