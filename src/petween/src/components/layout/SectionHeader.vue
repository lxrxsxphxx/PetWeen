<template>
    <!-- SectionHeader component -->
    <div class="section-header">
        <h2>{{ title }}</h2>

        <!-- View all button -->
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
    /**
     * Props:
     * - title: The title of the section
     * - to: Optional route to navigate to when "View all" is clicked
     */
    defineProps<{
        title: string
        to?: string
    }>()
</script>

<style scoped lang="scss">
    /* Styles for SectionHeader component */
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

    /* Styles for View all button */
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
