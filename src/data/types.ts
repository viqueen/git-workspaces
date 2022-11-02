export type Input = {
    urlConnection: string;
    workspace: string;
};

export type Item = Input & {
    host: string;
    namespace: string;
    slug: string;
    ID: string;
};
