import { linkParser } from './link-parser';

describe('link-parser', () => {
    it('should parse a single valid links', () => {
        const link =
            '<https://api.github.com/user/12345/repos?page=2>; rel="next"';
        const result = linkParser(link);
        expect(result).toEqual({
            rel: 'next',
            href: 'https://api.github.com/user/12345/repos?page=2',
            params: { page: '2' }
        });
    });

    it('should not parse invalid links', () => {
        const link = '<https://api.github.com/user/12345/repos?page=2>;';
        const result = linkParser(link);
        expect(result).toBeUndefined();
    });
});
