import { Item, itemLocation } from '../lib';
import * as fs from 'fs';
import * as path from 'path';
import simpleGit from 'simple-git';

export const cloneItemTask = (props: { workspacesRoot: string }) => {
    const { workspacesRoot } = props;
    return async (item: Item) => {
        const target = itemLocation({ workspacesRoot, item });
        if (fs.existsSync(path.resolve(target, '.git'))) {
            console.warn(`✅ cloned    : ${target}`);
            return Promise.resolve();
        }
        console.info(`🌀 cloning   : ${target}`);
        return simpleGit()
            .clone(item.urlConnection, target)
            .then(() => console.info(`✅ done      : ${target}`))
            .catch((error) => console.error(`❌ error     : ${target}`, error));
    };
};
