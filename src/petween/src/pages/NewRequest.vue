<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import PageHeader from 'src/components/layout/PageHeader.vue'
import FriendListItem from 'src/components/ui/FriendListItem.vue'
import SuccessMessage from 'src/components/ui/SuccessMessage.vue'

import { useFriendsStore } from 'src/stores/friends-store'
import { useMessagesStore } from 'src/stores/messages-store'

const router = useRouter()
const friendsStore = useFriendsStore()
const messagesStore = useMessagesStore()

const pendingRequests = computed(() =>
  friendsStore.allFriends
    .filter(
      (friend) =>
        !friendsStore.acceptedRequests.includes(friend.id) &&
        !friendsStore.declinedRequests.includes(friend.id) &&
        !friendsStore.isFriendDeleted(friend.id) &&
        !friendsStore.isFriendBlocked(friend.id)
    )
    .slice(0, 4)
)

function acceptRequest(friendId: string) {
  friendsStore.acceptFriendRequest(friendId)
  messagesStore.showSuccess('Friend request accepted!', 2000)
}

function declineRequest(friendId: string) {
  friendsStore.declineFriendRequest(friendId)
  messagesStore.showInfo('Friend request declined', 2000)
}

function goToAddFriend() {
  router.push('/add-friend')
}
</script>

<template>
  <q-page class="page">
    <PageHeader 
      back
      @back="router.back()"
      title="New Request" 
    />

    <div class="outer-container">
      <section class="requests-section">
        <div v-if="pendingRequests.length === 0" class="empty-state">
          <q-icon name="inbox" class="empty-icon" />
          <p class="empty-title">No new requests</p>
          <p class="empty-message">You're all caught up!</p>
        </div>

        <div v-else class="requests-list">
          <div v-for="friend in pendingRequests" :key="friend.id" class="request-item">
            <FriendListItem
              :image="friend.image"
              :name="friend.name"
              :tags="friend.tags"
              :clickable="false"
            >
              <template #arrow>
                <div class="action-buttons">
                  <q-btn
                    flat
                    round
                    dense
                    icon="check"
                    class="accept-btn"
                    @click.stop="acceptRequest(friend.id)"
                  />
                  <q-btn
                    flat
                    round
                    dense
                    icon="close"
                    class="decline-btn"
                    @click.stop="declineRequest(friend.id)"
                  />
                </div>
              </template>
            </FriendListItem>
          </div>
        </div>
      </section>
    </div>

    <button class="send-request-btn" @click="goToAddFriend">
      <span>send request</span>
    </button>

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

.requests-section {
  background: var(--q-secondary);
  border-radius: 14px;
  padding: 0;
  margin: 1rem auto 0;
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
  font-size: 5rem;
  color: var(--q-text);
  opacity: 0.5;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--q-text);
  margin: 0 0 0.75rem 0;
}

.empty-message {
  font-size: 1.1rem;
  color: var(--q-text);
  opacity: 0.7;
  margin: 0;
}

.requests-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 0;
  margin: 0 auto;
  background: transparent;
  border-radius: 8px;
  overflow: hidden;
  padding: 0.5rem 0;
  width: 100%;
  height: 100%;
  flex: 1;
}

.request-item {
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.accept-btn,
.decline-btn {
  color: var(--q-text);
}

.accept-btn {
  background: var(--q-accent);
}

.decline-btn {
  background: var(--q-primary);
}

.send-request-btn {
  width: 100%;
  max-width: calc(480px - 2rem);
  margin: 2rem auto 0;
  font-size: 1.2rem;
  padding: 1rem;
  min-height: 60px;
  color: var(--q-text);
  background: var(--q-primary);
  border-radius: 30px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-transform: none;
  font-weight: 500;
}

.send-request-btn:hover {
  opacity: 0.9;
}

.send-request-btn:active {
  opacity: 0.8;
}
</style>
