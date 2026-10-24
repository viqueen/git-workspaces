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
import fs from 'fs';

import { simpleGit } from 'simple-git';

import { itemLocation } from './item-location';
import { Item } from './types';

type ItemStatusProps = {
    workspacesRoot: string;
    item: Item;
};

const itemStatus = async ({
    workspacesRoot,
    item
}: ItemStatusProps): Promise<Item & { status: string | null }> => {
    const location = itemLocation({ workspacesRoot, item });
    if (!fs.existsSync(location) || !fs.existsSync(`${location}/.git`)) {
        return { ...item, status: null };
    }
    const status = await simpleGit(location)
        .status()
        .then((result) => {
            return result.current;
        });
    return { ...item, status };
};

export { itemStatus };
