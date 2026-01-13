<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container>
      <router-view />
    </q-page-container>
    <BottomNav />
  
  </q-layout>
</template>

<script setup lang="ts">
  import BottomNav from 'src/components/layout/BottomNav.vue';
</script>
