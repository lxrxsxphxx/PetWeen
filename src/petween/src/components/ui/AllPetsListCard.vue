<script setup lang="ts">
/**
 * AllPetsListCard
 *
 * A list-style card used on AllPetsPage to display all pets.
 * Each row shows: thumbnail placeholder, pet name, owners, and happiness.
 *
 * Frontend-only: pets are passed in as props (mock data).
 */

type PetListItem = {
  id:       number
  name:     string
  owners:   string
  happiness:number
  image?:   string
}

withDefaults(
  defineProps<{
    title?: string
    pets: PetListItem[]
  }>(),
  {
    title: 'Your Pets',
  },
)
</script>

<template>
  <section class="pets-card">
    <div class="pets-title">{{ title }}</div>

    <div class="pets-list">
      <button
        v-for="pet in pets"
        :key="pet.id"
        type="button"
        class="pet-row"
      >
        <div class="row-left">
          <div class="thumbnail">
            <img v-if="pet.image" :src="pet.image" alt="" />
          </div>

          <div class="texts">
            <div class="pet-name">{{ pet.name }}</div>
            <div class="pet-owners">{{ pet.owners }}</div>
            <div class="pet-happiness">Happiness: {{ pet.happiness }}%</div>
          </div>
        </div>

        <q-icon 
          name="chevron_right" 
          class="chevron" 
        />
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pets-card {
  background: var(--q-accent);
  border-radius: 18px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.pets-title {
  padding: 0.95rem 1rem 0.7rem 1rem;
  font-size: 1.2rem;
  font-weight: 800;

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.pets-list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  /* stops that the outer screen scrolls if you reach the end of the list */
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.pet-row {
  width: 100%;
  padding: 0.95rem 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: var(--q-secondary);
  border-radius: 0; /* override global button styling */
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  color: var(--q-text);
  text-align: left;
}

.row-left {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.thumbnail {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  overflow: hidden;
}

.thumbnail img {
  width: 110%;
  height: 110%;
  object-fit: cover;
}

.texts {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.pet-name {
  font-weight: 800;
}

.pet-owners,
.pet-happiness {
  font-size: 0.78rem;
  opacity: 0.65;
}

.chevron {
  font-size: 1.25rem;
  opacity: 0.8;
}
</style>
