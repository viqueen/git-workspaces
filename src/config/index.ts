import camelCase from 'lodash/camelCase';
import simpleGit, { GitConfigScope } from 'simple-git';
import path from 'path';

export type Configuration = {
    workspacesRoot: string;
    workspacesDefault: string;
    githubUsername: string;
    githubPersonalToken: string;
};

export const config = async (): Promise<Configuration> => {
    const list = await simpleGit().listConfig(GitConfigScope.global);
    const configuration = Object.entries(list.all)
        .filter(([key]) => key.startsWith('devbox.'))
        .reduce((prev, current) => {
            const key = current[0].replace(/devbox\./, '');
            const camelCaseKey = camelCase(key);
            prev[camelCaseKey] = current[1] as string;
            return prev;
        }, {} as Record<string, string>);

    return configuration as Configuration;
};

export type WithRegistryConfiguration = Configuration & { registry: string };

export const withRegistry = async (
    configuration: Configuration
): Promise<WithRegistryConfiguration> => {
    const { workspacesRoot } = configuration;
    const registry = path.resolve(workspacesRoot, '.git-devbox');
    return { ...configuration, registry };
};
