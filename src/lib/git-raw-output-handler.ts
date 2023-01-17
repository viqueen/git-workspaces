export const gitRawOutputHandler = (output: string) => {
    return output
        .trim()
        .split('\n')
        .map((info) => info.match(/'(?<info>.*)'/)?.groups?.info);
};
