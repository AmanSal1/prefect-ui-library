import { BooleanRouteParam, DateRouteParam, NumberRouteParam, RouteQueryParamsSchema, StringRouteParam, useRouteQueryParams } from '@prefecthq/vue-compositions'
import { Ref, reactive, ComputedRef, toRef, computed, toRefs, isReactive, watch } from 'vue'
import { DeploymentSortValuesSortParam } from '@/formatters/DeploymentSortValuesSortParam'
import { FlowRunSortValuesSortParam } from '@/formatters/FlowRunSortValuesSortParam'
import { FlowSortValuesSortParam } from '@/formatters/FlowSortValuesSortParam'
import { OperatorRouteParam } from '@/formatters/OperatorRouteParam'
import { TaskRunSortValuesSortParam } from '@/formatters/TaskRunSortValuesSortParam'
import { BlockDocumentFilter, BlockDocumentsFilter, BlockSchemaFilter, BlockSchemasFilter, BlockTypeFilter, BlockTypesFilter, DeploymentFilter, DeploymentsFilter, FlowFilter, FlowRunFilter, FlowRunsFilter, FlowRunsHistoryFilter, FlowsFilter, StateFilter, TagFilter, TaskRunFilter, TaskRunsFilter, UnionFilter, UnionFilterSort, WorkPoolFilter, WorkPoolQueueFilter, WorkPoolsFilter } from '@/models/Filters'
import { defaultDeploymentSort, defaultFlowRunSort, defaultFlowSort, defaultTaskRunSort } from '@/types'
import { AnyRecord } from '@/types/any'
import { MaybeReactive } from '@/types/reactivity'
import { merge } from '@/utilities/object'
import { dateFunctions } from '@/utilities/timezone'

type AnySortableRecord = AnyRecord & { sort?: string }

export type Filter<T extends AnyRecord> = {
  [P in keyof Required<T>]: [T[P]] extends [AnyRecord | undefined]
    ? Filter<Exclude<T[P], undefined>>
    : T[P]
}

export type FilterFunctions<T extends AnyRecord> = {
  clear: () => void,
  set: (filters: T) => void,
  isDefault: ComputedRef<boolean>,
}

export type UseFilter<T extends AnyRecord> = {
  filter: Filter<T>,
} & FilterFunctions<T>

function withExtras<T extends AnyRecord>(filter: Filter<T>): UseFilter<T> {
  const defaultValue: T = JSON.parse(JSON.stringify(filter))

  const clear = (): void => {
    Object.assign(filter, defaultValue)
  }

  const set = (newFilters: T): void => {
    merge(filter as T, newFilters)
  }

  const isDefault = computed(() => JSON.stringify(filter) === JSON.stringify(defaultValue))

  return {
    filter,
    clear,
    set,
    isDefault,
  }
}

function getDefaultValueWithDefaultSort<T extends AnySortableRecord>(defaultValue: MaybeReactive<T>, defaultSort: T['sort']): T {
  const { sort = defaultSort, ...rest } = isReactive(defaultValue) ? toRefs(defaultValue) : defaultValue

  return reactive({ ...rest, sort }) as T
}

function useFilterFromRoute<T extends AnyRecord>(schema: RouteQueryParamsSchema<T>, defaultValue: MaybeReactive<T>, prefix?: string): UseFilter<T> {
  const defaultValueReactive = reactive(defaultValue) as T
  const params = useRouteQueryParams(schema, defaultValueReactive, prefix)
  const filter = reactive(params) as Filter<T>

  watch(defaultValueReactive, value => {
    merge(filter, value as Filter<T>)
  }, { deep: true })


  return withExtras(filter)
}

export function useTagFilter(defaultValue: MaybeReactive<TagFilter> = {}): UseFilter<TagFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const filter: Filter<TagFilter> = reactive({
    operator: toRef(defaultValueReactive, 'operator'),
    name: toRef(defaultValueReactive, 'name'),
    isNull: toRef(defaultValueReactive, 'isNull'),
  })

  return withExtras(filter)
}

const tagFilterSchema: RouteQueryParamsSchema<TagFilter> = {
  operator: OperatorRouteParam,
  name: [StringRouteParam],
  isNull: BooleanRouteParam,
}

