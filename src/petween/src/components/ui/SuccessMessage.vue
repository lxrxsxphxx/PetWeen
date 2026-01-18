<template>
  <!-- Message component - flexible for success, error, warning, info -->
  <div v-if="show" :class="['message-container', `message-${type}`]">
    <q-icon :name="iconName" class="message-icon" />
    <p class="message-text">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Message component
 * Displays flexible messages with different types (success, error, warning, info)
 * 
 * @props {boolean} show - Controls message visibility
 * @props {string} message - Message text to display
 * @props {'success'|'error'|'warning'|'info'} type - Message type (default: 'success')
 */

type MessageType = 'success' | 'error' | 'warning' | 'info'

const props = withDefaults(defineProps<{
  show: boolean
  message: string
  type?: MessageType
}>(), {
  type: 'success'
})

// Icon mapping based on type
const iconMap: Record<MessageType, string> = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info'
}

const iconName = computed(() => iconMap[props.type])
</script>

<style scoped lang="scss">
.message-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.message-icon {
  font-size: 3rem;
  color: #ffffff;
  flex-shrink: 0;
}

.message-text {
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
}

// Type-specific styles
.message-success {
  background: #4caf50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.message-error {
  background: #f44336;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.message-warning {
  background: #ff9800;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.message-info {
  background: #2196f3;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}
</style>
