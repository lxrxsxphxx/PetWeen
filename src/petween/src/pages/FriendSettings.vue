<template>
  <!-- Freund-Einstellungen Seite -->
  <q-page class="page">
    <!-- Seitenkopf -->
    <PageHeader title="Friend Settings" />
    
    <!-- Friend Profile Section -->
    <div class="settings-section">
      <div class="section-header">
        <q-icon name="account_circle" class="section-icon" />
        <h3 class="section-title">Friend Profile</h3>
      </div>
      
      <div class="section-content">
        <!-- Profilbild und Name -->
        <div class="profile-header">
          <img :src="friendImage" :alt="displayName" class="profile-picture" />
          <div class="profile-info">
            <h2 class="friend-name">{{ displayName }}</h2>
            <p class="friend-id">Friends ID : {{ friendId }}</p>
          </div>
        </div>

        <!-- Change Name Button -->
        <ActionButton
          icon="edit"
          label="Change Name (only visible to you)"
          @click="showChangeNameDialog = true"
        />
      </div>
    </div>

    <!-- Actions Section -->
    <div class="settings-section">
      <div class="section-header">
        <q-icon name="settings" class="section-icon" />
        <h3 class="section-title">Actions</h3>
      </div>
      
      <div class="section-content actions-section-content">
        <ActionButton
          icon="delete"
          label="Delete Friend"
          :is-active="isDeleting"
          @click="handleDelete"
        />
        <ActionButton
          icon="block"
          label="Block Friend"
          :is-active="isBlocking"
          @click="handleBlock"
        />
        <ActionButton
          icon="list"
          label="Block List"
          @click="showBlockListDialog = true"
        />
      </div>
    </div>


    <!-- Nachrichten -->
    <SuccessMessage 
      v-if="messagesStore.show && messagesStore.message"
      :show="messagesStore.show" 
      :message="messagesStore.message || ''" 
      :type="messagesStore.type || 'success'"
    />

    <!-- Block-Liste Dialog -->
    <q-dialog v-model="showBlockListDialog">
      <q-card class="block-list-dialog">
        <q-card-section class="dialog-header">
          <h3 class="dialog-title">Block List</h3>
        </q-card-section>
        <q-card-section class="dialog-content">
          <div v-if="blockedFriends.length === 0" class="empty-block-list">
            <p>No blocked friends</p>
          </div>
          <div v-else class="blocked-friends-list">
            <FriendListItem
              v-for="friend in blockedFriends"
              :key="friend.id"
              :image="friend.image"
              :name="friend.name"
              :tags="`Friends ID : ${friend.id}`"
              :friend-id="undefined"
              class="blocked-list-item"
            >
              <template #arrow>
                <q-btn flat round icon="block" class="unblock-btn" ripple @click.stop="unblockFriend(friend.id)" />
              </template>
            </FriendListItem>
          </div>
        </q-card-section>
        <q-card-actions class="dialog-actions">
          <q-btn flat label="Close" class="close-btn" ripple @click="showBlockListDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteDialog">
      <q-card class="confirm-dialog">
        <q-card-section class="dialog-header">
          <div class="dialog-icon-wrapper">
            <q-icon name="delete" class="dialog-icon" />
          </div>
          <h3 class="dialog-title">Delete Friend</h3>
          <p class="dialog-message">Are you sure you want to delete {{ displayName }}? This action cannot be undone.</p>
        </q-card-section>
        <q-card-actions class="dialog-actions">
          <q-btn flat label="Cancel" class="cancel-btn" ripple @click="showDeleteDialog = false" />
          <q-btn flat label="Delete" class="confirm-btn" ripple @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showBlockDialog">
      <q-card class="confirm-dialog">
        <q-card-section class="dialog-header">
          <div class="dialog-icon-wrapper">
            <q-icon name="block" class="dialog-icon" />
          </div>
          <h3 class="dialog-title">Block Friend</h3>
          <p class="dialog-message">Are you sure you want to block {{ displayName }}? You won't receive messages from this friend.</p>
        </q-card-section>
        <q-card-actions class="dialog-actions">
          <q-btn flat label="Cancel" class="cancel-btn" ripple @click="showBlockDialog = false" />
          <q-btn flat label="Block" class="confirm-btn" ripple @click="confirmBlock" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Change Name Dialog -->
    <q-dialog v-model="showChangeNameDialog">
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <h3 class="dialog-title">Change Name</h3>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="localDisplayName"
            outlined
            :placeholder="originalName"
            class="name-input"
            dark
          />
        </q-card-section>
        <q-card-actions class="dialog-actions">
          <q-btn flat label="Cancel" @click="showChangeNameDialog = false" />
          <q-btn flat label="Save" @click="handleSave" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
  /**
   * FriendSettings Page Component
   * 
   * Verwaltet Einstellungen für einen Freund: Namen ändern, löschen, sperren.
   * Manages settings for a friend: change name, delete, block.
   */
  
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import PageHeader from 'src/components/layout/PageHeader.vue'
  import ActionButton from 'src/components/ui/ActionButton.vue'
  import FriendListItem from 'src/components/ui/FriendListItem.vue'
  import SuccessMessage from 'src/components/ui/SuccessMessage.vue'
  import { useFriendsStore } from 'src/stores/friends-store'
  import { useMessagesStore } from 'src/stores/messages-store'

  const route = useRoute()
  const router = useRouter()
  const friendsStore = useFriendsStore()
  const messagesStore = useMessagesStore()

  const showDeleteDialog = ref(false)
  const showBlockDialog = ref(false)
  const showBlockListDialog = ref(false)
  const showChangeNameDialog = ref(false)
  const isDeleting = ref(false)
  const isBlocking = ref(false)

  const friendId = ref<string>('')
  const originalName = ref<string>('Friend 1')
  const localDisplayName = ref<string>('')

  const blockedFriends = computed(() => 
    friendsStore.allFriends.filter(friend => friendsStore.isFriendBlocked(friend.id))
  )

  const displayName = computed(() => {
    if (localDisplayName.value?.trim()) return localDisplayName.value
    if (friendId.value) return friendsStore.getFriendDisplayName(friendId.value, originalName.value)
    return originalName.value
  })

  const friendImage = computed(() => {
    if (!friendId.value) return '/src/assets/quasar-logo-vertical.svg'
    const friend = friendsStore.allFriends.find(f => f.id === friendId.value)
    return friend?.image || '/src/assets/quasar-logo-vertical.svg'
  })

  onMounted(() => {
    if (route.query.friendId) friendId.value = route.query.friendId as string
    if (route.query.name) {
      originalName.value = route.query.name as string
      if (friendId.value) {
        localDisplayName.value = friendsStore.friendDisplayNames[friendId.value] || ''
      }
    }
  })

  const handleSave = () => {
    if (!friendId.value) return
    friendsStore.setFriendDisplayName(friendId.value, localDisplayName.value)
    messagesStore.showSuccess('Name saved successfully!')
    showChangeNameDialog.value = false
    setTimeout(() => router.back(), 500)
  }

  const handleActionWithDelay = (type: 'delete' | 'block') => {
    const state = type === 'delete' ? isDeleting : isBlocking
    if (state.value) return
    
    state.value = true
    setTimeout(() => {
      state.value = false
      if (type === 'delete') showDeleteDialog.value = true
      else showBlockDialog.value = true
    }, 1000)
  }

  const handleDelete = () => handleActionWithDelay('delete')
  const handleBlock = () => handleActionWithDelay('block')

  /**
   * Bestätigt und führt eine Aktion (Löschen/Sperren) aus.
   * Zeigt eine Erfolgsmeldung an und navigiert zur Freunde-Startseite.
   * @param {'delete' | 'block'} type - Die Art der Aktion: 'delete' oder 'block'.
   * @returns {void}
   */
  const confirmAction = (type: 'delete' | 'block') => {
    if (!friendId.value) return
    
    const config = {
      delete: { text: 'Friend deleted successfully', action: () => friendsStore.deleteFriend(friendId.value), dialog: showDeleteDialog },
      block: { text: 'Friend blocked successfully', action: () => friendsStore.blockFriend(friendId.value), dialog: showBlockDialog }
    }
    
    config[type].dialog.value = false
    config[type].action()
    messagesStore.showSuccess(config[type].text)
    setTimeout(() => router.push('/friends'), 1500)
  }

  const confirmDelete = () => confirmAction('delete')
  const confirmBlock = () => confirmAction('block')

  const unblockFriend = (blockedFriendId: string) => {
    if (!blockedFriendId) return
    friendsStore.unblockFriend(blockedFriendId)
    messagesStore.showSuccess('Friend unblocked successfully')
    if (blockedFriends.value.length === 1) showBlockListDialog.value = false
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

.settings-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.section-icon {
  font-size: 1.5rem;
  color: var(--q-text);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--q-text);
  margin: 0;
}

