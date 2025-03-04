<template>
  <div class="notification-details">
    If a run of any flow with <span v-if="notification.tags?.length">a</span>
    <SeparatedList :item-array="notification.tags || []">
      <template #default="{ item }">
        <span class="notification-details__tag">
          <p-tag>{{ item }}</p-tag>
        </span>
      </template>
    </SeparatedList>

    tag enters

    <SeparatedList :item-array="notification.stateNames || []">
      <template #default="{ item }">
        <StateBadge :state="mapStateNameToStateType(item)" />
      </template>
    </SeparatedList>

    state, send a notification to

    <span class="notification-details__send-to">
      <template v-for="item in sendTo.value" :key="item">
        <p-icon v-if="item" :icon="sendTo.icon" class="notification-details__icon" :class="classes" />
        <span class="notification-details__item">{{ item }}</span>
      </template>
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { Icon, PIcon, PTag } from '@prefecthq/prefect-design'
  import { computed } from 'vue'
  import SeparatedList from '@/components/SeparatedList.vue'
  import StateBadge from '@/components/StateBadge.vue'
  import { BlockType, Notification } from '@/models'
  import { SchemaValues } from '@/types/schemas'
  import { asArray } from '@/utilities'
  import { mapStateNameToStateType } from '@/utilities/state'

  const props = defineProps<{
    notification: Pick<Notification, 'tags' | 'stateNames'>,
    blockType: BlockType,
    data: SchemaValues,
  }>()

  const sendTo = computed<{ value: string[] | unknown, icon: Icon }>(() => {
    switch (props.blockType.name) {
      case 'Email Addresses':
        return {
          value: asArray(props.data.email_addresses),
          icon: 'EnvelopeIcon',
        }
      case 'Slack Webhook':
        return {
          value: ['Slack'],
          icon: 'Slack',
        }
      default:
        return {
          value: asArray(Object.values(props.data)[0]),
          icon: 'BellIcon',
        }
    }
  })

  const classes = computed(() => ({
    'notification-details__icon--gray': sendTo.value.icon !== 'Slack',
  }))
</script>

<style>
.notification-details { @apply
  inline-flex
  flex-wrap
  gap-1
  items-center
}

.notification-details__tag {
  inline-size: max-content;
}

.notification-details__send-to { @apply
  inline-flex
  gap-1
  flex-wrap
  align-bottom
  items-center
  font-bold
}

.notification-details__item { @apply
  empty:border-b-2
  empty:w-32
  empty:border-black
  empty:mb-2.5
  empty:h-6
}

.notification-details__icon--gray { @apply
  stroke-gray-400
}
</style>
