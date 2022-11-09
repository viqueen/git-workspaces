import { Item } from '../data/types';

export type WithOptions = {
    namespace?: string;
    workspace?: string;
    host?: string;
    slug?: string;
    keyword?: string;
};

export const itemFilter = (options: WithOptions) => {
    const { namespace, workspace, host, slug, keyword } = options;
    return (item: Item) => {
        const withNamespace = namespace ? namespace === item.namespace : true;
        const withWorkspace = workspace ? workspace === item.workspace : true;
        const withHost = host ? host === item.host : true;
        const withSlug = slug ? slug === item.slug : true;
        const withKeyword = keyword ? item.slug.includes(keyword) : true;

        return (
            withNamespace &&
            withWorkspace &&
            withHost &&
            withSlug &&
            withKeyword
        );
    };
};
