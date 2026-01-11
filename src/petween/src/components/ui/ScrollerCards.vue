<template>
    <div class="scroller">
        <slot />
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
    .scroller {
        display: flex;
        gap: 0.75rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
        
        scroll-snap-type: x mandatory;
    }

    .scroller > * {
        scroll-snap-align: start;
    }
</style>
