<template>
  <!-- BackButton component -->
  <q-btn 
    flat 
    round 
    icon="arrow_back" 
    class="back-btn"
    @click="$router.back()"
  />
</template>

<script setup lang="ts">
/**
 * BackButton component
 * Reusable back button for navigation
 */
</script>

<style scoped lang="scss">
.back-btn {
  color: var(--q-text);
  position: absolute;
  left: 1rem;
  top: 1rem;
  z-index: 1;
}
</style>