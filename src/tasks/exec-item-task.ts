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

import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import { Item, itemLocation } from '../lib';

interface ExecItemTaskProps {
    workspacesRoot: string;
    executableFile: string;
    args: string[];
}

const execItemTask = ({
    workspacesRoot,
    executableFile,
    args
}: ExecItemTaskProps) => {
    return async (item: Item) => {
        const target = itemLocation({ workspacesRoot, item });
        if (!fs.existsSync(path.resolve(target, '.git'))) return undefined;

        return execFileSync(executableFile, args, {
            cwd: target,
            stdio: 'inherit'
        });
    };
};

export { execItemTask };
