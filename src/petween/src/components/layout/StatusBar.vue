<template>
  <!-- Status Bar -->
  <div class="status-bar">
    <!-- Time -->
    <span class="time">{{ currentTime }}</span>
    
    <!-- Status Icons -->
    <div class="icons">
      <q-icon name="signal_cellular_alt" />
      <q-icon name="wifi" />
      <q-icon name="battery_full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * StatusBar component
 * Displays time and status icons (cellular, wifi, battery)
 */

const currentTime = ref('9:41')

function updateTime() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

let intervalId: number | undefined

onMounted(() => {
  updateTime()
  intervalId = setInterval(updateTime, 60000) // Update every minute
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped lang="scss">
/* Status Bar styles */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1.3rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--q-text);
}

.time {
  font-weight: 600;
}

.icons {
  display: flex;
  gap: 0.3rem;
  
  .q-icon {
    font-size: 1.3rem;
  }
}
</style>