.section-content {
  background: var(--q-primary);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
}

.profile-picture {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.friend-name {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--q-text);
  margin: 0 0 0.5rem 0;
}

.friend-id {
  font-size: 1rem;
  color: var(--q-text);
  opacity: 0.9;
  margin: 0;
}

.name-input {
  width: 100%;
}

.actions-section-content {
  :deep(.action-btn) {
    background: var(--q-accent) !important;
    color: var(--q-text);
    
    &:hover {
      opacity: 0.9;
    }
  }
}

.unblock-btn {
  color: var(--q-text);
  opacity: 0.8;
  flex-shrink: 0;
  
  &:hover {
    opacity: 1;
    background: var(--q-primary);
  }
}



// Dialog Styles
:deep(.q-dialog__backdrop) {
  background: var(--q-background);
  opacity: 0.9;
}

:deep(.q-dialog) {
  .confirm-dialog,
  .block-list-dialog,
  .dialog-card {
    background: var(--q-primary);
    border-radius: 12px;
    min-height: 300px;
  }

  .dialog-card {
    background: var(--q-primary);
    border-radius: 12px;
    min-width: 300px;
    max-width: 400px;
    width: 90%;
  }

  .confirm-dialog {
    width: 480px;
    min-width: 480px;
    max-width: 480px;
    background: var(--q-primary);
  }

  .block-list-dialog {
    width: calc(480px + 2rem) !important;
    min-width: calc(480px + 2rem) !important;
    max-width: calc(480px + 2rem) !important;
    background: var(--q-primary);
  }

  .dialog-content {
    max-height: 400px;
    overflow-y: auto;
    padding: 1rem 1.5rem;
    background: var(--q-primary);
  }


  .empty-block-list {
    text-align: center;
    padding: 2rem;
    color: var(--q-text);
    opacity: 0.7;
  }

  .blocked-friends-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .blocked-list-item {
    flex: 1;
    
    :deep(.friend-item) {
      padding: 0;
      border-bottom: none;
      cursor: default;
      
      &:active {
        background-color: transparent;
      }
      
      .arrow-icon {
        display: none;
      }
    }
  }


  .dialog-header {
    text-align: center;
    margin-bottom: 1.5rem;
    padding: 1.5rem 1.5rem 0;
  }

  .block-list-dialog .dialog-header {
    text-align: left;
  }

  .dialog-icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    background: var(--q-background);
    
    .dialog-icon {
      font-size: 1.5rem;
      color: var(--q-text);
    }
  }

  .dialog-title {
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--q-text);
    margin: 0 0 1rem;
  }

  .dialog-message {
    font-size: 1rem;
    color: var(--q-text);
    opacity: 0.9;
    margin: 0;
    line-height: 1.5;
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1rem;
  }

  .close-btn {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    text-transform: none;
    font-size: 1rem;
    font-weight: 500;
    background: var(--q-accent);
    color: var(--q-text);
    
    &:hover {
      opacity: 0.9;
    }
  }

  .cancel-btn,
  .confirm-btn {
    flex: 1;
    padding: 0.75rem;
    border-radius: 8px;
    text-transform: none;
    font-size: 1.1rem;
    font-weight: 500;
    
    &:hover {
      opacity: 0.9;
    }
  }

  .cancel-btn {
    background: var(--q-accent);
    color: var(--q-text);
  }

  .confirm-btn {
    background: var(--q-accent);
    color: var(--q-text);
  }
}
</style>
