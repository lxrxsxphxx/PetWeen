<script setup lang="ts">
/**
 * This Site displays all of the users saved pictures
 * 
 */
import {computed, ref, reactive}     from 'vue'
import {useRouter}         from 'vue-router'

import AlbumPhotoCard      from 'src/components/ui/AlbumPhotoCard.vue'
import PageHeader          from 'src/components/layout/PageHeader.vue'
import DropdownMenu        from 'src/components/ui/DropdownMenu.vue'


const router = useRouter()

// Frontend dummy data for options to choose from
const pets = ['Bulki', 'Froggi', 'Danio']
const ALL_PETS = 'All pets'

type AlbumEntry = {
  id:       string
  petName:  string
  date:     string
  image?:   string
}

// Frontend dummy data for pictures
const entries = reactive<AlbumEntry[]>([
  {id: '1', petName: 'Bulki',     date: '15.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '2', petName: 'Danio',     date: '10.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '3', petName: 'Froggi',    date: '03.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '4', petName: 'Bulki',     date: '02.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '5', petName: 'Danio',     date: '22.12.25',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '6', petName: 'Froggi',    date: '21.12.25',image:'src/assets/quasar-logo-vertical.svg'},
])


// Filter: only by pet name
const selectedPet = ref<string>(ALL_PETS)
const petOptions = computed(() => [ALL_PETS, ...pets])

// returns pictures by pets 
const filteredEntries = computed(() => {
  if (selectedPet.value === ALL_PETS) return entries
  return entries.filter((e) => e.petName === selectedPet.value)
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
    <DropdownMenu
      :value="selectedPet"
      @petSelect="selectedPet=$event"
      :options="petOptions"
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



.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.1rem;
}

</style>
