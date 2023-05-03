#! /usr/bin/env node

import {
    getConfiguration,
    itemFilter,
    itemLocation,
    withProgram,
    WithProgram
} from '../lib';

const listRepos: WithProgram = ({ workspacesRoot, registry }, program) => {
    program
        .option('-dl, --display-location', 'display location only', false)
        .option('-dc, --display-connection', 'display connection only', false)
        .option('-ds, --display-slug', 'display slug only', false)
        .description('list repos registered on workspace')
        .action(async (opts) => {
            const { workspace, namespace, host, slug, keyword } = opts;
            await registry
                .list(itemFilter({ workspace, namespace, host, slug, keyword }))
                .then((items) => {
                    const { displayLocation, displayConnection, displaySlug } =
                        opts;
                    const displayOptionEnabled =
                        displayLocation || displayConnection || displaySlug;

                    if (!displayOptionEnabled) {
                        console.table(items, [
                            'workspace',
                            'namespace',
                            'slug'
                        ]);
                        return;
                    }

                    items.forEach((item) => {
                        if (displayLocation) {
                            const target = itemLocation({
                                workspacesRoot,
                                item
                            });
                            console.info(target);
                        } else if (displayConnection) {
                            console.info(item.urlConnection);
                        } else if (displaySlug) {
                            console.info(item.slug);
                        }
                    });
                });
        });
};

getConfiguration().then(withProgram(listRepos)).catch(console.error);
