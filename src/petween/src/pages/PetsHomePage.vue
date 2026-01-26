<script setup lang="ts">
/**
 * this is the page you will be navigated to, if you press Pets on the 
 * BottomNavigation or if you press view all on the homepage-sectionheader for pets
 * 
 */
import { useRouter } from 'vue-router'

import PageHeader       from 'src/components/layout/PageHeader.vue'
import SectionHeader    from 'src/components/layout/SectionHeader.vue'
import ScrollerCards    from 'src/components/ui/ScrollerCards.vue'
import InfoCard         from 'src/components/ui/InfoCard.vue'
import PetAttentionCard from 'src/components/ui/PetAttentionCard.vue'

const router = useRouter()

const attentionPets = [
  {name: 'Bulki', owner: 'Monika',     image: '/src/assets/Dino.png'},
  {name: 'Danio', owner: 'Sophia, Max',image: '/src/assets/quasar-logo-vertical.svg'},
  {name: 'Rabitto', owner: 'Linus',    image: ''},
  {name: 'Froggi', owner: 'Martin',    image: '/src/assets/Frog.png'},
  {name: 'Lavello', owner: 'Lucie',    image: ''},
]

const pets = [
  {name: 'Bulki', owner: 'Monika',     image: '/src/assets/Dino.png'},
  {name: 'Danio', owner: 'Sophia',     image: '/src/assets/quasar-logo-vertical.svg'},
  {name: 'Rabitto', owner: 'Linus',    image: '/src/assets/quasar-logo-vertical.svg'},
  {name: 'Froggi', owner: 'Martin',    image: '/src/assets/Frog.png'},
  {name: 'Lavello', owner: 'Lucie',    image: '/src/assets/quasar-logo-vertical.svg'},
]

</script>


<template>
  <q-page class="page">
    <PageHeader 
      title=""
      subtitle=""
    />

    <PetAttentionCard :pets="attentionPets" 
    @click="router.push(`/take-care`)"
    />

    <section class="section">
      <SectionHeader title="Pets" to="/all-pets" />

      <div class="pets-scroller">
        <ScrollerCards>
          <InfoCard
            v-for="pet in pets"
            :key="pet.name"
            :image="pet.image"
            :title="pet.name"
            :info1="pet.owner"
            info2=""
            @click="router.push(`/take-care`)"
          />
        </ScrollerCards>
      </div>

      <q-btn 
        unelevated 
        class="add-btn" 
        label="+ add new pet" 
        @click="router.push('/add-pet')"
        />
    </section>
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

.section {
  margin-bottom: 0.5rem;
}

.pets-scroller {
  margin-bottom: 0.9rem;
}

/* make InfoCard smaller (only on this page) */
.pets-scroller :deep(.info-card) {
  width: 112px;
  min-height: 150px;
  padding: 0.6rem;
  border-radius: 16px;
}

.pets-scroller :deep(img) {
  height: 70px;
  border-radius: 12px;
}

.pets-scroller :deep(.content) {
  font-size: 0.72rem;
}

.pets-scroller :deep(.content strong) {
  font-size: 0.78rem;
}

.add-btn {
  width: 100%;
  border-radius: 30px;
  padding: 1rem;
  margin-top: 1rem;

  background: var(--q-secondary);
  text-transform: none;
}
</style>
