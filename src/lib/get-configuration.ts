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
import * as fs from 'fs';
import path from 'path';

import { leveldbRegistry, Registry } from '@labset/leveldb-registry';
import camelCase from 'lodash/camelCase';
import { simpleGit, GitConfigScope } from 'simple-git';

import { Item } from './types';

export type Configuration = {
    workspacesRoot: string;
    workspacesDefault: string;

    bitbucketCloudUsername: string;
    bitbucketCloudToken: string;

    githubUsername: string;
    githubPersonalToken: string;

    registry: Registry<Item>;
};

export const getConfiguration = async (): Promise<Configuration> => {
    const list = await simpleGit().listConfig(GitConfigScope.global);
    const config = Object.entries(list.all)
        .filter(([key]) => key.startsWith('labset.'))
        .reduce((prev, current) => {
            const key = current[0].replace(/labset\./, '');
            const camelCaseKey = camelCase(key);
            prev[camelCaseKey] = current[1] as string;
            return prev;
        }, {} as Record<string, string>);

    const gitConfig = config as Omit<Configuration, 'registry'>;
    fs.mkdirSync(gitConfig.workspacesRoot, { recursive: true });

    const registryPath = path.resolve(
        gitConfig.workspacesRoot,
        '.git-workspace'
    );
    const registry = leveldbRegistry<Item>({ localPath: registryPath });
    return { ...gitConfig, registry };
};
