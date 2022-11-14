#! /usr/bin/env node

import { fromInput, getConfiguration, withProgram, WithProgram } from '../lib';

const addRepo: WithProgram = ({ registry }, program) => {
    program.argument('<urlConnection>');
    program.action(async (urlConnection, opts) => {
        const workspace = opts.workspace;
        const item = fromInput({ urlConnection, workspace });
        if (!item) return;

        await registry.add(item);
    });
};

getConfiguration().then(withProgram(addRepo));
