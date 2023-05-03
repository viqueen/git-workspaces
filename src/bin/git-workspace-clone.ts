#! /usr/bin/env node

import { withCliProgress } from 'task-pool-executor';

import { getConfiguration, itemFilter, WithProgram, withProgram } from '../lib';
import { cloneItemTask } from '../tasks';

const cloneRepos: WithProgram = ({ registry, workspacesRoot }, program) => {
    program.description('clone workspace repos').action(async (opts) => {
        const { workspace, namespace, host, slug, keyword } = opts;
        await registry
            .list(itemFilter({ workspace, namespace, host, slug, keyword }))
            .then((items) => {
                return withCliProgress((taskPool) => {
                    items
                        .map(cloneItemTask({ workspacesRoot }))
                        .forEach((t) => t && taskPool.submit(t));
                });
            });
    });
};

getConfiguration().then(withProgram(cloneRepos)).catch(console.error);
