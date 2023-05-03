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
