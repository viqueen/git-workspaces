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
import { Item } from './types';

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
