<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import FriendListItem from 'src/components/ui/FriendListItem.vue'
import SuccessMessage from 'src/components/ui/SuccessMessage.vue'

import { useFriendsStore } from 'src/stores/friends-store'
import { useMessagesStore } from 'src/stores/messages-store'

const router = useRouter()
const friendsStore = useFriendsStore()
const messagesStore = useMessagesStore()

const friends = computed(() =>
  friendsStore.allFriends
    .filter(
      (f) =>
        friendsStore.acceptedRequests.includes(f.id) &&
        !friendsStore.isFriendDeleted(f.id) &&
        !friendsStore.isFriendBlocked(f.id)
    )
    .map((f) => ({
      ...f,
      displayName: friendsStore.getFriendDisplayName(f.id, f.name),
    }))
)

function goToAddFriend() {
  router.push('/add-friend')
}

function goToNewRequests() {
  router.push('/new-request')
}

function goToFriendSettings(friendId: string, name: string) {
  router.push({ path: '/friend-settings', query: { friendId, name } })
}
</script>

<template>
  <q-page class="page">
    <div class="content">
      <div class="outer-container">
        <header class="friends-header">
          <h1 class="friends-title">Your Friends</h1>

          <button 
            class="new-request-btn" 
            type="button" 
            @click="goToNewRequests"> 
              new request
          </button>
        </header>

        <section class="friends-section">
          <div class="friends-scroll">
            <div v-if="friends.length === 0" class="empty-state">
              <q-icon name="group" class="empty-icon" />
              <p class="empty-title">No friends yet</p>
              <p class="empty-message">Add friends to see them here.</p>
            </div>

            <div v-else class="friends-list">
              <FriendListItem
                v-for="friend in friends"
                :key="friend.id"
                :image="friend.image"
                :name="friend.displayName"
                :tags="friend.tags"
                :clickable="true"
                @click="goToFriendSettings(friend.id, friend.displayName)"
              />
            </div>
          </div>
        </section>
      </div>

      <q-btn 
        unelevated
        class="add-friend-btn" 
        type="button" 
        @click="goToAddFriend">
        <span>+ add new friends</span>
      </q-btn>
    </div>

    <SuccessMessage
      v-if="messagesStore.show && messagesStore.message"
      :show="messagesStore.show"
      :message="messagesStore.message"
      :type="messagesStore.type || 'success'"
    />
  </q-page>
</template>

<style scoped lang="scss">
.page {
  width: 100%;
  margin: 0 auto;
  padding: 0.5rem 1rem 7.5rem 1rem;
  background: var(--q-background);

  display: flex;
  flex-direction: column;

  --friends-list-max-height: 590px;
}

.content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.outer-container {
  background: var(--q-accent);
  border-radius: 18px;
  padding: 0.75rem;
  margin-top: 3rem;

  display: flex;
  flex-direction: column;
}

.friends-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.25rem 0.75rem;
}

.friends-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--q-text);
}

.new-request-btn {
  background: transparent;
  border: none;
  padding: 0.25rem 0.35rem;
  color: var(--q-text);
  font-size: 0.95rem;
  opacity: 0.75;
  text-transform: none;
}

.friends-section {
  background: var(--q-secondary);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  max-height: var(--friends-list-max-height);
}

.friends-scroll {
  width: 100%;
  /* grow to max height */
  max-height: var(--friends-list-max-height);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.friends-list {
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4.5rem;
  color: var(--q-text);
  opacity: 0.5;
  margin-bottom: 1.25rem;
}

.empty-title {
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--q-text);
  margin: 0 0 0.5rem 0;
}

.empty-message {
  font-size: 1rem;
  color: var(--q-text);
  opacity: 0.75;
  margin: 0;
}

.add-button-slot {
  margin-top: auto;      /* presses the button to the bottom */
  padding-top: 1.25rem;
}

.add-friend-btn {
  width: 100%;
  border-radius: 30px;
  padding: 1rem;

  
  margin-top: 1rem;
  background: var(--q-accent);
  text-transform: none;
}
</style>
