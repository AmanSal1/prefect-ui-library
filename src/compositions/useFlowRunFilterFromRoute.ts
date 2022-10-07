import { formatDateTimeNumeric, parseDateTimeNumeric } from '@prefecthq/prefect-design'
import { useDebouncedRef, useRouteQueryParam } from '@prefecthq/vue-compositions'
import { addDays, endOfToday, startOfToday, subDays } from 'date-fns'
import { computed, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFlowRunFilter } from '@/compositions/useFlowRunFilter'
import { StateType } from '@/models/StateType'
import { FlowRunFilters, FlowRunFiltersInRoute } from '@/types/filter'
import { FlowRunSortValues } from '@/types/SortOptionTypes'
import { UnionFilters } from '@/types/UnionFilters'

export type UseFlowRunFilterFromRoute = {
  name: Ref<string>,
  sort: Ref<FlowRunSortValues>,
  startDate: Ref<Date>,
  endDate: Ref<Date>,
  states: Ref<StateType[]>,
  deployments: Ref<string[]>,
  flows: Ref<string[]>,
  tags: Ref<string[]>,
  filter: Ref<UnionFilters>,
  hasFilters: Ref<boolean>,
  setFilters: (filters: FlowRunFilters) => Promise<void>,
}

export function useFlowRunFilterFromRoute(): UseFlowRunFilterFromRoute {
  const route = useRoute()
  const router = useRouter()

  const name = useRouteQueryParam('name', '')
  const sort = useRouteQueryParam('sort', 'EXPECTED_START_TIME_DESC') as Ref<FlowRunSortValues>

  const defaultStartDate = formatDateTimeNumeric(subDays(startOfToday(), 7))
  const startDateParam = useRouteQueryParam('start-date', defaultStartDate)

  const startDate = computed({
    get() {
      return parseDateTimeNumeric(startDateParam.value)
    },
    set(value: Date) {
      startDateParam.value = formatDateTimeNumeric(value)
    },
  })

  const defaultEndDate = formatDateTimeNumeric(addDays(endOfToday(), 1))
  const endDateParam = useRouteQueryParam('end-date', defaultEndDate)

  const endDate = computed({
    get() {
      return parseDateTimeNumeric(endDateParam.value)
    },
    set(value: Date) {
      endDateParam.value = formatDateTimeNumeric(value)
    },
  })

  const nameDebounced = useDebouncedRef(name, 1200)

  const states = useRouteQueryParam('state', []) as Ref<StateType[]>
  const deployments = useRouteQueryParam('deployment', [])
  const flows = useRouteQueryParam('flow', [])
  const tags = useRouteQueryParam('tag', [])

  const filter = useFlowRunFilter({ states, deployments, flows, tags, startDate, endDate, sort, name: nameDebounced })

  const hasFilters = computed(() => {
    return !!states.value.length ||
      !!deployments.value.length ||
      !!flows.value.length ||
      !!tags.value.length ||
      startDateParam.value !== defaultStartDate ||
      endDateParam.value !== defaultEndDate
  })

  async function setFilters(filters: FlowRunFilters): Promise<void> {
    const query: FlowRunFiltersInRoute = {}

    if (filters.name) {
      query.name = filters.name
    }

    if (filters.sort) {
      query.sort = filters.sort
    }

    if (filters.startDate) {
      const formatted = formatDateTimeNumeric(filters.startDate)

      if (formatted !== defaultStartDate) {
        query['start-date'] = formatted
      }
    }

    if (filters.endDate) {
      const formatted = formatDateTimeNumeric(filters.endDate)

      if (formatted !== defaultEndDate) {
        query['end-date'] = formatted
      }
    }

    if (filters.state) {
      query.state = filters.state
    }

    if (filters.deployment) {
      query.deployment = filters.deployment
    }

    if (filters.flow) {
      query.flow = filters.flow
    }

    if (filters.tag) {
      query.tag = filters.tag
    }

    await router.push({ query })
  }

  return {
    name,
    sort,
    startDate,
    endDate,
    states,
    deployments,
    flows,
    tags,
    filter,
    hasFilters,
    setFilters,
  }
}