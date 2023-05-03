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
    return () => ({
        deleteLocalBranch: jest.fn(() => {
            return Promise.resolve('DONE');
        })
    });
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
