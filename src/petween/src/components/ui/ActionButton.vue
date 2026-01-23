<template>
  <q-btn
    flat
    class="action-btn"
    :class="{ 'btn-active': isActive }"
    ripple
    @click="emit('click')"
  >
    <q-icon :name="icon" class="btn-icon" />
    <span>{{ label }}</span>
  </q-btn>
</template>

<script setup lang="ts">
  // Action-Button Komponente
  defineProps<{
    icon: string
    label: string
    isActive?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'click'): void
  }>()
</script>

<style scoped lang="scss">
.action-btn {
  gap: 0.75rem;
  width: 100%;
  
  .btn-icon {
    font-size: 1.5rem;
  }
  
  &.btn-active {
    background: var(--q-accent);
    color: var(--q-text);
    
    .btn-icon {
      color: var(--q-text);
    }
  }
}
</style>
