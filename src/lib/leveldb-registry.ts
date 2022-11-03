import { Item, ItemFilter } from '../data/types';
import LevelUp from 'levelup';
import LevelDOWN from 'leveldown';

export type Registry = {
    add: (item: Item) => Promise<void>;
    fetch: (id: string) => Promise<Item | undefined>;
    list: (filter?: ItemFilter) => Promise<Item[]>;
};

export const leveldbRegistry = (registryPath: string): Registry => {
    const withLeveldb = async <T>(
        fn: (s: LevelUp.LevelUp) => Promise<T>
    ): Promise<T> => {
        const db = LevelUp(LevelDOWN(registryPath));
        const result = await fn(db);
        await db.close();
        return result;
    };

    const add = async (item: Item): Promise<void> => {
        return withLeveldb<void>((r) => r.put(item.ID, JSON.stringify(item)));
    };

    const fetch = async (id: string): Promise<Item | undefined> => {
        return withLeveldb<Item>(async (r) => {
            try {
                return await r.get(id).then(JSON.parse);
            } catch (error) {
                return undefined;
            }
        });
    };

    const list = async (filter: ItemFilter = () => true): Promise<Item[]> => {
        return withLeveldb<Item[]>((r) => {
            return new Promise<Item[]>((resolve, reject) => {
                const items: Item[] = [];
                r.createValueStream()
                    .on('data', (data: string) => {
                        const item = JSON.parse(data) as Item;
                        if (filter(item)) items.push(item);
                    })
                    .on('close', () => resolve(items))
                    .on('end', () => resolve(items))
                    .on('error', () => reject());
            });
        });
    };

    return { add, fetch, list };
};
