import {
    CliProgressRunContext,
    cliProgressTaskPoolExecutor,
    TaskPoolExecutor
} from 'task-pool-executor';

export type WithCliProgress = (
    taskPool: TaskPoolExecutor<string, CliProgressRunContext>
) => void;

export const withCliProgress = async (fn: WithCliProgress) => {
    const taskPool = cliProgressTaskPoolExecutor<string>();
    fn(taskPool);
    return new Promise((resolve) => {
        const timer = setInterval(async () => {
            if (taskPool.queue.length === 0 && taskPool.current.size === 0) {
                await taskPool.close();
                clearInterval(timer);
                resolve({});
            }
        }, 2);
    });
};
