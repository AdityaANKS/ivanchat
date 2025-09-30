export const temporalConfig = {
  connection: {
    address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    namespace: process.env.TEMPORAL_NAMESPACE || 'default',
  },
  worker: {
    taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'ivan-chat-queue',
    workflowsPath: require.resolve('../temporal/workflows'),
    activities: require('../temporal/activities'),
    maxConcurrentActivityTaskExecutions: 10,
    maxConcurrentWorkflowTaskExecutions: 10,
  },
  client: {
    namespace: process.env.TEMPORAL_NAMESPACE || 'default',
  }
};