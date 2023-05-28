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
import { fromInput } from './from-input';

describe('from-input', () => {
    const sshItem = {
        id: 'tools_viqueen_codenav',
        urlConnection: 'ssh://git@github.com:viqueen/codenav.git',
        workspace: 'tools',
        host: 'github.com',
        namespace: 'viqueen',
        slug: 'codenav'
    };

    const httpsItem = {
        id: 'tools_viqueen_devbox',
        urlConnection: 'https://github.com/viqueen/devbox.git',
        workspace: 'tools',
        host: 'github.com',
        namespace: 'viqueen',
        slug: 'devbox'
    };

    it('should extract item details from ssh connection', () => {
        const { urlConnection, workspace } = sshItem;
        const parsedItem = fromInput({ urlConnection, workspace });
        expect(parsedItem).toEqual(sshItem);
    });

    it('should extract item details from https connection', () => {
        const { urlConnection, workspace } = httpsItem;
        const parsedItem = fromInput({ urlConnection, workspace });
        expect(parsedItem).toEqual(httpsItem);
    });

    it('should not extract details from invalid url connection', () => {
        const parsedItem = fromInput({
            urlConnection: 'invalid.git',
            workspace: 'tools'
        });
        expect(parsedItem).toBeUndefined();
    });
});