export function useTagFilterFromRoute(defaultValue: MaybeReactive<TagFilter> = {}, prefix?: string): UseFilter<TagFilter> {
  return useFilterFromRoute(tagFilterSchema, defaultValue, prefix)
}

export function useStateFilter(defaultValue: MaybeReactive<StateFilter> = {}): UseFilter<StateFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const filter: Filter<StateFilter> = reactive({
    operator: toRef(defaultValueReactive, 'operator'),
    name: toRef(defaultValueReactive, 'name'),
    type: toRef(defaultValueReactive, 'type'),
  })

  return withExtras(filter)
}

const stateFilterSchema: RouteQueryParamsSchema<StateFilter> = {
  operator: OperatorRouteParam,
  type: [StringRouteParam],
  name: [StringRouteParam],
}

export function useStateFilterFromRoute(defaultValue: MaybeReactive<StateFilter> = {}, prefix?: string): UseFilter<StateFilter> {
  return useFilterFromRoute(stateFilterSchema, defaultValue, prefix)
}

export function useFlowFilter(defaultValue: MaybeReactive<FlowFilter> = {}): UseFilter<FlowFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const tags = useTagFilter(defaultValueReactive.tags)
  const filter: Filter<FlowFilter> = reactive({
    operator: toRef(defaultValueReactive, 'operator'),
    id: toRef(defaultValueReactive, 'id'),
    name: toRef(defaultValueReactive, 'name'),
    nameLike: toRef(defaultValueReactive, 'nameLike'),
    tags: tags.filter,
  })

  return withExtras(filter)
}

const flowFilterSchema: RouteQueryParamsSchema<FlowFilter> = {
  operator: OperatorRouteParam,
  id: [StringRouteParam],
  name: [StringRouteParam],
  nameLike: StringRouteParam,
  tags: tagFilterSchema,
}

export function useFlowFilterFromRoute(defaultValue: MaybeReactive<FlowFilter> = {}, prefix?: string): UseFilter<FlowFilter> {
  return useFilterFromRoute(flowFilterSchema, defaultValue, prefix)
}

export function useFlowRunFilter(defaultValue: MaybeReactive<FlowRunFilter> = {}): UseFilter<FlowRunFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const state = useStateFilter(defaultValueReactive.state)
  const tags = useTagFilter(defaultValueReactive.tags)
  const filter: Filter<FlowRunFilter> = reactive({
    deploymentId: toRef(defaultValueReactive, 'deploymentId'),
    deploymentIdNull: toRef(defaultValueReactive, 'deploymentIdNull'),
    deploymentIdOperator: toRef(defaultValueReactive, 'deploymentIdOperator'),
    expectedStartTimeAfter: toRef(defaultValueReactive, 'expectedStartTimeAfter'),
    expectedStartTimeBefore: toRef(defaultValueReactive, 'expectedStartTimeBefore'),
    flowVersion: toRef(defaultValueReactive, 'flowVersion'),
    id: toRef(defaultValueReactive, 'id'),
    name: toRef(defaultValueReactive, 'name'),
    nameLike: toRef(defaultValueReactive, 'nameLike'),
    nextExpectedStartTimeAfter: toRef(defaultValueReactive, 'nextExpectedStartTimeAfter'),
    nextExpectedStartTimeBefore: toRef(defaultValueReactive, 'nextExpectedStartTimeBefore'),
    notId: toRef(defaultValueReactive, 'notId'),
    operator: toRef(defaultValueReactive, 'operator'),
    parentTaskRunId: toRef(defaultValueReactive, 'parentTaskRunId'),
    parentTaskRunIdNull: toRef(defaultValueReactive, 'parentTaskRunIdNull'),
    parentTaskRunIdOperator: toRef(defaultValueReactive, 'parentTaskRunIdOperator'),
    startTimeAfter: toRef(defaultValueReactive, 'startTimeAfter'),
    startTimeBefore: toRef(defaultValueReactive, 'startTimeBefore'),
    startTimeNull: toRef(defaultValueReactive, 'startTimeNull'),
    state: state.filter,
    tags: tags.filter,
    workQueueName: toRef(defaultValueReactive, 'workQueueName'),
    workQueueNameIsNull: toRef(defaultValueReactive, 'workQueueNameIsNull'),
    workQueueNameOperator: toRef(defaultValueReactive, 'workQueueNameOperator'),
  })

  return withExtras(filter)
}

