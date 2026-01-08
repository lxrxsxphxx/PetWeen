<template>
    <q-page class="flex flex-center column q-pa-md" style="min-height: 100vh">
        <h1 class="text-h5 q-mb-md">Theme Test</h1>
        <div class="q-mb-md flex row" style="gap: 10px;">
            <q-btn color="primary" label="Primary" />
            <q-btn color="secondary" label="Secondary" />
            <q-btn color="accent" label="Accent" />
        </div>

        <div class="flex column" style="gap: 10px;">
            <q-btn color="primary" label="Toggle Dark/Light" @click="toggleMode"/>
            <q-btn color="secondary" label="Next Theme" @click="cycleThemes"/>
        </div>
    </q-page>
</template>

<script setup lang="ts">
    import { toggleMode, cycleThemes } from 'boot/theme'
</script>

