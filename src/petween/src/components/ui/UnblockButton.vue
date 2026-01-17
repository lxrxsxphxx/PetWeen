<template>
  <q-btn
    flat
    round
    icon="block"
    class="unblock-btn"
    ripple
    @click.stop="$emit('click')"
  />
</template>

<script setup lang="ts">
  // Entsperren-Button
  defineEmits<{
    click: []
  }>()
</script>

<style scoped lang="scss">
.unblock-btn {
  color: #ffffff;
  opacity: 0.8;
  flex-shrink: 0;
  
  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
