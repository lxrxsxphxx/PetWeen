<template>
  <!-- Freund-Einstellungen Seite -->
  <q-page class="page">
    <!-- Seitenkopf -->
    <PageHeader title="Friend Settings" />
    
    <!-- Freund-Profil-Karte -->
    <div class="friend-profile-card">
      <!-- Profilbild und Name -->
      <div class="profile-header">
        <img :src="friendImage" :alt="displayName" class="profile-picture" />
        <div class="profile-info">
          <h2 class="friend-name">{{ displayName }}</h2>
          <p class="friend-id">Friends ID : {{ friendId }}</p>
        </div>
      </div>

      <!-- Namen ändern Abschnitt -->
      <div class="change-name-section">
        <p class="change-name-label">Change Name (only visible to you)</p>
        <q-input
          v-model="localDisplayName"
          outlined
          :placeholder="originalName"
          class="name-input"
          dark
        />
      </div>
    </div>

    <!-- Aktions-Buttons Container (separate Karte) -->
    <div class="action-buttons-card">
      <ActionButton
        icon="delete"
        label="Delete Friend"
        button-class="delete-btn"
        :is-active="isDeleting"
        @click="handleDelete"
      />
      <ActionButton
        icon="block"
        label="Block Friend"
        button-class="block-btn"
        :is-active="isBlocking"
        @click="handleBlock"
      />
      <ActionButton
        icon="list"
        label="Block List"
        button-class="block-list-btn"
        @click="showBlockListDialog = true"
      />
    </div>

    <!-- Speichern-Button -->
    <q-btn
      class="save-btn"
      label="save"
      ripple
      @click="handleSave"
    />

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
                <q-btn
                  flat
                  round
                  icon="block"
                  class="unblock-btn"
                  ripple
                  @click.stop="unblockFriend(friend.id)"
                />
              </template>
            </FriendListItem>
          </div>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <q-btn
            flat
            label="Close"
            class="close-btn"
            ripple
            @click="showBlockListDialog = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Löschen-Bestätigungs-Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card class="confirm-dialog">
        <q-card-section class="dialog-header">
          <div class="dialog-icon-wrapper delete">
            <q-icon name="delete" class="dialog-icon" />
          </div>
          <h3 class="dialog-title">Delete Friend</h3>
          <p class="dialog-message">
            Are you sure you want to delete {{ displayName }}? This action cannot be undone.
          </p>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <q-btn
            flat
            label="Cancel"
            class="cancel-btn"
            ripple
            @click="showDeleteDialog = false"
          />
          <q-btn
            flat
            label="Delete"
            class="confirm-btn delete-confirm"
            ripple
            @click="confirmDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Blockieren-Bestätigungs-Dialog -->
    <q-dialog v-model="showBlockDialog">
      <q-card class="confirm-dialog">
        <q-card-section class="dialog-header">
          <div class="dialog-icon-wrapper block">
            <q-icon name="block" class="dialog-icon" />
          </div>
          <h3 class="dialog-title">Block Friend</h3>
          <p class="dialog-message">
            Are you sure you want to block {{ displayName }}? You won't receive messages from this friend.
          </p>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <q-btn
            flat
            label="Cancel"
            class="cancel-btn"
            ripple
            @click="showBlockDialog = false"
          />
          <q-btn
            flat
            label="Block"
            class="confirm-btn block-confirm"
            ripple
            @click="confirmBlock"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
  // Importe
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

  // Dialog-Zustände
  const showDeleteDialog = ref(false)
  const showBlockDialog = ref(false)
  const showBlockListDialog = ref(false)
  const isDeleting = ref(false)
  const isBlocking = ref(false)

  // Freund-Daten
  const friendId = ref<string>('')
  const originalName = ref<string>('Friend 1')
  const localDisplayName = ref<string>('')

  // Blockierte Freunde
  const blockedFriends = computed(() => {
    return friendsStore.allFriends.filter(friend => friendsStore.isFriendBlocked(friend.id))
  })

  // Anzeigename
  const displayName = computed(() => {
    if (localDisplayName.value?.trim()) return localDisplayName.value
    if (friendId.value) return friendsStore.getFriendDisplayName(friendId.value, originalName.value)
    return originalName.value
  })

  // Freund-Bild
  const friendImage = computed(() => {
    if (!friendId.value) return '/src/assets/quasar-logo-vertical.svg'
    const friend = friendsStore.allFriends.find(f => f.id === friendId.value)
    return friend?.image || '/src/assets/quasar-logo-vertical.svg'
  })

  // Daten laden
  onMounted(() => {
    if (route.query.friendId) friendId.value = route.query.friendId as string
    if (route.query.name) {
      originalName.value = route.query.name as string
      if (friendId.value) {
        localDisplayName.value = friendsStore.friendDisplayNames[friendId.value] || ''
      }
    }
  })

  /**
   * Speichert den geänderten Anzeigenamen des Freundes
   * Saves the changed display name of the friend
   */
  const handleSave = () => {
    if (!friendId.value) return
    friendsStore.setFriendDisplayName(friendId.value, localDisplayName.value)
    messagesStore.showSuccess('Name saved successfully!')
    setTimeout(() => router.back(), 500)
  }

  /**
   * Handhabt Aktionen (Löschen/Sperren) mit Verzögerung
   * Handles actions (delete/block) with delay
   * 
   * @param type - Art der Aktion: 'delete' oder 'block'
   */
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

  /**
   * Startet den Löschvorgang mit Verzögerung
   * Starts the delete process with delay
   */
  const handleDelete = () => handleActionWithDelay('delete')

  /**
   * Startet den Sperrvorgang mit Verzögerung
   * Starts the block process with delay
   */
  const handleBlock = () => handleActionWithDelay('block')

  /**
   * Bestätigt und führt eine Aktion (Löschen/Sperren) aus
   * Confirms and executes an action (delete/block)
   * 
   * @param type - Art der Aktion: 'delete' oder 'block'
   */
  const confirmAction = (type: 'delete' | 'block') => {
    if (!friendId.value) return
    
    const config = {
      delete: { text: 'Friend deleted successfully', action: () => friendsStore.deleteFriend(friendId.value), dialog: showDeleteDialog },
      block: { text: 'Friend blocked successfully', action: () => friendsStore.blockFriend(friendId.value), dialog: showBlockDialog }
    }
    
    config[type].dialog.value = false
    config[type].action()
   // messagesStore.showError(config[type].text)
    //router.push('/friends')
    messagesStore.showSuccess(config[type].text)
    setTimeout(() => router.push('/friends'), 1500)
  }

  /**
   * Bestätigt das Löschen eines Freundes
   * Confirms deletion of a friend
   */
  const confirmDelete = () => confirmAction('delete')

  /**
   * Bestätigt das Sperren eines Freundes
   * Confirms blocking of a friend
   */
  const confirmBlock = () => confirmAction('block')

  /**
   * Entsperrt einen blockierten Freund
   * Unblocks a blocked friend
   * 
   * @param blockedFriendId - ID des zu entsperrenden Freundes
   */
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
  padding: 0 1rem;
  padding-top: 1.5rem;
  padding-bottom: 5rem;
  background: var(--q-background);
  min-height: 100vh;
}

