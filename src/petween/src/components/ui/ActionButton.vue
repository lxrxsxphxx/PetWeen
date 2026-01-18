<template>
  <q-btn
    flat
    class="action-btn"
    :class="[buttonClass, { 'btn-active': isActive }]"
    ripple
    @click="$emit('click')"
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
    buttonClass?: string
    isActive?: boolean
  }>()

  defineEmits<{
    click: []
  }>()
</script>

<style scoped lang="scss">
.action-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  color: #ffffff;
  text-transform: none;
  font-size: 1.3rem;
  width: 100%;
  border-radius: 8px;
  
  .btn-icon {
    font-size: 1.5rem;
    color: #ffffff;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.btn-active {
    background: rgba(255, 0, 0, 0.8) !important;
    color: var(--q-text);
    
    .btn-icon {
      color: var(--q-text);
    }
  }
  
  &:active {
    background: rgba(255, 0, 0, 0.6) !important;
  }
  
  &.q-btn--active {
    background: rgba(255, 0, 0, 0.8);
  }
}
</style>
