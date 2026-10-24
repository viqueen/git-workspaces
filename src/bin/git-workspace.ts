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
import { Command } from 'commander';

import {
    configureWorkspace,
    fromInput,
    getConfiguration,
    itemLocation,
    itemStatus,
    listWorkspaceItems,
    withFilterOptions
} from '../lib';
import { cloneItemTask, submitItemTasks, syncItemTask } from '../tasks';

const program = new Command();
program.description('manage git workspaces');

withFilterOptions(program.command('list', { isDefault: true }))
    .option('--dl, --display-location', 'display location only', false)
    .option('--dc, --display-connection', 'display connection only', false)
    .option('--ds, --display-slug', 'display slug only', false)
    .option('--cl, --cloned', 'display cloned repos only', false)
    .description('list repos registered on workspace')
    .action(async (opts) => {
        const { workspacesRoot, items } = await listWorkspaceItems(opts);
        const itemsWithStatus = await Promise.all(
            items.map((item) => itemStatus({ workspacesRoot, item }))
        );
        const filtered = itemsWithStatus.filter((item) =>
            opts.cloned ? item.status !== null : true
        );
        const { displayLocation, displayConnection, displaySlug } = opts;
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
                console.info(itemLocation({ workspacesRoot, item }));
            } else if (displayConnection) {
                console.info(item.urlConnection);
            } else if (displaySlug) {
                console.info(item.slug);
            }
        });
    });

program
    .command('add')
    .description('add repo to workspace')
    .argument('<urlConnection>')
    .option('-w, --workspace <workspace>', 'with workspace')
    .action(async (urlConnection, opts) => {
        const { registry, workspacesDefault } = await getConfiguration();
        const workspace = opts.workspace ?? workspacesDefault;
        const item = fromInput({ urlConnection, workspace });
        if (!item) return;
        await registry
            .add(item)
            .then(({ workspace, urlConnection }) =>
                console.info({ workspace, urlConnection })
            );
    });

withFilterOptions(program.command('remove'))
    .description('remove workspace repos')
    .action(async (opts) => {
        const { registry, items } = await listWorkspaceItems(opts);
        await Promise.all(items.map((item) => registry.remove(item.id)));
    });

withFilterOptions(program.command('clone'))
    .description('clone workspace repos')
    .action(async (opts) => {
        const { workspacesRoot, items } = await listWorkspaceItems(opts);
        await submitItemTasks(items, cloneItemTask({ workspacesRoot }));
    });

withFilterOptions(program.command('sync'))
    .description('sync workspace repos')
    .action(async (opts) => {
        const { workspacesRoot, items } = await listWorkspaceItems(opts);
        await submitItemTasks(items, syncItemTask({ workspacesRoot }));
    });

program
    .command('config')
    .description('configure git workspaces')
    .action(async () => {
        await configureWorkspace();
    });

program.parseAsync(process.argv).catch(console.error);
