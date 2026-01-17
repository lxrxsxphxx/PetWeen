<template>
    <!-- Status Bar -->
    <div class="status-bar">
        <!-- Time -->
        <span class="time">{{ currentTime }}</span>
        
        <!-- Right side icons -->
        <div class="status-icons">
            <!-- Signal bars -->
            <div class="signal-bars">
                <span class="signal-bar" v-for="i in 3" :key="i"></span>
            </div>
            
            <!-- WiFi icon -->
            <q-icon name="wifi" class="status-icon" />
            
            <!-- Battery icon -->
            <div class="battery">
                <div class="battery-level"></div>
                <div class="battery-cap"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Status Bar component
 * 
 * Displays device status information including:
 * - Current time
 * - Signal strength (bars)
 * - WiFi connection status
 * - Battery level
 * 
 * Automatically updates the time every minute.
 */

const currentTime = ref('9:41')

// Update time every minute
let timeInterval: ReturnType<typeof setInterval> | null = null

function updateTime() {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    currentTime.value = `${hours}:${minutes}`
}

onMounted(() => {
    updateTime()
    timeInterval = setInterval(updateTime, 60000) // Update every minute
})

onUnmounted(() => {
    if (timeInterval) {
        clearInterval(timeInterval)
    }
})
</script>

<style scoped lang="scss">
/* Status Bar Styles */
.status-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    padding: 0.5rem 1rem;
    background: #000000;
    color: #ffffff;
    font-weight: bold;
    font-size: 0.9rem;
    
    height: 2.5rem;
}

/* Time */
.time {
    font-size: 1rem;
    font-weight: 600;
}

/* Status Icons Container */
.status-icons {
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

/* Signal Bars */
.signal-bars {
    display: flex;
    align-items: flex-end;
    gap: 0.15rem;
    height: 0.7rem;
}

.signal-bar {
    width: 0.2rem;
    background: #ffffff;
    border-radius: 0.05rem;
    
    &:nth-child(1) {
        height: 0.3rem;
    }
    
    &:nth-child(2) {
        height: 0.5rem;
    }
    
    &:nth-child(3) {
        height: 0.7rem;
    }
}

/* Status Icon (WiFi) */
.status-icon {
    font-size: 1rem;
    color: #ffffff;
}

/* Battery */
.battery {
    position: relative;
    width: 1.5rem;
    height: 0.75rem;
    border: 0.1rem solid #ffffff;
    border-radius: 0.15rem;
    background: transparent;
}

.battery-level {
    position: absolute;
    left: 0.1rem;
    top: 0.1rem;
    bottom: 0.1rem;
    width: 85%;
    background: #ffffff;
    border-radius: 0.05rem;
}

.battery-cap {
    position: absolute;
    right: -0.25rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0.15rem;
    height: 0.4rem;
    background: #333333;
    border-radius: 0 0.1rem 0.1rem 0;
}
</style>
