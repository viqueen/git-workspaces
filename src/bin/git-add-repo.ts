#! /usr/bin/env node

import { fromInput } from '../data';
import { getConfiguration, withProgram, WithProgram } from '../lib';

const addRepo: WithProgram = ({ registry }, program) => {
    program.argument('<urlConnection>');
    program.action(async (urlConnection, opts) => {
        const workspace = opts.workspace;
        const item = fromInput({ urlConnection, workspace });
        if (!item) return;

        await registry.add(item);
        console.info(`registered repo`, { workspace, urlConnection });
    });
};

getConfiguration().then(withProgram(addRepo));
