#! /usr/bin/env node

import { getConfiguration, itemFilter, WithProgram, withProgram } from '../lib';
import { cloneItemTask } from '../tasks';

const cloneRepos: WithProgram = ({ registry, workspacesRoot }, program) => {
    program.action(async (opts) => {
        const { workspace, namespace, host, slug, keyword } = opts;
        await registry
            .list(itemFilter({ workspace, namespace, host, slug, keyword }))
            .then((items) =>
                Promise.all(items.map(cloneItemTask({ workspacesRoot })))
            );
    });
};

getConfiguration().then(withProgram(cloneRepos));
