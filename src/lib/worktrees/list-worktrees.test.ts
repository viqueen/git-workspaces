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
import { listWorktrees } from './list-worktrees';

const porcelain = [
    'worktree /repo',
    'HEAD abc123',
    'branch refs/heads/main',
    '',
    'worktree /repo-worktrees/feature',
    'HEAD def456',
    'branch refs/heads/feature',
    ''
].join('\n');

jest.mock('simple-git', () => {
    return {
        simpleGit: jest.fn(() => ({
            raw: jest.fn(() => Promise.resolve(porcelain))
        }))
    };
});

describe('list-worktrees', () => {
    it('should parse the porcelain output and mark the main worktree', async () => {
        const worktrees = await listWorktrees();
        expect(worktrees).toEqual([
            { path: '/repo', head: 'abc123', branch: 'main', main: true },
            {
                path: '/repo-worktrees/feature',
                head: 'def456',
                branch: 'feature',
                main: false
            }
        ]);
    });
});
