<template>
  <!-- Freunde-Startseite -->
  <q-page class="page">
    <PageHeader title="Friend Home" />

    <!-- Äußerer Container -->
    <div class="outer-container">
      <!-- Abschnitts-Header auf äußerem Container -->
      <div class="section-header">
        <h2 class="section-title">Your Friends</h2>
        <NewRequestLink />
      </div>

      <!-- Freunde-Liste Abschnitt -->
      <section class="friends-section">
        <!-- Freunde-Liste -->
        <div class="friends-list">
          <FriendListItem
            v-for="friend in friends"
            :key="friend.id"
            :image="friend.image"
            :name="friend.name"
            :tags="friend.tags"
            :friend-id="friend.id"
          />
        </div>
      </section>
    </div>

    <!-- Neue Freunde hinzufügen Button -->
    <AddFriendsButton />
  </q-page>
</template>

<script setup lang="ts">
  // Importe
  import { ref, computed } from 'vue'
  import PageHeader from 'src/components/layout/PageHeader.vue'
  import FriendListItem from 'src/components/ui/FriendListItem.vue'
  import NewRequestLink from 'src/components/ui/NewRequestLink.vue'
  import AddFriendsButton from 'src/components/ui/AddFriendsButton.vue'
  import { useFriendsStore } from 'src/stores/friends-store'

  const friendsStore = useFriendsStore()

  // Gefilterte Freunde
  const friends = computed(() => {
    return friendsStore.allFriends.filter(friend => 
      !friendsStore.isFriendDeleted(friend.id) && !friendsStore.isFriendBlocked(friend.id)
    )
  })
</script>

<style scoped lang="scss">
/* Page styles */
.page {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 1rem;
  padding-top: 0;
  padding-bottom: 5rem;
  
  /* Page background before container */
  background: var(--q-text);
  min-height: 100vh;  // Appropriate page height
}

/* Outer Container - larger container around the list */
.outer-container {
  background: var(--q-primary);
  border-radius: 15px;
  padding: 1rem;   // المسافة من جميع الجوانب بين المربع الفاتح والداخلي
  margin-top: 0.5rem;  // Lift container slightly
  min-height: 500px;  // Increase height
}

/* Friends Section - list only */
.friends-section {
  background: var(--q-secondary);
  border-radius: 14px;
  padding: 0;  // No padding as list takes full space
  margin: 1rem auto 0;  // المسافة بين المربعات والنص فوق
  min-height: 450px;  // Height for list
  display: flex;  // Distribute cards evenly
  flex-direction: column;
}

/* Section Header */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--q-text);
  margin: .2rem;  // Fix margin value
}

/* Friends List */
.friends-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;  // Distribute cards evenly
  align-items: center;  // Center cards
  gap: 0;  // No spacing - white lines separate items
  margin: 0 auto;  // Center horizontally
  
  /* Transparent background as background exists in friends-section */
  background: transparent;
  border-radius: 8px;
  overflow: hidden;  // Hide inner corners
  padding: 0.5rem 0;  // Vertical padding for better distribution
  width: 100%;  // Full width for inner container
  height: 100%;  // Full height for even distribution
  flex: 1;  // Take all available space
}
</style>
