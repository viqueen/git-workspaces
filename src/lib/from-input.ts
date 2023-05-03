import type { Input, Item } from './types';

const SSH_URL_PATTERN =
    /^(?<protocol>ssh:\/\/)?([a-zA-Z\d]+)@(?<host>[a-zA-Z\d.]+(:\d+)?)([/:])(?<namespace>[a-zA-Z\d-_]+)\/(?<slug>[a-zA-Z\d-_.]+)\.git$/;
const HTTPS_URL_PATTERN =
    /^(?<protocol>https:\/\/)(?<host>[a-zA-Z\d.]+)\/(?<namespace>[a-zA-Z\d-_]+)\/(?<slug>[a-zA-Z\d-_.]+)\.git$/;

export const fromInput = (input: Input): Item | undefined => {
    const { urlConnection, workspace } = input;

    const matchesSSh = urlConnection.match(SSH_URL_PATTERN);
    const matchesHttps = urlConnection.match(HTTPS_URL_PATTERN);

    const urlMatch = matchesSSh || matchesHttps;

    if (!urlMatch) {
        console.warn('invalid url connection', urlConnection);
        return;
    }

    const groups = urlMatch.groups || {};
    const host = groups['host'];
    const namespace = groups['namespace'];
    const slug = groups['slug'];
    const id = [workspace, namespace, slug].join('_');

    return {
        id,
        urlConnection,
        workspace,
        host,
        namespace,
        slug
    };
};
