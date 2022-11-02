#! /usr/bin/env node

import { config, Configuration } from '../config';
import { Command } from 'commander';
import { fromInput } from '../data';
import * as fs from 'fs';
import * as path from 'path';

const register = (configuration: Configuration) => {
    const { workspacesRoot } = configuration;
    const registry = path.resolve(workspacesRoot, '.git-devbox');

    fs.mkdirSync(registry, { recursive: true });

    const program = new Command();
    program.option(
        '-w, --workspace <name>',
        'with workspace',
        configuration.workspacesDefault
    );
    program.argument('<urlConnection>');
    program.action((urlConnection, opts) => {
        const workspace = opts.workspace;
        const item = fromInput({ urlConnection, workspace });
        if (!item) return;

        const { ID } = item;
        const file = path.resolve(registry, `${ID}.json`);
        fs.writeFileSync(file, JSON.stringify(item, null, 2));
        console.info(`registered repo`, { workspace, urlConnection });
    });
    program.parse(process.argv);
};

config().then(register);
