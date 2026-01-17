<template>
  <!-- Main Layout Structure -->
  <q-layout view="lHh Lpr lFf">
    <StatusBar />

    <q-page-container>
      <router-view />
    </q-page-container>
    <BottomNav />
  
  </q-layout>
</template>

<script setup lang="ts">
  /**
   * Main layout component that structures the application with a header, footer, and main content area.
   * Utilizes Quasar's QLayout for responsive design.
   * Includes BottomNav component for navigation at the bottom of the layout.
   *
   * Imports:
   * - StatusBar: Status bar component for displaying time and system icons.
   * - BottomNav: A component for bottom navigation.
   */
  import StatusBar from 'src/components/layout/StatusBar.vue';
  import BottomNav from 'src/components/layout/BottomNav.vue';
</script>
