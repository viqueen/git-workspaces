export type Link = {
    rel: string;
    href: string;
    params: any;
};

const LINK_PATTERN = /^<(?<href>.*)>; rel="(?<rel>next|last)"$/;

const toMap = (searchParams: URLSearchParams) => {
    const map: Record<string, any> = {};
    searchParams.forEach((value, key) => (map[key] = value));
    return map;
};

export const linkParser = (link: string): Link | undefined => {
    const matcher = link.trim().match(LINK_PATTERN);

    if (!matcher) {
        return;
    }

    const groups = matcher.groups || {};
    const href = groups['href'];
    const params = toMap(new URLSearchParams(new URL(href).search));
    return {
        href: href,
        rel: groups['rel'],
        params
    };
};
