<template>
  <!-- SuccessMessage component -->
  <div v-if="show" class="success-message-container">
    <q-icon name="check_circle" class="success-icon" />
    <p class="success-message-text">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
/**
 * SuccessMessage component
 * Displays a success message with check icon
 */

defineProps<{
  show: boolean
  message: string
}>()
</script>

<style scoped lang="scss">
.success-message-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: #4caf50;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.success-icon {
  font-size: 3rem;
  color: #ffffff;
  flex-shrink: 0;
}

.success-message-text {
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
}
</style>