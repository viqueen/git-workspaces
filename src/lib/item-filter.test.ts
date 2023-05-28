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
import { itemFilter } from './item-filter';

describe('item-filter', () => {
    const sshItem = {
        id: 'tools_viqueen_codenav',
        urlConnection: 'ssh://git@github.com:viqueen/codenav.git',
        workspace: 'tools',
        host: 'github.com',
        namespace: 'viqueen',
        slug: 'codenav'
    };

    it('should apply partial filters', async () => {
        const devops = itemFilter({ workspace: 'devops' });
        const filtered = [sshItem].filter(devops);
        expect(filtered.length).toEqual(0);
    });
});
