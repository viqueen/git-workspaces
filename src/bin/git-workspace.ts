#! /usr/bin/env node

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
import {
    getConfiguration,
    itemFilter,
    itemLocation,
    withProgram,
    WithProgram
} from '../lib';
import { itemStatus } from '../lib/item-status';

const listRepos: WithProgram = ({ workspacesRoot, registry }, program) => {
    program
        .option('-dl, --display-location', 'display location only', false)
        .option('-dc, --display-connection', 'display connection only', false)
        .option('-ds, --display-slug', 'display slug only', false)
        .option('-cl, --cloned', 'display cloned repos only', false)
        .description('list repos registered on workspace')
        .action(async (opts) => {
            const { workspace, namespace, host, slug, keyword, cloned } = opts;
            await registry
                .list(itemFilter({ workspace, namespace, host, slug, keyword }))
                .then(async (items) => {
                    return await Promise.all(
                        items.map((item) =>
                            itemStatus({ workspacesRoot, item })
                        )
                    );
                })
                .then((itemsWithStatus) => {
                    const filtered = itemsWithStatus.filter((item) => {
                        return cloned ? item.status !== null : true;
                    });
                    const { displayLocation, displayConnection, displaySlug } =
                        opts;
                    const displayOptionEnabled =
                        displayLocation || displayConnection || displaySlug;

                    if (!displayOptionEnabled) {
                        console.table(filtered, [
                            'workspace',
                            'namespace',
                            'slug',
                            'status'
                        ]);
                        return;
                    }

                    filtered.forEach((item) => {
                        if (displayLocation) {
                            const target = itemLocation({
                                workspacesRoot,
                                item
                            });
                            console.info(target);
                        } else if (displayConnection) {
                            console.info(item.urlConnection);
                        } else if (displaySlug) {
                            console.info(item.slug);
                        }
                    });
                });
        });
};

getConfiguration().then(withProgram(listRepos)).catch(console.error);