const flowRunFilterSchema: RouteQueryParamsSchema<FlowRunFilter> = {
  operator: OperatorRouteParam,
  id: [StringRouteParam],
  notId: [StringRouteParam],
  name: [StringRouteParam],
  nameLike: StringRouteParam,
  tags: tagFilterSchema,
  deploymentIdOperator: OperatorRouteParam,
  deploymentId: [StringRouteParam],
  deploymentIdNull: BooleanRouteParam,
  workQueueNameOperator: OperatorRouteParam,
  workQueueName: [StringRouteParam],
  workQueueNameIsNull: BooleanRouteParam,
  state: stateFilterSchema,
  flowVersion: [StringRouteParam],
  expectedStartTimeBefore: DateRouteParam,
  expectedStartTimeAfter: DateRouteParam,
  nextExpectedStartTimeBefore: DateRouteParam,
  nextExpectedStartTimeAfter: DateRouteParam,
  startTimeBefore: DateRouteParam,
  startTimeAfter: DateRouteParam,
  startTimeNull: BooleanRouteParam,
  parentTaskRunIdOperator: OperatorRouteParam,
  parentTaskRunId: [StringRouteParam],
  parentTaskRunIdNull: BooleanRouteParam,
}

export function useFlowRunFilterFromRoute(defaultValue: MaybeReactive<FlowRunFilter> = {}, prefix?: string): UseFilter<FlowRunFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const params = useRouteQueryParams(flowRunFilterSchema, defaultValueReactive, prefix)
  const filter: Filter<FlowRunFilter> = reactive(params)

  return withExtras(filter)
}

export function useTaskRunFilter(defaultValue: MaybeReactive<TaskRunFilter> = {}): UseFilter<TaskRunFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const tags = useTagFilter(defaultValueReactive.tags)
  const state = useStateFilter(defaultValueReactive.state)
  const filter: Filter<TaskRunFilter> = reactive({
    id: toRef(defaultValueReactive, 'id'),
    name: toRef(defaultValueReactive, 'name'),
    nameLike: toRef(defaultValueReactive, 'nameLike'),
    operator: toRef(defaultValueReactive, 'operator'),
    startTimeAfter: toRef(defaultValueReactive, 'startTimeAfter'),
    startTimeBefore: toRef(defaultValueReactive, 'startTimeBefore'),
    startTimeNull: toRef(defaultValueReactive, 'startTimeNull'),
    state: state.filter,
    subFlowRunsExist: toRef(defaultValueReactive, 'subFlowRunsExist'),
    tags: tags.filter,
  })

  return withExtras(filter)
}

const taskRunFilterSchema: RouteQueryParamsSchema<TaskRunFilter> = {
  operator: OperatorRouteParam,
  id: [StringRouteParam],
  name: [StringRouteParam],
  nameLike: StringRouteParam,
  tags: tagFilterSchema,
  state: stateFilterSchema,
  startTimeBefore: DateRouteParam,
  startTimeAfter: DateRouteParam,
  startTimeNull: BooleanRouteParam,
  subFlowRunsExist: BooleanRouteParam,
}

export function useTaskRunFilterFromRoute(defaultValue: MaybeReactive<TaskRunFilter> = {}, prefix?: string): UseFilter<TaskRunFilter> {
  return useFilterFromRoute(taskRunFilterSchema, defaultValue, prefix)
}

export function useDeploymentFilter(defaultValue: MaybeReactive<DeploymentFilter> = {}): UseFilter<DeploymentFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const tags = useTagFilter(defaultValueReactive.tags)
  const filter: Filter<DeploymentFilter> = reactive({
    operator: toRef(defaultValueReactive, 'operator'),
    id: toRef(defaultValueReactive, 'id'),
    name: toRef(defaultValueReactive, 'name'),
    nameLike: toRef(defaultValueReactive, 'nameLike'),
    isScheduleActive: toRef(defaultValueReactive, 'isScheduleActive'),
    workQueueName: toRef(defaultValueReactive, 'workQueueName'),
    tags: tags.filter,
  })

  return withExtras(filter)
}

