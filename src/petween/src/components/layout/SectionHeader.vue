<template>
    <div class="section-header">
        <h2>{{ title }}</h2>
        
        <q-btn
            v-if="to"
            flat
            dense
            class="view-all"
            label="View all"
            @click="$router.push(to)"
        />
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        title: string
        to?: string
    }>()
</script>

<style scoped lang="scss">
    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }

    h2 {
        font-size: 1.5rem;
        margin: 0;
    }

    .view-all {
        font-size: 0.75rem;
        opacity: 0.7;
        padding: 0;
        min-height: auto;
    }

    @media (hover: hover) {
        .view-all:hover {
            opacity: 1;
            text-decoration: underline;
        }
    }
</style>
