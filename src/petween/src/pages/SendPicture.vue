<template>
<q-page class="page">
    <PageHeader title="Send Picture" />

    <!-- Grid der Empfänger-Karten -->
    <div class="recipients-grid">
    <div
        v-for="friend in friends"
        :key="friend.id"
        class="recipient-card-wrapper"
        :class="{ 
        selected: selectedRecipients.includes(friend.id),
        disabled: friend.id.startsWith('dummy-')
        }"
        @click="toggleRecipient(friend.id)"
    >
        <InfoCard
        :image="friend.image"
        title="Name of Pet"
        :info1="friend.name"
        info2=""
        />
    </div>
    </div>

    <!-- Senden-Button -->
    <div class="send-section">
    <q-btn
        class="send-btn"
        label="send"
        :disable="selectedRecipients.length === 0"
        @click="handleSend"
    />
    </div>

    <!-- Erfolgs-/Fehlermeldungen -->
    <div class="message-wrapper">
    <SuccessMessage 
        v-if="messagesStore.show && messagesStore.message"
        :show="messagesStore.show" 
        :message="messagesStore.message || ''" 
        :type="messagesStore.type || 'success'"
    />
    </div>
</q-page>
</template>

<script setup lang="ts">
/**
   * SendPicture Page Component
   * 
   * Ermöglicht das Senden von Bildern an ausgewählte Freunde.
   * Enables sending pictures to selected friends.
   */
  
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from 'src/components/layout/PageHeader.vue'
import SuccessMessage from 'src/components/ui/SuccessMessage.vue'
import InfoCard from 'src/components/ui/InfoCard.vue'
import { useMessagesStore } from 'src/stores/messages-store'
import { useFriendsStore } from 'src/stores/friends-store'

const route = useRoute()
const router = useRouter()
const friendsStore = useFriendsStore()
const messagesStore = useMessagesStore()

// Ausgewählte Empfänger
const selectedRecipients = ref<string[]>([])

/**
 * Liste der verfügbaren Freunde zum Senden (ohne gelöschte oder blockierte).
 * Fügt Dummy-Karten hinzu, bis die Gesamtzahl 6 Karten erreicht.
 * @returns {Array} Array von Freunden mit Dummy-Karten bis zu 6 Karten
 */
const friends = computed(() => {
  const availableFriends = friendsStore.allFriends.filter(friend =>
    !friendsStore.isFriendDeleted(friend.id) && !friendsStore.isFriendBlocked(friend.id)
  )
  
  // Dummy-Karten hinzufügen, bis 6 Karten erreicht sind
  const totalCards = 6
  const dummyCount = totalCards - availableFriends.length
  
  if (dummyCount > 0) {
    const dummyFriends = Array.from({ length: dummyCount }, (_, i) => ({
      id: `dummy-${i}`,
      name: `Friend ${availableFriends.length + i + 1}`,
      image: 'https://via.placeholder.com/160x80?text=Pet',
      isDummy: true
    }))
    return [...availableFriends, ...dummyFriends].slice(0, totalCards)
  }
  
  return availableFriends.slice(0, totalCards)
})

// Prüft beim Laden der Seite, ob ein Bild vorhanden ist
onMounted(() => {
  if (!route.query.image) {
    // Wenn kein Bild vorhanden ist, zur vorherigen Seite zurückkehren
    router.back()
  }
})

  /**
   * Wechselt die Auswahl eines Empfängers (hinzufügen/entfernen).
   * Verhindert die Auswahl von Dummy-Karten.
   * @param {string} friendId - Die ID des Freundes
   * @returns {void}
   */
  const toggleRecipient = (friendId: string) => {
    // Auswahl von Dummy-Karten verhindern
    if (friendId.startsWith('dummy-')) return
    
    const index = selectedRecipients.value.indexOf(friendId)
    if (index > -1) {
      selectedRecipients.value.splice(index, 1)
    } else {
      selectedRecipients.value.push(friendId)
    }
  }

  /**
   * Sendet das Bild an die ausgewählten Empfänger.
   * Zeigt eine Erfolgsmeldung und navigiert nach 2 Sekunden zur Startseite.
   * @returns {void}
   */
  const handleSend = () => {
    if (selectedRecipients.value.length === 0) return

    // TODO: Hier sollte das Bild über API an die Empfänger gesendet werden
    messagesStore.showSuccess(`Picture sent to ${selectedRecipients.value.length} recipient(s)!`)
    
    // Nach 2 Sekunden zur Startseite zurückkehren
    setTimeout(() => {
      router.push('/')
    }, 2000)
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
  overflow-y: auto;
}

.recipients-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem 0;
  margin-top: 1rem;
  margin-bottom: 0.01rem;
  justify-items: center;
  align-items: start;
}

.recipient-card-wrapper {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 3px solid transparent;
  border-radius: 15px;
  overflow: hidden;
  width: 100%;
  max-width: 160px;

  &:hover {
    opacity: 0.9;
  }

  &.selected {
    border-color: var(--q-accent);
    
    :deep(.info-card) {
      background: var(--q-secondary);
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      opacity: 0.5;
    }
  }
}

.send-section {
  width: 100%;
  padding: 1rem 0;
  margin-top: 0;
  margin-bottom: 2rem;
}

.send-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  background: var(--q-primary) !important;
  color: var(--q-text);
  border-radius: 8px;
  text-transform: none;
  opacity: 1 !important;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.message-wrapper {
  margin-bottom: 2rem;
}

</style>
