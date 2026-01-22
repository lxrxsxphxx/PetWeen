<script setup lang="ts">
/**
 * AlbumPhotoCard
 * A small card used on AlbumPage to display a photo placeholder + the corresponding petName + the date the photo got send.
 *
 * Frontend-only: the "image" prop is optional. If skipped, a white placeholder
 * block will be shown.
 */

defineProps<{
  petName: string
  date: string
  image?: string | undefined
}>()
</script>



<template>
  <div class="album-card">
    <div class="photo" :class="{ empty: !image }">
      <img v-if="image" :src="image"/>
    </div>

    <div class="metadata">
      <p class="name">{{ petName }}</p>
      <p class="date">{{ date }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.album-card {
  background: var(--q-accent);
  border-radius: 18px;
  padding: 12px;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.photo {
  width: 100%;
  aspect-ratio: 0.9 / 0.73;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff; /* placeholder */
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.metadata {
  line-height: 1.1;
}

.name {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
}

.date {
  margin: 0.2rem 0 0 0.2rem;
  font-size: 0.72rem;
  opacity: 0.85;
}
</style>

