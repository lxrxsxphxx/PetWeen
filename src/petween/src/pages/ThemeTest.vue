<template>
    <q-page class="container flex-center column full-height">
        <div class="card column theme-test">
            <h1>Theme Test</h1>

        <!-- Brand colors preview -->
        <div class="row gap">
            <q-btn color="primary" label="Primary" />
            <q-btn color="secondary" label="Secondary" />
            <q-btn color="accent" label="Accent" />
        </div>

        <!-- Actions -->
        <div class="column gap">
            <q-btn
                label="Toggle Dark / Light"
                @click="theme.toggleMode()"
            />

        </div>

        <!-- Info -->
            <p  class="theme-info">
                Aktives Theme: {{ theme.currentTheme.name }}<br />
                Mode: {{ theme.currentTheme.mode }}
            </p>
        </div>
    </q-page>
</template>

<script setup lang="ts">
    import { useThemeStore } from 'src/stores/theme-store'

    const theme = useThemeStore()
</script>


<style scoped lang="scss">
    .theme-test {
        width: 100%;
        max-width: 420px;
        text-align: center;
    }

    .gap {
        gap: 0.75rem;
    }

    .theme-info {
        margin-top: 1rem;
        font-size: 0.9rem;
        opacity: 0.75;
    }
</style>

