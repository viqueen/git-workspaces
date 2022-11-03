#! /usr/bin/env node

import { fromInput } from '../data';
import { leveldbStore } from '../data/leveldb-store';
import { getConfiguration } from '../lib/get-configuration';
import { withProgram, WithProgram } from '../lib/with-program';

const addRepo: WithProgram = (configuration, program) => {
    program.argument('<urlConnection>');
    program.action(async (urlConnection, opts) => {
        const workspace = opts.workspace;
        const item = fromInput({ urlConnection, workspace });
        if (!item) return;

        await leveldbStore(configuration.registry).add(item);
        console.info(`registered repo`, { workspace, urlConnection });
    });
};

getConfiguration().then(withProgram(addRepo));
