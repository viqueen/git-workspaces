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
import { selectAndDeleteBranches } from './select-and-delete-branches';

jest.mock('inquirer', () => {
    return {
        prompt: jest.fn(() => {
            return Promise.resolve({
                selectedBranches: ['noissue/delete-me-locally']
            });
        })
    };
});

jest.mock('simple-git', () => {
    return {
        simpleGit: jest.fn(() => ({
            deleteLocalBranch: jest.fn(() => {
                return Promise.resolve('DONE');
            })
        }))
    };
});

jest.spyOn(console, 'table');

describe('select-and-delete-branches', () => {
    it('should select and delete branch', async () => {
        await selectAndDeleteBranches(/(?<branchName>noissue\/.*)/)([
            'does-not-matter'
        ]);
        expect(jest.mocked(console.table).mock.calls).toHaveLength(1);
    });
});
