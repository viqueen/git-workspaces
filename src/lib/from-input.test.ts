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
