<template>
  <q-page class="page">
    <PageHeader title="Settings" />

    <!-- Account Section -->
    <div class="settings-section">
      <div class="section-header">
        <q-icon name="account_circle" class="section-icon" />
        <h3 class="section-title">Account</h3>
      </div>
      
      <div class="section-content account-section-content">
        <div class="friend-id-row">
          <span class="friend-id-text">Friends ID : {{ FRIEND_ID }}</span>
          <q-btn
            flat
            dense
            class="copy-btn"
            label="Copy"
            @click="copyFriendId"
          />
        </div>
        
        <ActionButton
          icon="edit"
          label="Change Name"
          @click="showChangeNameDialog = true"
        />
        
        <ActionButton
          icon="photo_camera"
          label="Change Profile Picture"
          @click="profilePictureInput?.click()"
        />
      </div>
    </div>

    <!-- App Settings Section -->
    <div class="settings-section">
      <div class="section-header">
        <q-icon name="dark_mode" class="section-icon" />
        <h3 class="section-title">App Settings</h3>
      </div>
      
      <div class="section-content">
        <div class="theme-selector">
          <!-- Toggle Dark / Light Mode -->
          <ActionButton
            :icon="themeModeIcon"
            :label="themeModeLabel"
            @click="themeStore.toggleMode()"
          />

          <!-- Select Theme Button with Arrow -->
          <div class="theme-select-btn" @click="toggleThemesList">
            <q-icon name="palette" class="btn-icon" />
            <span>select theme</span>
            <q-icon 
              :name="showThemes ? 'expand_less' : 'expand_more'" 
              class="chevron-icon" 
            />
          </div>

          <!-- Theme Picker (Collapsible) -->
          <div v-show="showThemes" class="themes-list">
            <ActionButton
              v-for="t in allThemes"
              :key="t.name"
              :icon="themeStore.currentTheme.name === t.name ? 'check_circle' : 'circle'"
              :label="t.name"
              :is-active="themeStore.currentTheme.name === t.name"
              @click="themeStore.setTheme(t)"
            />
          </div>

          <!-- Info -->
          <p class="theme-info">
            Aktives Theme: {{ themeStore.currentTheme.name }}<br />
            Mode: {{ themeStore.currentTheme.mode }}
          </p>
        </div>
      </div>
    </div>

    <!-- Privacy Section -->
    <div class="settings-section">
      <div class="section-header">
        <q-icon name="shield" class="section-icon" />
        <h3 class="section-title">Privacy</h3>
      </div>
      
      <div class="section-content">
        <ActionButton
          icon="person_add_disabled"
          label="Block new friend request"
          @click="handleBlockNewRequests"
        />
      </div>
    </div>

    <!-- Delete Data Section -->
    <div class="settings-section">
      <ActionButton
        icon="warning"
        label="Delete Data"
        button-class="delete-data-btn"
        @click="handleDeleteData"
      />
    </div>

    <!-- Change Name Dialog -->
    <q-dialog v-model="showChangeNameDialog">
      <q-card class="dialog-card">
    <q-card-section class="dialog-header">
      <h3 class="dialog-title">Change Name</h3>
    </q-card-section>

    <q-card-section>
      <q-input
        v-model="userName"
        outlined
        placeholder="Enter your name"
        class="name-input"
        dark
      />
    </q-card-section>

        <q-card-actions class="dialog-actions">
          <q-btn flat label="Cancel" @click="showChangeNameDialog = false" />
          <q-btn flat label="Save" @click="saveName" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Change Profile Picture - Hidden Input -->
    <input
      ref="profilePictureInput"
      type="file"
      accept="image/*"
      class="file-input"
      @change="handleProfilePictureChange"
    />

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
 * Settings Page Component
 * 
 * Verwaltet App-Einstellungen, Account-Einstellungen und Datenschutzoptionen.
 * Manages app settings, account settings, and privacy options.
 */

import { ref, computed } from 'vue'
import PageHeader from 'src/components/layout/PageHeader.vue'
import ActionButton from 'src/components/ui/ActionButton.vue'
import SuccessMessage from 'src/components/ui/SuccessMessage.vue'
import { useMessagesStore } from 'src/stores/messages-store'
import { useThemeStore } from 'src/stores/theme-store'
import { allThemes } from 'src/themes/colors'
import { useCamera } from 'src/composables/useCamera'

const messagesStore = useMessagesStore()
const themeStore = useThemeStore()
const { readImageFile } = useCamera()

const userName = ref('User')
const showChangeNameDialog = ref(false)
const profilePictureInput = ref<HTMLInputElement | null>(null)
const showThemes = ref(false)
const FRIEND_ID = '658396383947'

// Computed properties for theme
const isDarkMode = computed(() => themeStore.currentTheme.mode === 'dark')
const themeModeIcon = computed(() => isDarkMode.value ? 'light_mode' : 'dark_mode')
const themeModeLabel = computed(() => `Toggle ${isDarkMode.value ? 'Light' : 'Dark'} Mode`)

// Toggle themes list visibility
const toggleThemesList = () => {
  showThemes.value = !showThemes.value
}

const copyFriendId = async () => {
  try {
    await navigator.clipboard.writeText(FRIEND_ID)
    messagesStore.showSuccess('Friend ID copied to clipboard!')
  } catch {
    messagesStore.showError('Failed to copy Friend ID')
  }
}

const saveName = () => {
  if (!userName.value.trim()) {
    messagesStore.showError('Please enter a valid name')
    return
  }
  // TODO: Save name to backend/store
  messagesStore.showSuccess('Name changed successfully!')
  showChangeNameDialog.value = false
}

const handleProfilePictureChange = async (event: Event) => {
  const imageUrl = await readImageFile(event)
  if (!imageUrl) {
    messagesStore.showError('Please select an image file')
    return
  }
  messagesStore.showSuccess('Profile picture changed successfully!')
  profilePictureInput.value && (profilePictureInput.value.value = '')
}

const handleBlockNewRequests = () => {
  messagesStore.showInfo('Block new friend request feature coming soon')
}

const handleDeleteData = () => {
  messagesStore.showWarning('Delete Data feature coming soon')
}
</script>

<style scoped lang="scss">
.page {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 0.5rem 1rem calc(2rem + 5.5rem);
  background: var(--q-background);
  min-height: 100vh;
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

.account-section-content {
  :deep(.action-btn) {
    background: var(--q-accent) !important;
    color: var(--q-text);
    
    &:hover {
      opacity: 0.9;
    }
  }
}

.friend-id-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--q-primary);
  border-radius: 8px;
  color: var(--q-text);
  font-size: 1rem;
}

.copy-btn {
  background: var(--q-accent);
  color: var(--q-text);
  border-radius: 6px;
  padding: 0.25rem 0.75rem;
  font-size: 0.9rem;
  text-transform: none;
  min-height: auto;
}

.delete-data-btn {
  background: var(--q-accent);
  border-radius: 12px;
}

.file-input {
  display: none;
}

.dialog-card {
  background: var(--q-primary);
  border-radius: 12px;
  min-width: 300px;
  max-width: 400px;
  width: 90%;
}

.dialog-header {
  text-align: center;
  margin-bottom: 1rem;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--q-text);
  margin: 0;
}


.name-input {
  width: 100%;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
}

.theme-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.theme-select-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  color: var(--q-text);
  font-size: 1.3rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .btn-icon {
    font-size: 1.5rem;
    color: var(--q-text);
  }
  
  .chevron-icon {
    margin-left: auto;
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }
}

.themes-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.theme-info {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.75;
  color: var(--q-text);
  text-align: center;
}

</style>
