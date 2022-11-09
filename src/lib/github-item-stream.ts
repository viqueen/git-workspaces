import axios from 'axios';
import { Item } from '../data/types';
import { fromInput } from '../data';

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

    const execute = async () => {
        const result = await client.get<GithubItem[]>(streamUrl);
        console.info(result.headers);
        const items = result.data
            .map(({ ssh_url }) =>
                fromInput({ urlConnection: ssh_url, workspace })
            )
            .filter((item) => item !== undefined);
        for (const item of items) {
            await handler(item);
        }
    };

    await execute();
};
