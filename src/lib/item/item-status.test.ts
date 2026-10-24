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

import { type SimpleGit, simpleGit } from 'simple-git';

import { itemStatus } from './item-status';
import { Item } from './types';

jest.mock('fs');
jest.mock('simple-git');
jest.mock('./item-location', () => ({
    itemLocation: jest.fn(
        ({ workspacesRoot, item }) =>
            `${workspacesRoot}/${item.workspace}/${item.slug}`
    )
}));

describe('itemStatus', () => {
    const mockFs = fs as jest.Mocked<typeof fs>;
    const mockSimpleGit = simpleGit as jest.MockedFunction<typeof simpleGit>;

    const mockItem: Item = {
        id: 'test-id',
        urlConnection: 'https://github.com/test/repo.git',
        workspace: 'test-workspace',
        host: 'github.com',
        namespace: 'test',
        slug: 'repo'
    };

    const workspacesRoot = '/home/user/workspaces';
    const expectedLocation = '/home/user/workspaces/test-workspace/repo';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return null status when location does not exist', async () => {
        mockFs.existsSync.mockReturnValue(false);

        const result = await itemStatus({ workspacesRoot, item: mockItem });

        expect(result).toEqual({
            ...mockItem,
            status: null
        });
        expect(mockFs.existsSync).toHaveBeenCalledWith(expectedLocation);
        expect(mockFs.existsSync).toHaveBeenCalledTimes(1);
        expect(mockSimpleGit).not.toHaveBeenCalled();
    });

    it('should return null status when .git directory does not exist', async () => {
        mockFs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);

        const result = await itemStatus({ workspacesRoot, item: mockItem });

        expect(result).toEqual({
            ...mockItem,
            status: null
        });
        expect(mockFs.existsSync).toHaveBeenCalledWith(expectedLocation);
        expect(mockFs.existsSync).toHaveBeenCalledWith(
            `${expectedLocation}/.git`
        );
        expect(mockFs.existsSync).toHaveBeenCalledTimes(2);
        expect(mockSimpleGit).not.toHaveBeenCalled();
    });

    it('should return current branch status when repository exists', async () => {
        const currentBranch = 'main';
        const mockGitInstance = {
            status: jest.fn().mockResolvedValue({
                current: currentBranch,
                tracking: 'origin/main',
                ahead: 0,
                behind: 0,
                files: [],
                created: [],
                deleted: [],
                modified: [],
                renamed: [],
                conflicted: []
            })
        };

        mockFs.existsSync.mockReturnValue(true);
        mockSimpleGit.mockReturnValue(mockGitInstance as unknown as SimpleGit);

        const result = await itemStatus({ workspacesRoot, item: mockItem });

        expect(result).toEqual({
            ...mockItem,
            status: currentBranch
        });
        expect(mockFs.existsSync).toHaveBeenCalledWith(expectedLocation);
        expect(mockFs.existsSync).toHaveBeenCalledWith(
            `${expectedLocation}/.git`
        );
        expect(mockSimpleGit).toHaveBeenCalledWith(expectedLocation);
        expect(mockGitInstance.status).toHaveBeenCalled();
    });

    it('should handle different branch names', async () => {
        const currentBranch = 'feature/new-feature';
        const mockGitInstance = {
            status: jest.fn().mockResolvedValue({
                current: currentBranch,
                tracking: null,
                ahead: 0,
                behind: 0,
                files: [],
                created: [],
                deleted: [],
                modified: [],
                renamed: [],
                conflicted: []
            })
        };

        mockFs.existsSync.mockReturnValue(true);
        mockSimpleGit.mockReturnValue(mockGitInstance as unknown as SimpleGit);

        const result = await itemStatus({ workspacesRoot, item: mockItem });

        expect(result).toEqual({
            ...mockItem,
            status: currentBranch
        });
        expect(mockGitInstance.status).toHaveBeenCalled();
    });

    it('should handle git status errors gracefully', async () => {
        const mockGitInstance = {
            status: jest.fn().mockRejectedValue(new Error('Git error'))
        };

        mockFs.existsSync.mockReturnValue(true);
        mockSimpleGit.mockReturnValue(mockGitInstance as unknown as SimpleGit);

        await expect(
            itemStatus({ workspacesRoot, item: mockItem })
        ).rejects.toThrow('Git error');

        expect(mockGitInstance.status).toHaveBeenCalled();
    });

    it('should handle detached HEAD state', async () => {
        const detachedHead = null;
        const mockGitInstance = {
            status: jest.fn().mockResolvedValue({
                current: detachedHead,
                tracking: null,
                ahead: 0,
                behind: 0,
                files: [],
                created: [],
                deleted: [],
                modified: [],
                renamed: [],
                conflicted: [],
                detached: true
            })
        };

        mockFs.existsSync.mockReturnValue(true);
        mockSimpleGit.mockReturnValue(mockGitInstance as unknown as SimpleGit);

        const result = await itemStatus({ workspacesRoot, item: mockItem });

        expect(result).toEqual({
            ...mockItem,
            status: detachedHead
        });
        expect(mockGitInstance.status).toHaveBeenCalled();
    });

    it('should work with different workspace roots', async () => {
        const customWorkspacesRoot = '/custom/path/workspaces';
        const customLocation = '/custom/path/workspaces/test-workspace/repo';
        const currentBranch = 'develop';
        const mockGitInstance = {
            status: jest.fn().mockResolvedValue({
                current: currentBranch,
                tracking: 'origin/develop',
                ahead: 2,
                behind: 1,
                files: [],
                created: [],
                deleted: [],
                modified: [],
                renamed: [],
                conflicted: []
            })
        };

        mockFs.existsSync.mockReturnValue(true);
        mockSimpleGit.mockReturnValue(mockGitInstance as unknown as SimpleGit);

        const result = await itemStatus({
            workspacesRoot: customWorkspacesRoot,
            item: mockItem
        });

        expect(result).toEqual({
            ...mockItem,
            status: currentBranch
        });
        expect(mockFs.existsSync).toHaveBeenCalledWith(customLocation);
        expect(mockFs.existsSync).toHaveBeenCalledWith(
            `${customLocation}/.git`
        );
        expect(mockSimpleGit).toHaveBeenCalledWith(customLocation);
    });

    it('should handle empty current branch', async () => {
        const emptyBranch = '';
        const mockGitInstance = {
            status: jest.fn().mockResolvedValue({
                current: emptyBranch,
                tracking: null,
                ahead: 0,
                behind: 0,
                files: [],
                created: [],
                deleted: [],
                modified: [],
                renamed: [],
                conflicted: []
            })
        };

        mockFs.existsSync.mockReturnValue(true);
        mockSimpleGit.mockReturnValue(mockGitInstance as unknown as SimpleGit);

        const result = await itemStatus({ workspacesRoot, item: mockItem });

        expect(result).toEqual({
            ...mockItem,
            status: emptyBranch
        });
        expect(mockGitInstance.status).toHaveBeenCalled();
    });
});
