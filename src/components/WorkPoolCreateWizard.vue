<template>
  <p-wizard :steps="steps" last-step-text="Create" show-cancel @submit="submit" @cancel="cancel">
    <template #work-pool-infrastructure-type>
      <WorkPoolCreateWizardStepInfrastructureType v-model:workPool="workPool" :workers="availableWorkers" />
    </template>
    <template #work-pool-infrastructure-configuration>
      <WorkPoolCreateWizardStepInfrastructureConfiguration v-model:workPool="workPool" :default-base-job-template="defaultBaseJobTemplate" />
    </template>
    <template #work-pool-information>
      <WorkPoolCreateWizardStepInformation v-model:workPool="workPool" :workers="availableWorkers" />
    </template>
  </p-wizard>
</template>

<script lang="ts" setup>
  import { WizardStep, showToast } from '@prefecthq/prefect-design'
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { WorkPoolCreateWizardStepInformation, WorkPoolCreateWizardStepInfrastructureType, WorkPoolCreateWizardStepInfrastructureConfiguration } from '@/components'
  import { useWorkspaceApi, useWorkspaceRoutes } from '@/compositions'
  import { localization } from '@/localization'
  import { WorkPoolCreate, WorkPoolFormValues } from '@/models'

  const router = useRouter()
  const routes = useWorkspaceRoutes()

  const workPool = ref<WorkPoolFormValues>({})

  const steps: WizardStep[] = [
    { title: 'Infrastructure Type', key: 'work-pool-infrastructure-type' },
    { title: 'Configuration', key: 'work-pool-infrastructure-configuration' },
    { title: 'Details', key: 'work-pool-information' },
  ]

  const api = useWorkspaceApi()

  const availableWorkersSubscription = useSubscription(api.collections.getWorkerCollection, [])
  const availableWorkers = computed(() => availableWorkersSubscription.response ?? [])

  const defaultBaseJobTemplate = computed(() => {
    return availableWorkers.value.find((item) => item.type === workPool.value.type)?.defaultBaseJobConfiguration ?? {}
  })

  async function submit(): Promise<void> {
    if (!workPool.value.baseJobTemplate) {
      workPool.value.baseJobTemplate = defaultBaseJobTemplate.value
    }
    const values: WorkPoolCreate = {
      ...workPool.value,
      description: workPool.value.description ?? '',
      concurrencyLimit: workPool.value.concurrencyLimit ?? undefined,
      isPaused: false,
    }

    try {
      const { name } = await api.workPools.createWorkPool(values)
      showToast(localization.success.createWorkPool, 'success')

      router.push(routes.workPool(name))
    } catch (error) {
      showToast(localization.error.createWorkPool, 'error')
      console.error(error)
    }


  }

  function cancel(): void {
    router.back()
  }
</script>