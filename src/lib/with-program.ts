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
            '-w, --workspace',
            'with workspace',
            configuration.workspacesDefault
        );
        fn(configuration, program);
        program.parse(process.argv);
    };
};
