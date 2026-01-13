<template>
    <div class="info-card">
        <img :src="image" alt="" />

        <div class="content">
            <strong>{{ title }}</strong>
            <span>{{ info1 }}</span>
            <span>{{ info2 }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        image: string
        title: string
        info1: string
        info2: string
    }>()
</script>

<style scoped lang="scss">
    .info-card {
        width: 160px;
        min-height: 200px;
        padding: 0.75rem;
        border-radius: 14px;

        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
            background: rgba(255, 255, 255, 0.05);
    }


    @media (hover: hover) {
        .info-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
            background: rgba(255, 255, 255, 0.08);
        }
    }

    
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
