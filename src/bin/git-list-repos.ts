#! /usr/bin/env node

import { getConfiguration, withProgram, WithProgram } from '../lib';

const listRepos: WithProgram = ({ registry }, program) => {
    program.action(async (opts) => {
        const { workspace } = opts;
        await registry
            .list((item) => item.workspace === workspace)
            .then(console.table);
    });
};

getConfiguration().then(withProgram(listRepos));
