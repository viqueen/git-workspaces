/**
 * Copyright 2023 Hasnae Rehioui
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { Input, Item } from './types';

const SSH_URL_PATTERN =
    /^(ssh:\/\/)?([a-zA-Z\d]+)@(?<host>[a-zA-Z\d.]+(:\d+)?)([/:])(?<namespace>[a-zA-Z\d-_]+)\/(?<slug>[a-zA-Z\d-_.]+)\.git$/;
const HTTPS_URL_PATTERN =
    /^(https:\/\/)(?<host>[a-zA-Z\d.]+)\/(?<namespace>[a-zA-Z\d-_]+)\/(?<slug>[a-zA-Z\d-_.]+)\.git$/;

export const fromInput = (input: Input): Item | undefined => {
    const { urlConnection, workspace } = input;

    const matchesSSh = SSH_URL_PATTERN.exec(urlConnection);
    const matchesHttps = HTTPS_URL_PATTERN.exec(urlConnection);

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
