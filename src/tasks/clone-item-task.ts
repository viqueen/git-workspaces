import * as fs from 'fs';
import * as path from 'path';

import simpleGit, { SimpleGitProgressEvent } from 'simple-git';
import { CliProgressRunContext, Runnable } from 'task-pool-executor';

import { Item, itemLocation } from '../lib';

export const cloneItemTask = (props: { workspacesRoot: string }) => {
    const { workspacesRoot } = props;
    return (
        item: Item
    ): Runnable<string, CliProgressRunContext> | undefined => {
        const target = itemLocation({ workspacesRoot, item });
        if (fs.existsSync(path.resolve(target, '.git'))) return undefined;
        return {
            title: item.urlConnection,
            run: async (ctx?: CliProgressRunContext) => {
                const progress = (event: SimpleGitProgressEvent) => {
                    ctx?.progress.update(event.progress);
                };
                const git = simpleGit({ progress });
                return git.clone(item.urlConnection, target);
            }
        };
    };
};
