#! /usr/bin/env node

import { getConfiguration, itemFilter, withProgram, WithProgram } from '../lib';

const listRepos: WithProgram = ({ registry }, program) => {
    program.action(async (opts) => {
        const { workspace, namespace, host, slug, keyword } = opts;
        await registry
            .list(itemFilter({ workspace, namespace, host, slug, keyword }))
            .then((items) =>
                console.table(items, ['workspace', 'namespace', 'slug'])
            );
    });
};

getConfiguration().then(withProgram(listRepos));
