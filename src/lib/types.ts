import { Identifiable } from 'leveldb-registry';

export type Input = {
    urlConnection: string;
    workspace: string;
};

export type Item = Input &
    Identifiable & {
        host: string;
        namespace: string;
        slug: string;
    };

export interface ItemFilter {
    (item: Item): boolean;
}
