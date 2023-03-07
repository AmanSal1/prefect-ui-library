export const en = {
  docs: {
    gettingStarted: 'https://docs.prefect.io/getting-started/overview/',
    flows: 'https://docs.prefect.io/concepts/flows/',
    flowRuns: 'https://docs.prefect.io/ui/flow-runs/',
    blocks: 'https://docs.prefect.io/ui/blocks/',
    workQueues: 'https://docs.prefect.io/ui/work-queues/',
    notifications: 'https://docs.prefect.io/ui/notifications/',
    deployments: 'https://docs.prefect.io/ui/deployments/',
    concurrency: 'https://docs.prefect.io/concepts/tasks/?h=conc#task-run-concurrency-limits',
    automations: 'https://docs.prefect.io/ui/automations/',
    workPools: 'https://docs.prefect.io/ui/work-pools/',
    collections: 'https://docs.prefect.io/collections/catalog/',
  },
  error: {
    activateDeployment: 'Failed to activate deployment',
    activateNotification: 'Failed to activate notification',
    activateWorkPool: 'Failed to activate work pool',
    activateWorkPoolQueue: 'Failed to activate work pool queue',
    activateWorkQueue: 'Failed to activate work queue',
    cancelFlowRun: 'Failed to cancel flow run',
    changeFlowRunState: 'Failed to change flow run state',
    changeTaskRunState: 'Failed to change task run state',
    createBlock: 'Failed to create block',
    createConcurrencyLimit: 'Failed to create concurrency limit',
    createNotification: 'Failed to create notification',
    createSavedSearch: 'Failed to create saved filter',
    createSchedule: 'Failed to create schedule',
    createWorkPool: 'Failed to create work pool',
    createWorkPoolQueue: 'Failed to create work pool queue',
    createWorkQueue: 'Failed to create work queue',
    delete: (type: string) => `Failed to delete ${type}`,
    deleteSavedSearch: 'Failed to delete saved filter',
    pauseDeployment: 'Failed to pause deployment',
    pauseFlowRun: 'Failed to pause flow run',
    pauseNotification: 'Failed to pause notification',
    pauseWorkPool: 'Failed to pause work pool',
    pauseWorkPoolQueue: 'Failed to pause work pool queue',
    pauseWorkQueue: 'Failed to pause work queue',
    removeSchedule: 'Failed to remove schedule',
    resumeFlowRun: 'Failed to resume flow run',
    retryRun: 'Failed to retry flow run',
    scheduleFlowRun: 'Failed to schedule flow run',
    submitNotification: 'Failed to submit notification',
    updateBlock: 'Failed to update block',
    updateNotification: 'Failed to update notification',
    updateSchedule: 'Failed to update schedule',
    updateWorkPool: 'Failed to update work pool',
    updateWorkPoolQueue: 'Failed to update work pool queue',
    updateWorkQueue: 'Failed to update work queue',
  },
  success: {
    activateDeployment: 'Deployment active',
    activateNotification: 'Notification active',
    activateWorkPool: 'Work pool active',
    activateWorkPoolQueue: 'Work pool queue active',
    activateWorkQueue: 'Work queue active',
    cancelFlowRun: 'Flow run cancelled',
    changeFlowRunState: 'Flow run state changed',
    changeTaskRunState: 'Task run state changed',
    createBlock: 'Block created',
    createConcurrencyLimit: 'Concurrency limit added',
    createNotification: 'Notification created',
    createSavedSearch: 'Filter saved',
    createSchedule: 'Schedule added',
    createWorkPool: 'Work pool created',
    createWorkPoolQueue: 'Work pool queue created',
    createWorkQueue: 'Work queue created',
    delete: (type: string) => `${type} deleted`,
    deleteSavedSearch: 'Saved filter deleted',
    pauseDeployment: 'Deployment paused',
    pauseFlowRun: 'Flow run paused',
    pauseNotification: 'Notification paused',
    pauseWorkPool: 'Work pool paused',
    pauseWorkPoolQueue: 'Work pool queue paused',
    pauseWorkQueue: 'Work queue paused',
    removeSchedule: 'Schedule removed',
    resumeFlowRun: 'Flow run resumed',
    retryRun: 'Retrying run',
    scheduleFlowRun: 'Flow run scheduled',
    updateBlock: 'Block updated',
    updateNotification: 'Notification updated',
    updateSchedule: 'Schedule updated',
    updateWorkPool: 'Work pool updated',
    updateWorkPoolQueue: 'Work pool queue updated',
    updateWorkQueue: 'Work queue updated',
  },
  info: {
    created: 'Created',
    lastUpdated: 'Last Updated',
    deprecatedWorkQueue: 'This work queue uses a deprecated tag-based approach to matching flow runs; it will continue to work but you can\'t modify it',
    deploymentMissingWorkQueue: 'This deployment doesn\'t have an associated work queue; runs will be scheduled but won\'t be picked up by your agents',
    taskInput: 'Task inputs show parameter keys and can also show task run relationships.',
  },
}