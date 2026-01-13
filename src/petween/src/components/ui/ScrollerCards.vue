<template>
    <!-- ScrollerCards component -->
    <div class="scroller">
        <!-- Scrollable slot for cards -->
        <slot />
    </div>
</template>


<script setup lang="ts">
    // No props or state needed for this simple wrapper component
</script>


<style scoped lang="scss">
    /* Styles for the scroller container */
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

        scrollbar-width: none;

        // puffer at the start and end of the scroller
        &::before,
        &::after
        {
            content: '';
            flex: 0 0 0.5rem;
        }
    }

    /* Styles for each child element inside the scroller */
    .scroller > * {
        scroll-snap-align: start;
        flex-shrink: 0;
    }
</style>
