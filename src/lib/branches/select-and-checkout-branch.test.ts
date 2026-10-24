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
import { selectAndCheckoutBranch } from './select-and-checkout-branch';

jest.mock('inquirer', () => {
    return {
        prompt: jest.fn(() => {
            return Promise.resolve({
                branchDetails: 'noissue/check-me-out'
            });
        })
    };
});

jest.mock('simple-git', () => {
    return {
        simpleGit: jest.fn(() => ({
            checkout: jest.fn(() => {
                return Promise.resolve('DONE');
            })
        }))
    };
});

describe('select-and-checkout-branch', () => {
    it('should select and checkout branch', async () => {
        const result = await selectAndCheckoutBranch(
            /(?<branchName>noissue\/.*)/
        )(['does-not-matter']);
        expect(result).toEqual('DONE');
    });
    it('should not checkout the branch if the pattern does not match', async () => {
        const result = await selectAndCheckoutBranch(
            /(?<branchName>feature\/.*)/
        )(['does-not-matter']);
        expect(result).toBeUndefined();
    });
});
