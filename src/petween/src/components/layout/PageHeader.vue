<template>
    <!-- PageHeader component -->
    <header class="page-header">
        <div class="left" v-if="back">
            <q-btn
                flat
                dense
                round
                icon="navigate_before"
                size="40px"
                class="back-btn"
                @click="$emit('back')"
            />
        </div>

        <div class="center">
            <p class="title"> {{ title }}</p>
            <p class="subtitle">{{ subtitle }}</p>
        </div>
        <!-- Right side content as placeholder-->
        <div class="right"></div>
    </header>
</template>


<script setup lang="ts">

/**
 * Props:
 * - title: The main title text to display.
 * - subtitle: An optional subtitle text to display below the title.
 * - back: A boolean indicating whether to show a back button.
 */

    defineProps<{
        title: string
        subtitle?: string
        back?: boolean
    }>()

/**
 * Emits:
 * - back: Emitted when the back button is clicked.
 */

    defineEmits<{
        (e: 'back'): void
    }>()

</script>


<style scoped lang="scss">
    /* Styles for the PageHeader component */
    .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem 1rem;
    }
    .left, .right {
        width: 40px; /* Fixed width for alignment */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .center {
        flex: 1;
        text-align: center;
    }

    .back-btn {
        color: var(--q-primary);
        min-width: 70px;
        min-height: 70px;
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
        margin: 0;
    }
</style>
