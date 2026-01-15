<script setup lang="ts">
    type PetAttentionList = {
        name: string
        owner: string
        image?: string
    }

    withDefaults(
        defineProps<{
        title?: string
        pets: PetAttentionList[]
    }>(),
    {
    title: 'Need your attention',
    },
    )
</script>


<template>
  <section class="attention-card">
    <div class="attention-title">{{ title }}</div>

    <div class="attention-list">
      <button
        v-for="pet in pets"
        :key="pet.name"
        type="button"
        class="attention-row"
      >
        <div class="row-left">
          <div class="thumbnail">
            <img v-if="pet.image" :src="pet.image" alt="" />
          </div>

          <div class="texts">
            <div class="pet-name">{{ pet.name }}</div>
            <div class="pet-owner">{{ pet.owner }}</div>
          </div>
        </div>

        <q-icon name="chevron_right" class="chevron" />
      </button>
    </div>
  </section>
</template>


<style scoped lang="scss">
.attention-card {
  background: var(--q-accent);
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 1.25rem;
}

.attention-title {
  padding: 0.9rem 1rem 0.6rem 0.9rem;
  font-size: 1.15rem;
  font-weight: 700;
}

.attention-list {
  display: flex;
  flex-direction: column;
}

.attention-row {
  width: 100%;
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: var(--q-secondary);
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  color: inherit;
  text-align: left;

  /* overrides global button-styling */
  border-radius: 0;
}

.row-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.thumbnail {
  width: 44px;
  height: 44px;
  border-radius: 10px;
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
}

.pet-name {
  font-weight: 700;
  line-height: 1.1;
}

.pet-owner {
  font-size: 0.78rem;
  opacity: 0.75;
  line-height: 1.1;
}

.chevron {
  font-size: 1.2rem;
  opacity: 0.8;
}
</style>
