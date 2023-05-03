import * as fs from 'fs';
import path from 'path';

import { leveldbRegistry, Registry } from 'leveldb-registry';
import camelCase from 'lodash/camelCase';
import { simpleGit, GitConfigScope } from 'simple-git';

import { Item } from './types';

export type Configuration = {
    workspacesRoot: string;
    workspacesDefault: string;
    githubUsername: string;
    githubPersonalToken: string;

    registry: Registry<Item>;
};

export const getConfiguration = async (): Promise<Configuration> => {
    const list = await simpleGit().listConfig(GitConfigScope.global);
    const config = Object.entries(list.all)
        .filter(([key]) => key.startsWith('devbox.'))
        .reduce((prev, current) => {
            const key = current[0].replace(/devbox\./, '');
            const camelCaseKey = camelCase(key);
            prev[camelCaseKey] = current[1] as string;
            return prev;
        }, {} as Record<string, string>);

    const gitConfig = config as Omit<Configuration, 'registry'>;
    fs.mkdirSync(gitConfig.workspacesRoot, { recursive: true });

    const registryPath = path.resolve(gitConfig.workspacesRoot, '.git-devbox');
    const registry = leveldbRegistry<Item>({ localPath: registryPath });
    return { ...gitConfig, registry };
};
