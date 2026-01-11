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
        min-width: 160px;
        padding: 0.75rem;
        border-radius: 14px;
        
        background: rgba(255, 255, 255, 0.05);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
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
</style>
