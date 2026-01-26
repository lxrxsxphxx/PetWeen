<script setup lang="ts">
/**
 * ActionButton
 *
 * Small reusable button for settings/actions lists.
 */

withDefaults(
  defineProps<{
    icon: string
    label: string
    isActive?: boolean
    buttonClass?: string
    disabled?: boolean
  }>(),
  {
    isActive: false,
    buttonClass: '',
    disabled: false,
  }
)

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <q-btn
    flat
    no-caps
    class="action-btn"
    :class="[buttonClass, { 'btn-active': isActive }]"
    :disable="disabled"
    ripple
    @click="emit('click')"
  >
    <q-icon 
      :name="icon" 
      class="btn-icon" 
    />
      <span class="btn-label">{{ label }}</span>
  </q-btn>
</template>

<style scoped lang="scss">
.action-btn {
  gap: 0.75rem;
  width: 100%;
  justify-content: flex-start;

  .btn-icon {
    font-size: 1.5rem;
  }

  .btn-label {
    text-align: left;
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
