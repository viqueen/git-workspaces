#! /usr/bin/env node

import { getConfiguration, WithProgram, withProgram } from '../lib';
import { itemFilter } from '../data';
import { cloneItemCommand } from '../command/clone-item-command';

const cloneRepos: WithProgram = ({ registry, workspacesRoot }, program) => {
    program.action(async (opts) => {
        const { workspace, namespace, host, slug, keyword } = opts;
        await registry
            .list(itemFilter({ workspace, namespace, host, slug, keyword }))
            .then((items) =>
                Promise.all(items.map(cloneItemCommand({ workspacesRoot })))
            );
    });
};

getConfiguration().then(withProgram(cloneRepos));