.friend-profile-card {
  background: var(--q-secondary);
  border-radius: 15px;
  padding: 1.25rem 1.25rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
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
  font-size: 2.2rem;
  font-weight: 500;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
}

.friend-id {
  font-size: 1.3rem;
  color: #ffffff;
  opacity: 0.9;
  margin: 0;
}

.change-name-section {
  margin-bottom: 1rem;
}

.change-name-label {
  font-size: 1.3rem;
  color: #ffffff;
  margin-bottom: 0.75rem;
}

.name-input {
  width: 100%;
  
  :deep(.q-field__control) {
    background: var(--q-text);
    border-radius: 8px;
    color: var(--q-primary);
  }
  
  :deep(.q-field__native) {
    color: var(--q-primary);
    padding: 0.75rem;
    font-size: 1.1rem;
  }
  
  :deep(.q-field__label) {
    color: rgba(0, 0, 0, 0.5);
    font-size: 1.1rem;
  }
  
  :deep(.q-field__outline) {
    border-color: rgba(255, 255, 255, 0.3);
  }
}

.action-buttons-card {
  background: var(--q-secondary);
  border-radius: 15px;
  padding: 0.6rem;
  margin-top: 0rem;
  margin-bottom: 0rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.save-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: 500;
  background: var(--q-secondary);
  color: #ffffff;
  border-radius: 8px;
  text-transform: none;
  margin-top: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.unblock-btn {
  color: #ffffff;
  opacity: 0.8;
  flex-shrink: 0;
  
  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
}



// Dialog Styles
:deep(.q-dialog) {
  .confirm-dialog {
    background: var(--q-accent);
    border-radius: 15px;
    width: 480px !important;
    min-width: 480px !important;
    max-width: 480px !important;
    min-height: 300px;
  }

  .block-list-dialog {
    background: var(--q-accent);
    border-radius: 15px;
    width: calc(480px + 2rem) !important;
    min-width: calc(480px + 2rem) !important;
    max-width: calc(480px + 2rem) !important;
    min-height: 300px;
  }

  .dialog-content {
    max-height: 400px;
    overflow-y: auto;
    padding: 1rem 1.5rem;
  }

  .empty-block-list {
    text-align: center;
    padding: 2rem;
    color: #ffffff;
    opacity: 0.7;
  }

  .blocked-friends-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .blocked-friend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
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


  .close-btn {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    text-transform: none;
    font-size: 1rem;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }

  .dialog-header {
    text-align: center;
    padding: 2rem 3rem 3rem;
  }

  .block-list-dialog .dialog-header {
    text-align: left;
    padding-left: 3.5rem;
  }

  .dialog-icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    background: rgba(255, 2, 2, 0.72);
    
    &.delete {
      background: rgba(244, 67, 54, 0.85);
    }
    
    &.block {
      background: rgba(255, 152, 0, 0.2);
    }
  }

  .dialog-icon {
    font-size: 2rem;
    color: var(--q-text);
  }

  .dialog-title {
    font-size: 1.7rem;
    font-weight: 400;
    color: var(--q-text);
    margin: 0 0 1rem 0;
  }

  .dialog-message {
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--q-text);
    opacity: 0.9;
    margin: 0;
    line-height: 1.5;
  }

  .dialog-actions {
    padding: 1rem 1.5rem;
    justify-content: space-between;
    gap: 1rem;
  }

  .cancel-btn,
  .confirm-btn {
    flex: 1;
    padding: 0.75rem;
    border-radius: 8px;
    text-transform: none;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .cancel-btn {
    background: rgba(255, 255, 255, 0.1);
    color: var(--q-text);
  }

  .confirm-btn {
    background: rgba(255, 255, 255, 0.2);
    color: var(--q-text);
    
    &.delete-confirm {
      background: rgba(244, 67, 54, 0.3);
    }
    
    &.block-confirm {
      background: rgba(255, 152, 0, 0.3);
    }
  }
}
</style>
