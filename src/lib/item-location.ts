import { Item } from './types';
import * as path from 'path';

export const itemLocation = (props: { workspacesRoot: string; item: Item }) => {
    return path.resolve(
        props.workspacesRoot,
        props.item.workspace,
        props.item.slug
    );
};
