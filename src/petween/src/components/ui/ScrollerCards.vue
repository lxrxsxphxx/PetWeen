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
        overflow-y: hidden;

        padding-bottom: 0.5rem;
        padding-inline: 1rem;
        
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;

        -webkit-overflow-scrolling: touch;

        scrollbar-width: thin;

        &::before,
        &::after
        {
            content: '';
            flex: 0 0 0.5rem;
        }
    }

    .scroller > * {
        scroll-snap-align: start;
        flex-shrink: 0;
    }
</style>
