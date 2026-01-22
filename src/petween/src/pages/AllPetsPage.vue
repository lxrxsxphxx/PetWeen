<script setup lang="ts">
/**
 * AllPetsPage
 *
 * View-all page for pets (list view).
 * Navigation target for the "View all" button in the Pets section header.
 *
 * Frontend-only: uses mock data.
 */

import { useRouter} from 'vue-router'
import { reactive } from 'vue'

import AllPetsListCard from 'src/components/ui/AllPetsListCard.vue'
import quasarLogo from 'src/assets/quasar-logo-vertical.svg'
import PageHeader from 'src/components/layout/PageHeader.vue'

const router = useRouter()

type PetEntry = {
  id:       number
  name:     string
  owners:   string
  happiness:string
  image?:   string
}

const pets = reactive<PetEntry[]>([
  {id: 1, name: 'Krokolilo',  owners: 'Monika, Sophia',   happiness: '73%'},
  {id: 2, name: 'Danio',      owners: 'Monika, Linus',    happiness: '100%', image: quasarLogo},
  {id: 3, name: 'Rabitto',    owners: 'Linus',            happiness: '26%'},
  {id: 4, name: 'Bonki',      owners: 'Monika, Ran',      happiness: '77%'},
  {id: 5, name: 'Stalori',    owners: 'Monika, Sophia',   happiness: '66%'},
  {id: 6, name: 'Dextra',     owners: 'Monika, Linus',    happiness: '71%',  image: quasarLogo},
  {id: 7, name: 'Flusel',     owners: 'Linus',            happiness: '100%'},
  {id: 8, name: 'shumato',    owners: 'Monika, Ran',      happiness: '96%'},
])
</script>

<template>
  <q-page class="page">
    <PageHeader
    back
    @back="router.back()" 
    title="All Pets"
    />

    <div class="list-area">
        <AllPetsListCard :pets="pets" />
    </div>

    <q-btn
      unelevated
      class="add-btn"
      label="+ add new pet"
      @click="router.push('/add-pet')"
    />
  </q-page>
</template>

<style scoped lang="scss">
.page {
  /* page must not scroll -> fixed hight and overflow hidden */
  height: 36.9rem;
  overflow: hidden;

  width: 100%;
  max-width: 480px;
  margin: 0 auto;

  padding: 1rem;
  padding-bottom: 6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* Quasar/Flex: makes getting smaller possible otherwise it gets bugged sometimes */
  min-height: 0;
}
.page :deep(.page-header) {
    padding-bottom: 0rem;
}

.list-area {
  flex: 1 1 auto;
  min-height: 0; /* <- makes getting smaller possible, otherwise it gets bugged sometimes */
  max-height: 36.9rem;
}

.add-btn {
  width: 100%;
  border-radius: 30px;
  padding: 1rem;

  background: var(--q-accent);
  text-transform: none;
}
</style>
