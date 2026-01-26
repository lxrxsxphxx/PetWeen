<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import PageHeader from 'src/components/layout/PageHeader.vue'
import InfoCard from 'src/components/ui/InfoCard.vue'

import { useFriendsStore } from 'src/stores/friends-store'

const router = useRouter()
const friendsStore = useFriendsStore()

const friends = computed(() => {
  const visible = friendsStore.allFriends
    .filter((f) => !friendsStore.isFriendDeleted(f.id) && !friendsStore.isFriendBlocked(f.id))
    .map((f) => ({
      ...f,
      displayName: friendsStore.getFriendDisplayName(f.id, f.name),
    }))

  // Keep the grid full for the prototype (6 cards).
  const fillers = Math.max(0, 6 - visible.length)
  for (let i = 0; i < fillers; i++) {
    visible.push({
      id: `dummy-${i}`,
      name: `Friend ${visible.length + 1}`,
      displayName: `Friend ${visible.length + 1}`,
      image: '/src/assets/quasar-logo-vertical.svg',
      tags: '',
    })
  }

  return visible.slice(0, 6)
})

function selectFriend(friendId: string) {
  // The prototype does not have a backend: just go back to home.
  router.push('/')
}
</script>

<template>
  <q-page class="page">
    <PageHeader title="Send Picture" />

    <div class="outer-container">
      <div class="content">
        <div class="cards-container">
          <InfoCard
            v-for="friend in friends"
            :key="friend.id"
            :image="friend.image"
            :title="friend.displayName"
            info1="Name of Pet"
            info2="12.12.2025"
            @click="selectFriend(friend.id)"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.page {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 0.5rem 1rem calc(2rem + 5.5rem);
  background: var(--q-background);
}

.outer-container {
  background: var(--q-primary);
  border-radius: 15px;
  padding: 0.75rem;
  margin-top: 2rem;
}

.content {
  background: var(--q-secondary);
  border-radius: 14px;
  padding: 1.5rem 1rem;
  display: flex;
  justify-content: center;
}

.cards-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  max-width: 360px;
}
</style>
