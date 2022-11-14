import { itemFilter } from './item-filter';

describe('item-filter', () => {
    const sshItem = {
        ID: 'tools_viqueen_codenav',
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
