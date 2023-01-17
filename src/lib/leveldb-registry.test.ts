import * as path from 'path';
import { leveldbRegistry } from './leveldb-registry';
import fs from 'fs';
import { fromInput } from './from-input';

describe('leveldb-registry', () => {
    const testRegistryPath = path.resolve(process.cwd(), '.test-registry');
    const registry = leveldbRegistry(testRegistryPath);

    afterAll(() => {
        fs.rmSync(testRegistryPath, { recursive: true });
    });

    it('should add item to registry', async () => {
        const input = {
            urlConnection: 'ssh://git@github.com:viqueen/git-devbox.git',
            workspace: 'tools'
        };
        const item = fromInput(input);
        expect(item).toBeDefined();

        await registry.add(item!);

        const found = await registry.fetch(item!.ID);
        expect(found).toBeDefined();

        const notFound = await registry.fetch('not-found');
        expect(notFound).toBeUndefined();

        const items = await registry.list();
        expect(items).toEqual([item]);
    });
});
