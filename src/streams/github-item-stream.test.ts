import path from 'path';
import { leveldbRegistry } from '../lib/leveldb-registry';
import { githubItemStream } from './github-item-stream';
import * as fs from 'fs';

describe('github-item-stream', () => {
    const testRegistryPath = path.resolve(
        process.cwd(),
        '.test-github-registry'
    );
    const registry = leveldbRegistry(testRegistryPath);

    afterAll(() => {
        fs.rmSync(testRegistryPath, { recursive: true });
    });

    it('should add repo items from labset org', async () => {
        await githubItemStream({
            githubUsername: '',
            githubPersonalToken: '',
            workspace: 'tools',
            kind: 'orgs',
            namespace: 'labset',
            handler: registry.add,
            githubItemFilter: () => true
        });

        const items = await registry.list();
        console.info(items);
        expect(items.length).toBeGreaterThanOrEqual(1);
    });
});