const deploymentFilterSchema: RouteQueryParamsSchema<DeploymentFilter> = {
  operator: OperatorRouteParam,
  id: [StringRouteParam],
  name: [StringRouteParam],
  nameLike: StringRouteParam,
  isScheduleActive: BooleanRouteParam,
  workQueueName: [StringRouteParam],
  tags: tagFilterSchema,
}

export function useDeploymentFilterFromRoute(defaultValue: MaybeReactive<DeploymentFilter> = {}, prefix?: string): UseFilter<DeploymentFilter> {
  return useFilterFromRoute(deploymentFilterSchema, defaultValue, prefix)
}

export function useWorkPoolFilter(defaultValue: MaybeReactive<WorkPoolFilter> = {}): UseFilter<WorkPoolFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const filter: Filter<WorkPoolFilter> = reactive({
    operator: toRef(defaultValueReactive, 'operator'),
    id: toRef(defaultValueReactive, 'id'),
    name: toRef(defaultValueReactive, 'name'),
    type: toRef(defaultValueReactive, 'type'),
  })

  return withExtras(filter)
}

const workPoolFilterSchema: RouteQueryParamsSchema<WorkPoolFilter> = {
  operator: OperatorRouteParam,
  id: [StringRouteParam],
  name: [StringRouteParam],
  type: [StringRouteParam],
}

export function useWorkPoolFilterFromRoute(defaultValue: MaybeReactive<WorkPoolFilter> = {}, prefix?: string): UseFilter<WorkPoolFilter> {
  return useFilterFromRoute(workPoolFilterSchema, defaultValue, prefix)
}

export function useWorkPoolQueueFilter(defaultValue: MaybeReactive<WorkPoolQueueFilter> = {}): UseFilter<WorkPoolQueueFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const filter: Filter<WorkPoolQueueFilter> = reactive({
    operator: toRef(defaultValueReactive, 'operator'),
    id: toRef(defaultValueReactive, 'id'),
    name: toRef(defaultValueReactive, 'name'),
  })

  return withExtras(filter)
}

const workPoolQueueFilterSchema: RouteQueryParamsSchema<WorkPoolQueueFilter> = {
  operator: OperatorRouteParam,
  id: [StringRouteParam],
  name: [StringRouteParam],
}

export function useWorkPoolQueueFilterFromRoute(defaultValue: MaybeReactive<WorkPoolQueueFilter> = {}, prefix?: string): UseFilter<WorkPoolQueueFilter> {
  return useFilterFromRoute(flowFilterSchema, defaultValue, prefix)
}

export function useBlockTypeFilter(defaultValue: MaybeReactive<BlockTypeFilter> = {}): UseFilter<BlockTypeFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const filter: Filter<BlockTypeFilter> = reactive({
    nameLike: toRef(defaultValueReactive, 'nameLike'),
    slug: toRef(defaultValueReactive, 'slug'),
  })

  return withExtras(filter)
}

const blockTypeFilterSchema: RouteQueryParamsSchema<BlockTypeFilter> = {
  nameLike: StringRouteParam,
  slug: [StringRouteParam],
}

export function useBlockTypeFilterFromRoute(defaultValue: MaybeReactive<BlockTypeFilter> = {}, prefix?: string): UseFilter<BlockTypeFilter> {
  return useFilterFromRoute(blockTypeFilterSchema, defaultValue, prefix)
}

export function useBlockSchemaFilter(defaultValue: MaybeReactive<BlockSchemaFilter> = {}): UseFilter<BlockSchemaFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const filter: Filter<BlockSchemaFilter> = reactive({
    operator: toRef(defaultValueReactive, 'operator'),
    id: toRef(defaultValueReactive, 'id'),
    blockTypeId: toRef(defaultValueReactive, 'blockTypeId'),
    blockCapabilities: toRef(defaultValueReactive, 'blockCapabilities'),
    version: toRef(defaultValueReactive, 'version'),
  })

  return withExtras(filter)
}

const blockSchemaFilterSchema: RouteQueryParamsSchema<BlockSchemaFilter> = {
  operator: OperatorRouteParam,
  id: [StringRouteParam],
  blockTypeId: [StringRouteParam],
  blockCapabilities: [StringRouteParam],
  version: [StringRouteParam],
}

