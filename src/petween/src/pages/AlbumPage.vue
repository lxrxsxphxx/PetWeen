<script setup lang="ts">
import {computed, ref}  from 'vue'
import {useRouter}      from 'vue-router'

import AlbumPhotoCard   from 'src/components/ui/AlbumPhotoCard.vue'
import PageHeader       from 'src/components/layout/PageHeader.vue'

const router = useRouter()

// Frontend dummy data
const pets = ['Krokolilo', 'Froggi', 'Danio']

type AlbumEntry = {
  id:       string
  petName:  string
  date:     string
  image?:   string
}

const entries = ref<AlbumEntry[]>([
  {id: '1', petName: 'Krokolilo', date: '15.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '2', petName: 'Danio',     date: '10.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '3', petName: 'Froggi',    date: '03.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '4', petName: 'Krokolilo', date: '02.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '5', petName: 'Danio',     date: '22.12.25',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '6', petName: 'Froggi',    date: '21.12.25',image:'src/assets/quasar-logo-vertical.svg'},
])

const ALL_PETS = 'All pets'
// Filter: only by pet name
const selectedPet = ref<string>(ALL_PETS)
const petOptions = computed(() => [ALL_PETS, ...pets])

const filteredEntries = computed(() => {
  if (selectedPet.value === ALL_PETS) return entries.value
  return entries.value.filter((e) => e.petName === selectedPet.value)
})

function goBack() {
  router.back()
}
</script>

<template>
  <q-page class="page">
    <!-- Top bar (back-button + PageHeader) -->
    <div class="topbar">
      <q-btn
        flat
        dense
        icon="chevron_left"
        class="back-btn"
        @click="goBack"
      />
      <PageHeader
        title="Album"
      />

    </div>

    <!-- Pet filter -->
    <q-select
      v-model="selectedPet"
      :options="petOptions"
      dense
      outlined
      class="pet-select"
      dropdown-icon="expand_more"
      behavior="menu"
      menu-anchor="bottom left"
      menu-self="top left"
      options-cover
      popup-content-class="album-pet-menu"
    />


    <!-- Album grid -->
    <div class="grid">
      <AlbumPhotoCard
        v-for="entry in filteredEntries"
        :key="entry.id"
        :petName="entry.petName"
        :date="entry.date"
        :image="entry.image"
      />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.page {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 1rem;
  padding-bottom: 6rem; /* space for BottomNav */
}

.topbar {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
}

.topbar :deep(.page-header){
  margin-bottom: 0rem;
  margin-top: 0rem;
}

.back-btn {
  opacity: 0.9;
  font-size: 2rem;
  padding-bottom: 1.5rem;
}

.pet-select {
  width: 100%;
  margin: 0rem 0rem 1.1rem 0rem;
}

.pet-select :deep(.q-field__control) {
  background: var(--q-accent);
  border-radius: 10px;
}

.pet-select :deep(.q-field__control:before) {
  border: none;
}



.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.1rem;
}

</style>


<style lang="scss">
/* QSelect menu has to be global (not scoped) */
.album-pet-menu {
  background: var(--q-secondary) !important;
  color: var(--q-text) !important;
  border-radius: 10px;
}
</style>