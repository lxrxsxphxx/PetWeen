<template>
    <!-- Bottom Navigation Bar -->
    <nav class="bottom-nav">
        <!-- Navigation items-->
        <button
            v-for="item in items"
            :key="item.to"
            class="nav-item"
            :class="{ active: route.path === item.to }"
            @click="go(item.to)"
        >
        <!-- Icon and label -->
        <q-icon :name="item.icon" class="nav-icon" />
        <span class="nav-label">{{ item.label }}</span>
        </button>
    </nav>
</template>


<script setup lang="ts">
    /**
     * Bottom Navigation Bar component
     *
     * Provides quick access to main sections of the app.
     * Uses Vue Router for navigation.
     * maintains active state based on current route.
    */
    import { useRoute, useRouter } from 'vue-router'

    // Vue Router instances
    const route = useRoute()
    const router = useRouter()

    // Icons and labels for navigation items
    const items = [
        { label: 'Home', icon: 'home', to: '/' },
        { label: 'Pets', icon: 'pets', to: '/petshome' },
        { label: 'Friends', icon: 'group', to: '/friends' },
        { label: 'Album', icon: 'photo_library', to: '/album' },
        { label: 'Settings', icon: 'settings', to: '/settings' }
    ]

    // Navigate to specified route
    function go(to: string) {
        if (route.path !== to) {
        router.push(to)
        }
    }
</script>


<style scoped lang="scss">
    /* Bottom Navigation Bar Styles */
    .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        
        display: flex;
        justify-content: space-around;
        
        padding: 0.6rem 0 0.75rem;
        background: var(--q-background);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* Navigation Item Styles */
    .nav-item {
        background: none;
        border: none;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;

        min-width: 64px;
        color: var(--q-text);
        opacity: 0.6;

        font-family: inherit;
    }

    .nav-icon {
        font-size: 1.3cm;
    }

    .nav-label {
        font-size: 0.8rem;
    }

    /* Active Navigation Item Styles */
    .nav-item.active {
        opacity: 1;
        color: var(--q-primary);
    }

</style>
