<template>
    <!-- NewRequestLink Komponente -->
    <button class="new-request-link">
        new request
    </button>
</template>

<script setup lang="ts">
/**
 * NewRequestLink Komponente zum Anzeigen eines Links zu Freund-Anfragen
 */
</script>

<style scoped lang="scss">
/* NewRequestLink Stile */
.new-request-link {
    background: none;
    border: none;
    color: var(--q-text);
    font-size: 1rem;
    opacity: 0.8;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    
    &:active {
        opacity: 1;
    }
}
</style>
