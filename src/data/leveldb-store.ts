import LevelUp from 'levelup';
import LevelDOWN from 'leveldown';
import type { Item, ItemFilter } from './types';

export const leveldbStore = (storePath: string) => {
    const withStore = async <T>(
        fn: (s: LevelUp.LevelUp) => Promise<T>
    ): Promise<T> => {
        const db = LevelUp(LevelDOWN(storePath));
        const result = await fn(db);
        await db.close();
        return result;
    };

    const add = async (item: Item) => {
        return withStore<void>((store) =>
            store.put(item.ID, JSON.stringify(item))
        );
    };

    const list = async (filter: ItemFilter): Promise<Item[]> => {
        return withStore<Item[]>((store) => {
            return new Promise<Item[]>((resolve, reject) => {
                const items: Item[] = [];
                store
                    .createValueStream()
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

    return { add, list };
};
