<template>
    <!-- InfoCard component -->
    <div class="info-card">
        <!-- image -->
        <img :src="image" alt="" />

        <!-- content -->
        <div class="content">
            <strong>{{ title }}</strong>
            <span>{{ info1 }}</span>
            <span>{{ info2 }}</span>
        </div>
    </div>
</template>


<script setup lang="ts">

/**
 * short InfoCard component to display an image and some text information
 *
 * Props:
 * - image: string - URL of the image to display at the top of the card
 * - title: string - Title text displayed prominently on the card
 * - info1: string - First line of additional information
 * - info2: string - Second line of additional information
 */

    defineProps<{
        image: string
        title: string
        info1: string
        info2: string
    }>()
</script>


<style scoped lang="scss">
    /* InfoCard styles */
    .info-card {
        width: 160px;
        min-height: 200px;
        padding: 0.75rem;
        border-radius: 14px;
        background: var(--q-primary);
        color: var(--q-text);
        
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
            background: var(--q-accent);
    }


    @media (hover: hover) {
        .info-card:hover {
            transform: translateY(-2px);
        }
    }

    /* content styles */
    img {
        width: 100%;
        height: 80px;
        object-fit: cover;
        border-radius: 10px;
    }

    .content {
        display: flex;
        flex-direction: column;
        font-size: 0.8rem;
        gap: 0.2rem;
    }
    .content strong {
        font-size: 0.9rem;
        font-weight: 600;
        line-height: 1.2;
    }

    .content span {
        font-size: 0.75rem;
        opacity: 0.8;
    }

</style>
