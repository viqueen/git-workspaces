import * as path from 'path';

import { Item } from './types';

export const itemLocation = (props: { workspacesRoot: string; item: Item }) => {
    return path.resolve(
        props.workspacesRoot,
        props.item.workspace,
        props.item.slug
    );
};
