import simpleGit, { GitConfigScope } from 'simple-git';
import camelCase from 'lodash/camelCase';
import path from 'path';

export type Configuration = {
    workspacesRoot: string;
    workspacesDefault: string;
    githubUsername: string;
    githubPersonalToken: string;

    registry: string;
};

export const getConfiguration = async (): Promise<Configuration> => {
    const list = await simpleGit().listConfig(GitConfigScope.global);
    const config = Object.entries(list.all)
        .filter(([key]) => key.startsWith('devbox.'))
        .reduce((prev, current) => {
            const key = current[0].replace(/devbox\./, '');
            const camelCaseKey = camelCase(key);
            prev[camelCaseKey] = current[1] as string;
            return prev;
        }, {} as Record<string, string>);

    const gitConfig = config as Omit<Configuration, 'registry'>;
    const registry = path.resolve(gitConfig.workspacesRoot, '.git-devbox');
    return { ...gitConfig, registry };
};
