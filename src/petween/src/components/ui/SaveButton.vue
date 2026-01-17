<template>
  <q-btn
    class="save-btn"
    label="save"
    ripple
    @click="$emit('click')"
  />
</template>

<script setup lang="ts">
  // Speichern-Button
  defineEmits<{
    click: []
  }>()
</script>

<style scoped lang="scss">
.save-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: 500;
  background: var(--q-secondary);
  color: #ffffff;
  border-radius: 8px;
  text-transform: none;
  margin-top: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