export function useBlockSchemaFilterFromRoute(defaultValue: MaybeReactive<BlockSchemaFilter> = {}, prefix?: string): UseFilter<BlockSchemaFilter> {
  return useFilterFromRoute(blockSchemaFilterSchema, defaultValue, prefix)
}

export function useBlockDocumentFilter(defaultValue: MaybeReactive<BlockDocumentFilter> = {}): UseFilter<BlockDocumentFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const filter: Filter<BlockDocumentFilter> = reactive({
    operator: toRef(defaultValueReactive, 'operator'),
    id: toRef(defaultValueReactive, 'id'),
    isAnonymous: toRef(defaultValueReactive, 'isAnonymous'),
    blockTypeId: toRef(defaultValueReactive, 'blockTypeId'),
    name: toRef(defaultValueReactive, 'name'),
  })

  return withExtras(filter)
}

const blockDocumentFilterSchema: RouteQueryParamsSchema<BlockDocumentFilter> = {
  operator: OperatorRouteParam,
  id: [StringRouteParam],
  isAnonymous: BooleanRouteParam,
  blockTypeId: [StringRouteParam],
  name: [StringRouteParam],
}

export function useBlockDocumentFilterFromRoute(defaultValue: MaybeReactive<BlockDocumentFilter> = {}, prefix?: string): UseFilter<BlockDocumentFilter> {
  return useFilterFromRoute(blockDocumentFilterSchema, defaultValue, prefix)
}

export function useBlockTypesFilter(defaultValue: MaybeReactive<BlockTypesFilter> = {}): UseFilter<BlockTypesFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const blockTypes = useBlockTypeFilter(defaultValueReactive.blockTypes)
  const blockSchemas = useBlockSchemaFilter(defaultValueReactive.blockSchemas)
  const filter: Filter<BlockTypesFilter> = reactive({
    blockSchemas: blockSchemas.filter,
    blockTypes: blockTypes.filter,
    limit: toRef(defaultValueReactive, 'limit'),
    offset: toRef(defaultValueReactive, 'offset'),
  })

  return withExtras(filter)
}

const blockTypesFilterSchema: RouteQueryParamsSchema<BlockTypesFilter> = {
  blockTypes: blockTypeFilterSchema,
  blockSchemas: blockSchemaFilterSchema,
  limit: NumberRouteParam,
  offset: NumberRouteParam,
}

export function useBlockTypesFilterFromRoute(defaultValue: MaybeReactive<BlockTypesFilter> = {}, prefix?: string): UseFilter<BlockTypesFilter> {
  return useFilterFromRoute(blockTypesFilterSchema, defaultValue, prefix)
}

export function useBlockSchemasFilter(defaultValue: MaybeReactive<BlockSchemasFilter> = {}): UseFilter<BlockSchemasFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const blockSchemas = useBlockSchemaFilter(defaultValueReactive.blockSchemas)
  const filter: Filter<BlockSchemasFilter> = reactive({
    blockSchemas: blockSchemas.filter,
    limit: toRef(defaultValueReactive, 'limit'),
    offset: toRef(defaultValueReactive, 'offset'),
  })

  return withExtras(filter)
}

const blockSchemasFilterSchema: RouteQueryParamsSchema<BlockSchemasFilter> = {
  blockSchemas: blockSchemaFilterSchema,
  limit: NumberRouteParam,
  offset: NumberRouteParam,
}

export function useBlockSchemasFilterFromRoute(defaultValue: MaybeReactive<BlockSchemasFilter> = {}, prefix?: string): UseFilter<BlockSchemasFilter> {
  return useFilterFromRoute(blockSchemasFilterSchema, defaultValue, prefix)
}

export function useBlockDocumentsFilter(defaultValue: MaybeReactive<BlockDocumentsFilter> = {}): UseFilter<BlockDocumentsFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const blockTypes = useBlockTypeFilter(defaultValueReactive.blockTypes)
  const blockSchemas = useBlockSchemaFilter(defaultValueReactive.blockSchemas)
  const blockDocuments = useBlockDocumentFilter(defaultValueReactive.blockDocuments)
  const filter: Filter<BlockDocumentsFilter> = reactive({
    blockTypes: blockTypes.filter,
    blockSchemas: blockSchemas.filter,
    blockDocuments: blockDocuments.filter,
    includeSecrets: toRef(defaultValueReactive, 'includeSecrets'),
    limit: toRef(defaultValueReactive, 'limit'),
    offset: toRef(defaultValueReactive, 'offset'),
  })

  return withExtras(filter)
}

