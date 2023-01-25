import axios from 'axios';
import { Item, fromInput, linkParser, Link } from '../lib';

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
    kind: string;
    namespace: string;
    handler: ItemCallback;
    githubItemFilter: GithubItemFilter;
};

export const githubItemStream = async ({
    githubUsername,
    githubPersonalToken,
    workspace,
    kind,
    namespace,
    handler,
    githubItemFilter
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
