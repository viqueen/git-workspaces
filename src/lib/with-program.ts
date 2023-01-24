import { Configuration } from './get-configuration';
import { Command } from 'commander';

export type WithProgram = (
    configuration: Configuration,
    program: Command
) => void;

export const withProgram = (fn: WithProgram) => {
    return async (configuration: Configuration) => {
        const program = new Command();
        program.option(
            '-w, --workspace <workspace>',
            'with workspace',
            configuration.workspacesDefault
        );
        program.option('-ns, --namespace <namespace>', 'filter by namespace');
        program.option('-h, --host <host>', 'filter by host');
        program.option('-s, --slug <slug>', 'filter by name or slug');
        program.option('-k, --keyword <keyword>', 'filter by keyword');
        fn(configuration, program);
        program.version(require('../../package.json').version);
        program.parse(process.argv);
    };
};
