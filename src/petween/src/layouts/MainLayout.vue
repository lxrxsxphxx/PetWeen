<script setup lang="ts">
  /**
   * Main layout component that structures the application with a header, footer, and main content area.
   * Utilizes Quasar's QLayout for responsive design.
   * Includes BottomNav component for navigation at the bottom of the layout.
   *
   * Imports:
   * - BottomNav: A component for bottom navigation.
   */
  import BottomNav from 'src/components/layout/BottomNav.vue';
</script>


<template>
  <!-- Main Layout Structure -->
  <q-layout view="lHh Lpr lFf">

    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
    <BottomNav />
  
  </q-layout>
</template>
