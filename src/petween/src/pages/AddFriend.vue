<template>
  <!-- Freund hinzufügen Seite -->
  <q-page>
    <!-- Seitenkopf -->
    <PageHeader title="Add Friend" />

    <!-- Sicherheitsnachricht -->
    <p class="safety-message">
      Please share your id only with people you know, trust, and feel safe with. Never send your id to unknown contacts.
    </p>

    <!-- Freund-ID Eingabe-Abschnitt -->
    <q-input
      v-model="friendId"
      outlined
      label="Enter your Friends ID"
      placeholder="e.g 2134567890"
      class="friend-id-input"
    />

    <!-- Anfrage senden Button -->
    <q-btn
      class="send-request-btn"
      :label="isProcessing ? 'Processing...' : 'send Request'"
      :loading="isProcessing"
      :disable="isProcessing"
      full-width
      color="accent"
      size="lg"
      rounded
      no-caps
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
  /**
   * AddFriend Page Component
   * 
   * Ermöglicht das Hinzufügen von Freunden über ID-Eingabe oder QR-Code-Scanning.
   * Enables adding friends via ID input or QR code scanning.
   */
  
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
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
  // Timeout-Referenz für Abbruchlogik
  let requestTimeout: ReturnType<typeof setTimeout> | null = null

  // Verarbeitet Query-Parameter aus der URL beim Laden
  const handleQueryParams = () => {
    if (route.query.showSuccess === 'true') {
      messagesStore.showSuccess('Invitation sent successfully!')
    }
    if (route.query.error) {
      messagesStore.showError(route.query.error as string)
    }
    if (route.query.friendId) {
      friendId.value = route.query.friendId as string
    }
  }

  // Beim Laden der Seite
  onMounted(() => handleQueryParams())

  // Nur friendId-Änderungen überwachen, um mehrfache Nachrichten zu vermeiden
  watch(
    () => route.query.friendId,
    (id) => {
      if (id) friendId.value = id as string
    }
  )

  /**
   * Sendet eine Freund-Anfrage für die eingegebene Freund-ID.
   * Validiert die ID und zeigt entsprechende Erfolgs- oder Fehlermeldung an.
   */
  const sendRequest = () => {
    const id = friendId.value.trim()
    if (!id) return
    
    // Vorherigen Timeout abbrechen, falls vorhanden
    if (requestTimeout) {
      clearTimeout(requestTimeout)
      requestTimeout = null
      isProcessing.value = false
    }
    
    isProcessing.value = true
    messagesStore.clearMessage()
    
    requestTimeout = setTimeout(() => {
      isProcessing.value = false
      const isValid = /^\d+$/.test(id)
      
      if (isValid) {
        friendId.value = ''
        messagesStore.showSuccess('Invitation sent successfully!')
      } else {
        messagesStore.showError('Invalid Friend ID. Please enter numeric ID only.')
      }
      
      requestTimeout = null
    }, 3000)
  }

  // Timeout beim Verlassen der Komponente abbrechen
  onBeforeUnmount(() => {
    if (requestTimeout) {
      clearTimeout(requestTimeout)
      requestTimeout = null
    }
  })

  // Navigiert zur QR-Code-Scan-Seite
  const scanQRCode = () => router.push('/scan-qr-code')
</script>