const blockDocumentsFilterSchema: RouteQueryParamsSchema<BlockDocumentsFilter> = {
  blockTypes: blockTypeFilterSchema,
  blockSchemas: blockSchemaFilterSchema,
  blockDocuments: blockDocumentFilterSchema,
  limit: NumberRouteParam,
  offset: NumberRouteParam,
  includeSecrets: BooleanRouteParam,
}

export function useBlockDocumentsFilterFromRoute(defaultValue: MaybeReactive<BlockDocumentsFilter> = {}, prefix?: string): UseFilter<BlockDocumentsFilter> {
  return useFilterFromRoute(blockDocumentsFilterSchema, defaultValue, prefix)
}

export function useWorkPoolsFilter(defaultValue: MaybeReactive<WorkPoolsFilter> = {}): UseFilter<WorkPoolsFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const workPools = useWorkPoolFilter(defaultValueReactive.workPools)
  const filter: Filter<WorkPoolsFilter> = reactive({
    offset: toRef(defaultValueReactive, 'offset'),
    limit: toRef(defaultValueReactive, 'limit'),
    workPools: workPools.filter,
  })

  return withExtras(filter)
}

const workPoolsFilterSchema: RouteQueryParamsSchema<WorkPoolsFilter> = {
  workPools: workPoolFilterSchema,
  offset: NumberRouteParam,
  limit: NumberRouteParam,
}

export function useWorkPoolsFilterFromRoute(defaultValue: MaybeReactive<WorkPoolsFilter> = {}, prefix?: string): UseFilter<WorkPoolsFilter> {
  return useFilterFromRoute(workPoolsFilterSchema, defaultValue, prefix)
}

function useUnionFilter<T extends UnionFilter>(defaultValue: MaybeReactive<T>, defaultSort: Exclude<T['sort'], undefined>): UseFilter<T> {
  const defaultValueReactive = getDefaultValueWithDefaultSort(defaultValue, defaultSort)
  const flows = useFlowFilter(defaultValueReactive.flows)
  const flowRuns = useFlowRunFilter(defaultValueReactive.flowRuns)
  const taskRuns = useTaskRunFilter(defaultValueReactive.taskRuns)
  const deployments = useDeploymentFilter(defaultValueReactive.deployments)
  const workPools = useWorkPoolFilter(defaultValueReactive.workPools)
  const workPoolQueues = useWorkPoolQueueFilter(defaultValueReactive.workPoolQueues)
  const filter = reactive({
    flows: flows.filter,
    flowRuns: flowRuns.filter,
    taskRuns: taskRuns.filter,
    deployments: deployments.filter,
    workPools: workPools.filter,
    workPoolQueues: workPoolQueues.filter,
    sort: toRef(defaultValueReactive, 'sort') as Ref<T['sort']>,
    offset: toRef(defaultValueReactive, 'offset'),
    limit: toRef(defaultValueReactive, 'limit'),
  }) as Filter<T>

  return withExtras(filter)
}

export function useFlowsFilter(defaultValue: MaybeReactive<FlowsFilter> = {}): UseFilter<FlowsFilter> {
  return useUnionFilter<FlowsFilter>(defaultValue, defaultFlowSort)
}

export function useFlowRunsFilter(defaultValue: MaybeReactive<FlowRunsFilter> = {}): UseFilter<FlowRunsFilter> {
  return useUnionFilter<FlowRunsFilter>(defaultValue, defaultFlowRunSort)
}

export function useTaskRunsFilter(defaultValue: MaybeReactive<TaskRunsFilter> = {}): UseFilter<TaskRunsFilter> {
  return useUnionFilter<TaskRunsFilter>(defaultValue, defaultTaskRunSort)
}

export function useDeploymentsFilter(defaultValue: MaybeReactive<DeploymentsFilter> = {}): UseFilter<DeploymentsFilter> {
  return useUnionFilter<DeploymentsFilter>(defaultValue, defaultDeploymentSort)
}

