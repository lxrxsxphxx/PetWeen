<template>
  <q-page class="page">
    <PageHeader title="new request" />

    <!-- Info Text -->
    <p class="info-text">
      Only accept friend requests from people you know, trust, and feel comfortable with. 
      If you don't recognize the person, it's safer to decline or verify their identity first.
    </p>

    <!-- Outer Container -->
    <div class="outer-container">
      <!-- Friend Requests Section -->
      <section class="requests-section">
        <!-- Empty State -->
        <div v-if="pendingRequests.length === 0" class="empty-state">
          <q-icon name="person_add_outline" class="empty-icon" />
          <p class="empty-title">No pending requests</p>
          <p class="empty-message">All friend requests have been processed</p>
        </div>

        <!-- Requests List -->
        <div v-else class="requests-list">
          <div
            v-for="request in pendingRequests"
            :key="request.id"
            class="request-item"
          >
            <FriendListItem
              :image="request.image"
              :name="request.name"
              :tags="`ID: ${request.id}`"
            >
              <template #arrow>
                <div class="action-buttons">
                  <q-btn
                    flat
                    class="decline-btn"
                    label="decline"
                    @click.stop="handleDecline(request.id)"
                  />
                  <q-btn
                    flat
                    class="accept-btn"
                    label="accept"
                    @click.stop="handleAccept(request.id)"
                  />
                </div>
              </template>
            </FriendListItem>
          </div>
        </div>
      </section>
    </div>

    <!-- Send Request Button -->
    <button class="send-request-btn" @click="goToAddFriend">
      <span>send Request</span>
    </button>

    <!-- Success/Error Messages -->
    <SuccessMessage 
      v-if="messagesStore.show && messagesStore.message"
      :show="messagesStore.show" 
      :message="messagesStore.message || ''" 
      :type="messagesStore.type || 'success'"
    />
  </q-page>
</template>

<script setup lang="ts">
  /**
   * NewRequest Page Component
   * 
   * Zeigt alle ausstehenden Freund-Anfragen an.
   * Ermöglicht das Akzeptieren oder Ablehnen von Anfragen.
   * Displays all pending friend requests.
   * Enables accepting or declining requests.
   */
  
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import PageHeader from 'src/components/layout/PageHeader.vue'
  import FriendListItem from 'src/components/ui/FriendListItem.vue'
  import SuccessMessage from 'src/components/ui/SuccessMessage.vue'
  import { useFriendsStore } from 'src/stores/friends-store'
  import { useMessagesStore } from 'src/stores/messages-store'

  const friendsStore = useFriendsStore()
  const messagesStore = useMessagesStore()
  const router = useRouter()

  /**
   * Gibt alle ausstehenden Freund-Anfragen zurück.
   * @returns {ComputedRef<FriendData[]>} Liste der ausstehenden Anfragen.
   */
  const pendingRequests = computed(() => {
    return friendsStore.allFriends
      .filter(friend => 
        !friendsStore.isFriendDeleted(friend.id) && 
        !friendsStore.isFriendBlocked(friend.id) &&
        !friendsStore.acceptedRequests.includes(friend.id) &&
        !friendsStore.declinedRequests.includes(friend.id)
      )
      .slice(0, 4)
  })

  /**
   * Akzeptiert eine Freund-Anfrage.
   * Zeigt eine Erfolgsmeldung an.
   * @param {string} requestId - Die ID der Anfrage.
   * @returns {void}
   */
  const handleAccept = (requestId: string) => {
    const request = pendingRequests.value.find(r => r.id === requestId)
    if (!request) return

    friendsStore.acceptFriendRequest(requestId)
    messagesStore.showSuccess(`${request.name} added to friends!`)
  }

  /**
   * Lehnt eine Freund-Anfrage ab.
   * Zeigt eine Erfolgsmeldung an.
   * @param {string} requestId - Die ID der Anfrage.
   * @returns {void}
   */
  const handleDecline = (requestId: string) => {
    const request = pendingRequests.value.find(r => r.id === requestId)
    if (!request) return

    friendsStore.declineFriendRequest(requestId)
    messagesStore.showSuccess('Friend request declined')
  }

  /**
   * Navigiert zur AddFriend-Seite.
   * @returns {void}
   */
  const goToAddFriend = () => {
    router.push('/add-friend')
  }
</script>

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
  margin-top: 0.5rem;
}

.info-text {
  font-size: 1rem;
  color: var(--q-text);
  opacity: 0.9;
  line-height: 1.5;
  margin: 0 auto 1rem;
  padding: 0 1rem;
  text-align: center;
  max-width: 480px;
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
  
  :deep(.friend-item) {
    cursor: default;
    width: 95%;
    margin: 0 auto;
    
    &:active {
      background-color: transparent;
    }
  }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.accept-btn,
.decline-btn {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: none;
  min-height: 32px;
  min-width: 70px;
  border: none;
}

.accept-btn {
  background: var(--q-background);
  color: var(--q-accent);
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
}

.decline-btn {
  background: var(--q-accent);
  color: var(--q-background);
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
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
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
}
</style>