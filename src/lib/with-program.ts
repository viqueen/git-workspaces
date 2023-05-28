/**
 * Copyright 2023 Hasnae Rehioui
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Command } from 'commander';

import { Configuration } from './get-configuration';

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
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        program.version(require('../../package.json').version);
        program.parse(process.argv);
    };
};
