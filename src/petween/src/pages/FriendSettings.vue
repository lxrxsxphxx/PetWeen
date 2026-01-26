<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PageHeader from 'src/components/layout/PageHeader.vue'
import ActionButton from 'src/components/ui/ActionButton.vue'
import FriendListItem from 'src/components/ui/FriendListItem.vue'
import SuccessMessage from 'src/components/ui/SuccessMessage.vue'

import { useFriendsStore } from 'src/stores/friends-store'
import { useMessagesStore } from 'src/stores/messages-store'

const router = useRouter()
const route = useRoute()

const friendsStore = useFriendsStore()
const messagesStore = useMessagesStore()

const friendId = ref('')
const originalName = ref('')

const showNameDialog = ref(false)
const showDeleteDialog = ref(false)
const showBlockDialog = ref(false)
const showBlockListDialog = ref(false)

const newDisplayName = ref('')

const friend = computed(() => friendsStore.allFriends.find((f) => f.id === friendId.value) || null)

const displayName = computed(() => {
  const fallback = friend.value?.name || originalName.value || 'Friend'
  return friendsStore.getFriendDisplayName(friendId.value, fallback)
})

const friendImage = computed(() => friend.value?.image || '/src/assets/quasar-logo-vertical.svg')

const blockedFriends = computed(() =>
  friendsStore.blockedFriends
    .map((id) => friendsStore.allFriends.find((f) => f.id === id))
    .filter(Boolean)
    .map((f) => ({
      ...f!,
      displayName: friendsStore.getFriendDisplayName(f!.id, f!.name),
    }))
)

onMounted(() => {
  friendId.value = typeof route.query.friendId === 'string' ? route.query.friendId : ''
  originalName.value = typeof route.query.name === 'string' ? route.query.name : ''

  if (!friendId.value) router.back()
})

function closeNameDialog() {
  showNameDialog.value = false
  newDisplayName.value = ''
}

function saveName() {
  const trimmed = newDisplayName.value.trim()
  if (!trimmed) {
    messagesStore.showError('Please enter a valid name')
    return
  }

  friendsStore.setFriendDisplayName(friendId.value, trimmed)
  messagesStore.showSuccess('Friend name updated!')
  closeNameDialog()
}

function confirmDelete() {
  showDeleteDialog.value = false
  friendsStore.deleteFriend(friendId.value)
  messagesStore.showSuccess('Friend deleted!')

  window.setTimeout(() => {
    router.back()
  }, 700)
}

function confirmBlock() {
  showBlockDialog.value = false
  friendsStore.blockFriend(friendId.value)
  messagesStore.showSuccess('Friend blocked!')

  window.setTimeout(() => {
    router.back()
  }, 700)
}

function unblockFriend(id: string) {
  friendsStore.unblockFriend(id)
  messagesStore.showInfo('Friend unblocked')
}

function handleBack() {
  router.back()
}
</script>

