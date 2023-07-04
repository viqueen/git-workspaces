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
import * as path from 'path';

import { leveldbRegistry } from '@labset/leveldb-registry';

import { Item } from '../../lib';

import { githubItemStream } from './item-stream';

describe('github-item-stream', () => {
    const testRegistryPath = path.resolve(
        process.cwd(),
        '.test-github-registry'
    );
    const registry = leveldbRegistry<Item>({ localPath: testRegistryPath });

    afterAll(() => {
        fs.rmSync(testRegistryPath, { recursive: true });
    });

    it('should add repo items from labset org', async () => {
        await githubItemStream({
            githubUsername: '',
            githubPersonalToken: '',
            workspace: 'tools',
            streamUrl: `/orgs/labset/repos`,
            handler: registry.add,
            githubItemFilter: () => true
        });

        const items = await registry.list();
        console.info(items);
        expect(items.length).toBeGreaterThanOrEqual(1);
    });
});
