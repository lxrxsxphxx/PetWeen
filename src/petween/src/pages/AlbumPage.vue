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
const pets = ['Bonki', 'Froggi', 'Danio']
const ALL_PETS = 'All pets'

type AlbumEntry = {
  id:       string
  petName:  string
  date:     string
  image?:   string
}

// Frontend dummy data for pictures
const entries = reactive<AlbumEntry[]>([
  {id: '1', petName: 'Bonki',     date: '15.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '2', petName: 'Danio',     date: '10.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '3', petName: 'Froggi',    date: '03.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '4', petName: 'Bonki',     date: '02.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '5', petName: 'Danio',     date: '22.12.25',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '6', petName: 'Froggi',    date: '21.12.25',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '7', petName: 'Bonki',     date: '15.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '8', petName: 'Danio',     date: '10.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '9', petName: 'Froggi',    date: '03.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '10',petName: 'Bonki',     date: '02.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '11',petName: 'Danio',     date: '22.12.25',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '12',petName: 'Froggi',    date: '21.12.25',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '13',petName: 'Bonki',     date: '02.01.26',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '14',petName: 'Danio',     date: '22.12.25',image:'src/assets/quasar-logo-vertical.svg'},
  {id: '15',petName: 'Froggi',    date: '21.12.25',image:'src/assets/quasar-logo-vertical.svg'},
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

// Image Overlay
const overlayOpen = ref(false)
const selectedEntry = ref<AlbumEntry | null>(null)

function openOverlay(entry: AlbumEntry) {
  selectedEntry.value = entry
  overlayOpen.value = true
}

function closeOverlay() {
  overlayOpen.value = false
  selectedEntry.value = null
}

</script>

<template>
  <q-page class="page">

    <transition name="fade">
      <div v-if="overlayOpen" class="imageOverlay">
        <q-btn flat round icon="navigate_before" size="40px" class="overlay-back" @click="closeOverlay" />
        <div class="overlay-wrapper">
          <img v-if="selectedEntry?.image" :src="selectedEntry.image" class="overlay-image" />
          <div v-if="selectedEntry" class="overlay-date"> 
            {{ selectedEntry.date }}
          </div>
        </div>
      </div>
    </transition>

    <!-- Top bar (back-button + PageHeader) -->
    <div class="sticky-header">
      <PageHeader
        back
        @back="router.back()"
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
        @click="openOverlay(entry)"
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

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
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

.imageOverlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-back {
  position: absolute;
  top: 16px;
  left: -7px;
  color: white;
  font-size: 1.4rem;
  z-index: 1001;
  font-weight: bold;
  color: var(--q-accent);
}

.overlay-wrapper {
  width: 95%;
  max-width: 480px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--q-accent);
  border-radius: 18px;
  padding: 20px;
}

.overlay-photo {
  width: 100%;
  aspect-ratio: 0.9 / 0.73;
  border-radius: 18px;
  overflow: hidden;
  background: #ffffff;
}

.overlay-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 14px;
  background: #fff;
}

.overlay-metadata {
  background: var(--q-accent);
  border-radius: 18px;
  padding: 12px;
  line-height: 1.1;
}

.overlay-name {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.overlay-date {
  font-size: 0.78rem;
  opacity: 0.85;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
