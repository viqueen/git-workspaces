#! /usr/bin/env node

import { fromInput, getConfiguration, withProgram, WithProgram } from '../lib';

const addRepo: WithProgram = ({ registry }, program) => {
    program
        .description('add repo to workspace')
        .argument('<urlConnection>')
        .action(async (urlConnection, opts) => {
            const workspace = opts.workspace;
            const item = fromInput({ urlConnection, workspace });
            if (!item) return;

            await registry
                .add(item)
                .then(({ workspace, urlConnection }) =>
                    console.info({ workspace, urlConnection })
                );
        });
};

getConfiguration().then(withProgram(addRepo)).catch(console.error);
