import * as QueryString from 'querystring';

export type Link = {
    rel: string;
    href: string;
    params: any;
};

const LINK_PATTERN = /^<(?<href>.*)>; rel="(?<rel>next|last)"$/;

export const linkParser = (link: string): Link | undefined => {
    const matcher = link.match(LINK_PATTERN);

    if (!matcher) {
        return;
    }

    const groups = matcher.groups || {};
    const href = groups['href'];
    return {
        href: href,
        rel: groups['rel'],
        params: QueryString.parse(new URL(href).search)
    };
};
