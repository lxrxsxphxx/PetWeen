<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PageHeader from 'src/components/layout/PageHeader.vue'
import SuccessMessage from 'src/components/ui/SuccessMessage.vue'

import { useMessagesStore } from 'src/stores/messages-store'

const router = useRouter()
const route = useRoute()
const messagesStore = useMessagesStore()

const friendId = ref<string>('')
const isProcessing = ref(false)

onMounted(() => {
  const prefill = typeof route.query.friendId === 'string' ? route.query.friendId : ''
  const error = typeof route.query.error === 'string' ? route.query.error : ''
  const showSuccess = route.query.showSuccess === 'true'

  if (prefill) friendId.value = prefill
  if (error) messagesStore.showError(error)
  if (showSuccess && prefill) messagesStore.showSuccess(`Friend ID ${prefill} scanned successfully!`)
})

function goToScanQRCode() {
  router.push('/scan-qr-code')
}

function sendRequest() {
  const trimmed = friendId.value.trim()

  if (!/^\d+$/.test(trimmed)) {
    messagesStore.showError('Invalid Friend ID. Please enter numbers only.')
    return
  }

  isProcessing.value = true

  window.setTimeout(() => {
    messagesStore.showSuccess(`Friend request sent to ID ${trimmed}!`)
    friendId.value = ''
    isProcessing.value = false
  }, 900)
}
</script>

<template>
  <q-page class="page">
    <PageHeader 
      back
      @back="router.back()"
      title="Add Friend" 
    />

    <div class="outer-container">
      <section class="add-friend-section">
        <div class="input-wrapper">
          <q-input
            v-model="friendId"
            outlined
            placeholder="Enter Friend ID"
            class="friend-id-input"
            :disable="isProcessing"
          />
        </div>

        <div class="buttons">
          <q-btn
            class="send-btn"
            label="Send Request"
            :loading="isProcessing"
            :disable="!friendId.trim() || isProcessing"
            @click="sendRequest"
          />

          <q-btn
            flat
            class="scan-btn"
            label="Scan QR Code"
            @click="goToScanQRCode"
          />
        </div>
      </section>
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

.add-friend-section {
  background: var(--q-secondary);
  border-radius: 14px;
  padding: 2rem 1.5rem;
  margin: 0;
}

.input-wrapper {
  margin-bottom: 2rem;
}

.friend-id-input {
  :deep(.q-field__control) {
    background: var(--q-primary);
    border-radius: 8px;
  }

  :deep(.q-field__native) {
    color: var(--q-text);
    font-size: 1.1rem;
  }

  :deep(.q-field__control:before) {
    border-color: rgba(255, 255, 255, 0.2);
  }

  :deep(.q-field--outlined .q-field__control:after) {
    border-color: var(--q-accent);
  }
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.send-btn {
  background: var(--q-accent);
  color: var(--q-text);
  border-radius: 8px;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  text-transform: none;
}

.scan-btn {
  background: var(--q-primary);
  color: var(--q-text);
  border-radius: 8px;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  text-transform: none;
}
</style>
