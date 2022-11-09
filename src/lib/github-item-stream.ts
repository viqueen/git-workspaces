import axios from 'axios';
import { Item } from '../data/types';
import { fromInput, linkParser } from '../data';

type ItemCallback = (item: Item) => Promise<void>;

type GithubItemStreamProps = {
    githubUsername: string;
    githubPersonalToken: string;

    workspace: string;
    kind: string;
    namespace: string;
    handler: ItemCallback;
};

type GithubItem = {
    ssh_url: string;
    fork: boolean;
    archived: boolean;
};

export const githubItemStream = async ({
    githubUsername,
    githubPersonalToken,
    workspace,
    kind,
    namespace,
    handler
}: GithubItemStreamProps) => {
    const client = axios.create({
        baseURL: `https://api.github.com`,
        auth: {
            username: githubUsername,
            password: githubPersonalToken
        }
    });

    const streamUrl = `/${kind}/${namespace}/repos`;

    const execute = async (params: any | undefined): Promise<void> => {
        if (!params) return Promise.resolve();

        const response = await client.get<GithubItem[]>(streamUrl, { params });
        const items = response.data
            .map(({ ssh_url }) =>
                fromInput({ urlConnection: ssh_url, workspace })
            )
            .filter((item) => item !== undefined);
        for (const item of items) {
            await handler(item);
        }

        const linkHeader = response.headers.link || '';
        const nextLinks = linkHeader
            .split(/\s*,\s*/)
            .map(linkParser)
            .filter((link) => {
                return link?.rel === 'next';
            });
        const nextParams =
            nextLinks.length === 1 ? nextLinks[0].params : undefined;
        return await execute(nextParams);
    };

    await execute({});
};
