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
export type Link = {
    rel: string;
    href: string;
    params: unknown;
};

const LINK_PATTERN = /^<(?<href>.*)>; rel="(?<rel>next|last)"$/;

const toMap = (searchParams: URLSearchParams) => {
    const map: Record<string, unknown> = {};
    searchParams.forEach((value, key) => (map[key] = value));
    return map;
};

export const linkParser = (link: string): Link | undefined => {
    const matcher = LINK_PATTERN.exec(link.trim());

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
