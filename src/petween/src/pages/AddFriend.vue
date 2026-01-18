<template>
  <!-- Freund hinzufügen Seite -->
  <q-page class="page">
    <!-- Seitenkopf -->
    <PageHeader title="Add Friend" />

    <!-- Sicherheitsnachricht -->
    <p class="safety-message">
      Please share your id only with people you know, trust, and feel safe with. Never send your id to unknown contacts.
    </p>

    <!-- Freund-ID Eingabe-Abschnitt -->
    <div class="input-section">
      <label class="input-label">Enter your Friends ID</label>
      <q-input
        v-model="friendId"
        outlined
        placeholder="e.g 2134567890"
        class="friend-id-input"
      />
    </div>

    <!-- Anfrage senden Button -->
    <q-btn
      class="send-request-btn"
      :label="isProcessing ? 'Processing...' : 'send Request'"
      :loading="isProcessing"
      :disable="isProcessing"
      @click="sendRequest"
    />

    <!-- ODER Trennzeichen -->
    <div class="or-separator">
      <span>OR</span>
    </div>

    <!-- QR-Code scannen Button -->
    <q-btn
      flat
      class="scan-qr-btn"
      label="Scan QR Code"
      @click="scanQRCode"
    />

    <!-- Nachrichten -->
    <SuccessMessage 
      v-if="messagesStore.show && messagesStore.message"
      :show="messagesStore.show" 
      :message="messagesStore.message || ''" 
      :type="messagesStore.type || 'success'"
    />
  </q-page>
</template>

<script setup lang="ts">
  // Importe
  import { ref, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import PageHeader from 'src/components/layout/PageHeader.vue'
  import SuccessMessage from 'src/components/ui/SuccessMessage.vue'
  import { useMessagesStore } from 'src/stores/messages-store'

  const route = useRoute()
  const router = useRouter()
  const messagesStore = useMessagesStore()

  // Freund-ID Eingabewert
  const friendId = ref('')
  // Verarbeitungszustand
  const isProcessing = ref(false)

  /**
   * Verarbeitet Query-Parameter aus der URL
   * Processes query parameters from the URL
   * 
   * Lädt friendId, zeigt Success-Message oder Error-Message basierend auf Query-Parametern
   */
  const handleQueryParams = () => {
    if (route.query.friendId) friendId.value = route.query.friendId as string
    if (route.query.showSuccess === 'true') {
      messagesStore.showSuccess('Invitation sent successfully!')
    }
    if (route.query.error) {
      messagesStore.showError(route.query.error as string)
    }
  }

  // Beim Laden der Seite
  onMounted(() => handleQueryParams())

  // Query-Änderungen überwachen
  watch(() => route.query, handleQueryParams, { deep: true })

  /**
   * Sendet eine Freund-Anfrage für die eingegebene Freund-ID
   * Sends a friend request for the entered friend ID
   * 
   * Validiert die ID (muss numerisch sein) und zeigt entsprechende Nachricht
   * Validates the ID (must be numeric) and shows appropriate message
   */
  const sendRequest = () => {
    const id = friendId.value.trim()
    if (!id) return
    
    isProcessing.value = true
    messagesStore.clearMessage()
    
    setTimeout(() => {
      isProcessing.value = false
      const isValid = /^\d+$/.test(id)
      
      if (isValid) {
        friendId.value = ''
        messagesStore.showSuccess('Invitation sent successfully!')
      } else {
        messagesStore.showError('Invalid Friend ID. Please enter numeric ID only.')
      }
    }, 3000)
  }

  /**
   * Navigiert zur QR-Code-Scan-Seite
   * Navigates to the QR code scan page
   */
  const scanQRCode = () => router.push('/scan-qr-code')
</script>

<style scoped lang="scss">
/* Seiten-Stile */
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

/* Sicherheitsnachricht */
.safety-message {
  font-size: 1rem;
  color: var(--q-text);
  opacity: 0.8;
  line-height: 1.5;
  margin-bottom: 2rem;
}

/* Eingabe-Bereich */
.input-section {
  margin-bottom: 2rem;
}

.input-label {
  display: block;
  font-size: 1rem;
  color: var(--q-text);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.friend-id-input {
  width: 100%;
}

/* Anfrage senden Button */
.send-request-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  background: var(--q-accent);
  color: var(--q-text);
  border-radius: 8px;
  margin-bottom: 2rem;
  text-transform: none;
}

/* ODER Trennzeichen */
.or-separator {
  text-align: center;
  margin: 2rem 0;
  
  span {
    color: var(--q-text);
    font-size: 1rem;
  }
}

/* QR-Code scannen Button */
.scan-qr-btn {
  width: 100%;
  color: var(--q-text);
  text-transform: none;
  font-size: 1rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
</style>