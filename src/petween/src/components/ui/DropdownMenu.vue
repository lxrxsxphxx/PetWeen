<script setup lang="ts">
/**
 * Dropdown with customziable otions to choose from
 */

type Props = {
  /** currently selected Pet (v-model) */
  value: string
  /** Dropdown options */
  options: string[]
}

/**
 * v-model Bridge: Parent holds the state, the component emits updates.
 */
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'petSelect', value: string): void
}>()

</script>

<template>
  <q-select
    :model-value="value"
    @update:model-value="emit('petSelect', $event)"
    :options="options"
    dense
    outlined
    class="options-to-filter"
    dropdown-icon="expand_more"
    behavior="menu"
    menu-anchor="top left"
    menu-self="top left"
    :menu-offset="[0,4]"
    options-cover
    popup-content-class="dropdown-select"
  />
</template>

<style scoped lang="scss">
/* Layout/Look of the Select field (ehrn its closed) */
.options-to-filter {
  width: 100%;
  margin: 0rem 0rem 1.1rem 0rem;
}

.options-to-filter :deep(.q-field__control) {
  background: var(--q-accent);
  border-radius: 10px;
}

.options-to-filter :deep(.q-field__control:before) {
  border: none;
}
</style>
