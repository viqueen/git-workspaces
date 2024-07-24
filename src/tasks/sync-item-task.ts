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
import fs from 'fs';
import path from 'path';

import { CliProgressRunContext, Runnable } from '@labset/task-pool-executor';
import { simpleGit } from 'simple-git';
import type { PullResult, SimpleGitProgressEvent } from 'simple-git';

import { Item, itemLocation } from '../lib';

const syncItemTask = (props: { workspacesRoot: string }) => {
    const { workspacesRoot } = props;
    return (
        item: Item
    ): Runnable<PullResult, CliProgressRunContext> | undefined => {
        const target = itemLocation({ workspacesRoot, item });
        if (!fs.existsSync(path.resolve(target, '.git'))) return undefined;
        return {
            title: item.urlConnection,
            run: async (ctx?: CliProgressRunContext) => {
                const progress = (event: SimpleGitProgressEvent) => {
                    ctx?.progress.update(event.progress);
                };
                const git = simpleGit(target, { progress });
                return git.pull();
            }
        };
    };
};

export { syncItemTask };
