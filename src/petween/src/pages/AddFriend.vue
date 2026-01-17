<template>
  <!-- Freund hinzufügen Seite -->
  <q-page class="page">
    <!-- Zurück-Button -->
    <BackButton />
    
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

    <!-- Erfolgsnachricht -->
    <p v-if="showSuccess" class="success-message">
      Invitation sent successfully!
    </p>

    <!-- Fehlernachricht -->
    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>
  </q-page>
</template>

<script setup lang="ts">
  // Importe
  import { ref, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import PageHeader from 'src/components/layout/PageHeader.vue'
  import BackButton from 'src/components/ui/BackButton.vue'

  const route = useRoute()
  const router = useRouter()

  // Friend ID input value
  const friendId = ref('')
  // Success message visibility
  const showSuccess = ref(false)
  // Error message
  const errorMessage = ref('')
  // Processing state
  const isProcessing = ref(false)

  // Query-Parameter verarbeiten
  const handleQueryParams = () => {
    if (route.query.friendId) friendId.value = route.query.friendId as string
    if (route.query.showSuccess === 'true') {
      showSuccess.value = true
      setTimeout(() => { showSuccess.value = false }, 3000)
    }
    if (route.query.error) {
      errorMessage.value = route.query.error as string
      setTimeout(() => { errorMessage.value = '' }, 3000)
    }
  }

  // Beim Laden der Seite
  onMounted(() => handleQueryParams())

  // Query-Änderungen überwachen
  watch(() => route.query, handleQueryParams, { deep: true })

  // Freund-Anfrage senden
  const sendRequest = () => {
    const id = friendId.value.trim()
    if (!id) return
    
    isProcessing.value = true
    showSuccess.value = false
    errorMessage.value = ''
    
    setTimeout(() => {
      isProcessing.value = false
      const isValid = /^\d+$/.test(id)
      
      if (isValid) {
        showSuccess.value = true
        setTimeout(() => { friendId.value = ''; showSuccess.value = false }, 3000)
      } else {
        errorMessage.value = 'Invalid Friend ID. Please enter numeric ID only.'
        setTimeout(() => { errorMessage.value = '' }, 3000)
      }
    }, 3000)
  }

  // QR Code scannen
  const scanQRCode = () => router.push('/scan-qr-code')
</script>

<style scoped lang="scss">
/* Page styles */
.page {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 1rem;
  padding-top: 0;
  padding-bottom: 5rem;
  background: var(--q-text);
  min-height: 100vh;
}

/* Safety message */
.safety-message {
  font-size: 1rem;
  color: var(--q-text);
  opacity: 0.8;
  line-height: 1.5;
  margin-bottom: 2rem;
}

/* Input Section */
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

/* Send Request Button */
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

/* OR Separator */
.or-separator {
  text-align: center;
  margin: 2rem 0;
  
  span {
    color: var(--q-text);
    font-size: 1rem;
  }
}

/* Scan QR Code Button */
.scan-qr-btn {
  width: 100%;
  color: var(--q-text);
  text-transform: none;
  font-size: 1rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

/* Success Message */
.success-message {
  text-align: center;
  color: var(--q-text);
  font-size: 0.95rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--q-primary);
  border-radius: 8px;
}

/* Error Message */
.error-message {
  text-align: center;
  color: #ffffff;
  font-size: 0.95rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f44336;
  border-radius: 8px;
}
</style>