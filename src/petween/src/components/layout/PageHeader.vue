<template>
    <header class="page-header">
        <p class="title"> {{ title }}</p>
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
        margin-top: 2rem;
        text-align: center;
        font-size: 4rem;
        margin-bottom: 2rem;
    }
    .title {
        margin: 0;
        font-size: 2.8rem;
        font-weight: bold;
    }

    .subtitle {
        text-align: left;
        opacity: 0.6;
        font-size: 0.9rem;
    }
</style>