<template>
  <q-page class="page">
    <PageHeader 
      back
      @back="router.back()"
      title="Settings" 
    />

    <div class="outer-container">
      <section class="friend-info-section">
        <div class="friend-profile">
          <img :src="friendImage" :alt="originalName" class="friend-image" />
          <h2 class="friend-name">{{ displayName }}</h2>
          <p class="friend-id">Friends ID : {{ friendId }}</p>
        </div>
      </section>

      <section class="actions-section">
        <ActionButton icon="edit" label="Change Name" @click="showNameDialog = true" />
        <ActionButton icon="delete" label="Delete Friend" @click="showDeleteDialog = true" />
        <ActionButton icon="block" label="Block Friend" @click="showBlockDialog = true" />
        <ActionButton icon="list" label="Blocked Friends" @click="showBlockListDialog = true" />
      </section>

      <SuccessMessage
        v-if="messagesStore.show && messagesStore.message"
        :show="messagesStore.show"
        :message="messagesStore.message"
        :type="messagesStore.type || 'success'"
      />

      <!-- Change Name Dialog -->
      <q-dialog v-model="showNameDialog">
        <q-card class="dialog-card">
          <q-card-section>
            <div class="dialog-title">Change Friend Name</div>
            <q-input
              v-model="newDisplayName"
              outlined
              label="New Name"
              class="dialog-input"
              @keyup.enter="saveName"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" @click="closeNameDialog" />
            <q-btn label="Save" class="dialog-save-btn" @click="saveName" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Confirmation Dialog -->
      <q-dialog v-model="showDeleteDialog">
        <q-card class="dialog-card">
          <q-card-section>
            <div class="dialog-title">Delete Friend</div>
            <p class="dialog-message">Are you sure you want to delete {{ displayName }}?</p>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" @click="showDeleteDialog = false" />
            <q-btn label="Delete" class="dialog-delete-btn" @click="confirmDelete" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Block Confirmation Dialog -->
      <q-dialog v-model="showBlockDialog">
        <q-card class="dialog-card">
          <q-card-section>
            <div class="dialog-title">Block Friend</div>
            <p class="dialog-message">Are you sure you want to block {{ displayName }}?</p>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" @click="showBlockDialog = false" />
            <q-btn label="Block" class="dialog-block-btn" @click="confirmBlock" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Blocked Friends List Dialog -->
      <q-dialog v-model="showBlockListDialog">
        <q-card class="blocked-list-card">
          <q-card-section>
            <div class="dialog-title">Blocked Friends</div>

            <div v-if="blockedFriends.length === 0" class="empty-blocked">
              No blocked friends
            </div>

            <div v-else class="blocked-list">
              <FriendListItem
                v-for="friend in blockedFriends"
                :key="friend.id"
                :image="friend.image"
                :name="friend.displayName"
                :tags="`Friends ID : ${friend.id}`"
                :clickable="false"
              >
                <template #arrow>
                  <q-btn
                    flat
                    round
                    dense
                    icon="undo"
                    class="unblock-btn"
                    @click.stop="unblockFriend(friend.id)"
                  />
                </template>
              </FriendListItem>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Close" color="primary" @click="showBlockListDialog = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>
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

.friend-info-section {
  background: var(--q-secondary);
  border-radius: 14px;
  padding: 2rem 1.5rem;
}

.friend-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.friend-image {
  width: 120px;
  height: 120px;
  border-radius: 15px;
  object-fit: cover;
  margin-bottom: 1rem;
}

.friend-name {
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--q-text);
  margin: 0 0 0.5rem 0;
}

.friend-id {
  font-size: 1rem;
  color: var(--q-text);
  opacity: 0.8;
  margin: 0;
}

.actions-section {
  background: var(--q-secondary);
  border-radius: 14px;
  padding: 1.5rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dialog-card {
  background: var(--q-secondary);
  color: var(--q-text);
  border-radius: 15px;
  min-width: 300px;
}

.dialog-title {
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.dialog-message {
  margin: 0;
  opacity: 0.9;
}

.dialog-input {
  :deep(.q-field__control) {
    background: var(--q-primary);
    border-radius: 8px;
  }

  :deep(.q-field__native) {
    color: var(--q-text);
  }
}

.dialog-save-btn {
  background: var(--q-accent);
  color: var(--q-text);
}

.dialog-delete-btn {
  background: var(--q-primary);
  color: var(--q-text);
}

.dialog-block-btn {
  background: var(--q-primary);
  color: var(--q-text);
}

.blocked-list-card {
  background: var(--q-secondary);
  color: var(--q-text);
  border-radius: 15px;
  min-width: 320px;
}

.blocked-list {
  margin-top: 1rem;
}

.empty-blocked {
  padding: 1.5rem 0;
  text-align: center;
  opacity: 0.8;
}

.unblock-btn {
  background: var(--q-accent);
  color: var(--q-text);
}
</style>
