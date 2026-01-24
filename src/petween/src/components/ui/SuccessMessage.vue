<script setup lang="ts">
import { computed } from 'vue'

type MessageType = 'success' | 'error' | 'warning' | 'info'

const props = withDefaults(
  defineProps<{
    show: boolean
    message: string
    type?: MessageType
  }>(),
  { type: 'success' }
)

const iconName = computed(() => {
  const icons: Record<MessageType, string> = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  }
  return icons[props.type]
})
</script>

<template>
  <div v-if="show" class="message" :class="`message--${type}`">
    <q-icon :name="iconName" class="message__icon" />
    <p class="message__text">{{ message }}</p>
  </div>
</template>

<style scoped lang="scss">
.message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;

  color: var(--q-text);
  background: var(--q-accent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.message__icon {
  font-size: 2.25rem;
  flex-shrink: 0;
}

.message__text {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 500;
  text-align: center;
}

.message--error {
  background: var(--q-primary);
}

.message--warning {
  background: var(--q-secondary);
}

.message--info {
  background: var(--q-secondary);
  opacity: 0.9;
}
</style>