const unionFilterSchema: Omit<RouteQueryParamsSchema<UnionFilter>, 'sort'> = {
  flows: flowFilterSchema,
  flowRuns: flowRunFilterSchema,
  taskRuns: taskRunFilterSchema,
  deployments: deploymentFilterSchema,
  workPools: workPoolFilterSchema,
  workPoolQueues: workPoolQueueFilterSchema,
  offset: NumberRouteParam,
  limit: NumberRouteParam,
}

const flowsFilterSchema: RouteQueryParamsSchema<FlowsFilter> = {
  ...unionFilterSchema,
  sort: FlowSortValuesSortParam,
}

export function useFlowsFilterFromRoute(defaultValue: MaybeReactive<FlowsFilter> = {}, prefix?: string): UseFilter<FlowsFilter> {
  return useFilterFromRoute(flowsFilterSchema, defaultValue, prefix)
}

const flowRunsFilterSchema: RouteQueryParamsSchema<FlowRunsFilter> = {
  ...unionFilterSchema,
  sort: FlowRunSortValuesSortParam,
}

export function useFlowRunsFilterFromRoute(defaultValue: MaybeReactive<FlowRunsFilter> = {}, prefix?: string): UseFilter<FlowRunsFilter> {
  return useFilterFromRoute(flowRunsFilterSchema, defaultValue, prefix)
}

const taskRunsFilterSchema: RouteQueryParamsSchema<TaskRunsFilter> = {
  ...unionFilterSchema,
  sort: TaskRunSortValuesSortParam,
}

export function useTaskRunsFilterFromRoute(defaultValue: MaybeReactive<TaskRunsFilter> = {}, prefix?: string): UseFilter<TaskRunsFilter> {
  return useFilterFromRoute(taskRunsFilterSchema, defaultValue, prefix)
}

const deploymentsFilterSchema: RouteQueryParamsSchema<DeploymentsFilter> = {
  ...unionFilterSchema,
  sort: DeploymentSortValuesSortParam,
}

export function useDeploymentsFilterFromRoute(defaultValue: MaybeReactive<DeploymentsFilter> = {}, prefix?: string): UseFilter<DeploymentsFilter> {
  return useFilterFromRoute(deploymentsFilterSchema, defaultValue, prefix)
}

export function useRecentFlowRunsFilter(defaultValue: MaybeReactive<FlowRunsFilter>): UseFilter<FlowRunsFilter> {
  const { filter, ...extras } = useFlowRunsFilter(defaultValue)

  filter.flowRuns.expectedStartTimeAfter = dateFunctions.subDays(dateFunctions.startOfToday(), 7)
  filter.flowRuns.expectedStartTimeBefore = dateFunctions.addDays(dateFunctions.endOfToday(), 1)

  return {
    filter,
    ...extras,
  }
}

export function useFlowRunsHistoryFilter(defaultValue: MaybeReactive<FlowRunsHistoryFilter>): UseFilter<FlowRunsHistoryFilter> {
  const defaultValueReactive = reactive(defaultValue)
  const { filter: flowRunsFilter } = useFlowRunsFilter(defaultValueReactive)

  const filter: Filter<FlowRunsHistoryFilter> = reactive({
    ...flowRunsFilter,
    historyEnd: toRef(defaultValueReactive, 'historyEnd'),
    historyStart: toRef(defaultValueReactive, 'historyStart'),
    historyIntervalSeconds: toRef(defaultValueReactive, 'historyIntervalSeconds'),
  })

  return withExtras(filter)
}

const flowRunsHistoryFilterSchema: RouteQueryParamsSchema<FlowRunsHistoryFilter> = {
  ...unionFilterSchema,
  historyEnd: DateRouteParam,
  historyStart: DateRouteParam,
  historyIntervalSeconds: NumberRouteParam,
  sort: FlowRunSortValuesSortParam,
}

export function useFlowRunsHistoryFilterFromRoute(defaultValue: MaybeReactive<FlowRunsHistoryFilter>, prefix?: string): UseFilter<FlowRunsHistoryFilter> {
  return useFilterFromRoute(flowRunsHistoryFilterSchema, defaultValue, prefix)
}
