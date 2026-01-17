<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  /** currently selected Pet (v-model) */
  modelValue: string
  /** Dropdown options */
  options: string[]
}

/**
 * v-model Bridge: AlbumPage holds the state, the component emits updates.
 */
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
</script>

<template>
  <q-select
    v-model="model"
    :options="options"
    dense
    outlined
    class="options-to-filter"
    dropdown-icon="expand_more"
    behavior="menu"
    menu-anchor="bottom left"
    menu-self="top left"
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

<style lang="scss">
/* Dropdown menü has to be global(Quasar renders the menu outside of the component) */
.dropdown-select {
  background: var(--q-secondary) !important;
  color: var(--q-text) !important;
  border-radius: 10px;
}
</style>
