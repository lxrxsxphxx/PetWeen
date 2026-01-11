<template>
    <header class="page-header">
        <h1>{{ title }}</h1>
        <p class="subtitle">{{ subtitle }}</p>
    </header>
</template>

<script setup lang="ts">
    defineProps<{
        title: string
        subtitle?: string
    }>()
</script>

<style scoped lang="scss">
    .page-header {
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .subtitle {
        opacity: 0.6;
        font-size: 0.9rem;
    }
</style>
