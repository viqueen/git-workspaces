import { getConfiguration, itemFilter, withProgram, WithProgram } from '../lib';

const removeRepos: WithProgram = ({ registry }, program) => {
    program.description('remove workspace repos').action(async (opts) => {
        const { workspace, namespace, host, slug, keyword } = opts;
        const targets = await registry.list(
            itemFilter({ workspace, namespace, host, slug, keyword })
        );
        await Promise.all(targets.map((target) => registry.remove(target.id)));
    });
};

getConfiguration().then(withProgram(removeRepos)).catch(console.error);
