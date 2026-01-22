<template>
  <!-- Freunde-Startseite -->
  <q-page class="page">
    <PageHeader title="Friend Home" />

    <!-- Äußerer Container -->
    <div class="outer-container">
      <!-- Abschnitts-Header auf äußerem Container -->
      <div class="section-header">
        <h2 class="section-title">Your Friends</h2>
        <button class="new-request-link" @click="goToNewRequest">
          new request
        </button>
      </div>

      <!-- Freunde-Liste Abschnitt -->
      <section class="friends-section">
        <!-- Empty State - wenn keine Freunde -->
        <div v-if="friends.length === 0" class="empty-state">
          <q-icon name="people_outline" class="empty-icon" />
          <p class="empty-title">No friends yet</p>
          <p class="empty-message">Start adding friends to see them here</p>
          <q-btn
            class="empty-action-btn"
            label="Add Friends"
            @click="goToAddFriend"
          />
        </div>

        <!-- Freunde-Liste -->
        <div v-else class="friends-list">
          <FriendListItem
            v-for="friend in friends"
            :key="friend.id"
            :image="friend.image"
            :name="friend.name"
            :tags="friend.tags"
            :friend-id="friend.id"
          />
        </div>
      </section>
    </div>

    <!-- Neue Freunde hinzufügen Button -->
    <button class="add-friends-btn" @click="goToAddFriend">
      <!-- Hinzufügen-Symbol (+) -->
      <q-icon name="add" class="add-icon" />
      <!-- Button-Text -->
      <span>add new friends</span>
    </button>
  </q-page>
</template>

<script setup lang="ts">
  /**
   * FriendsHome Page Component
   * 
   * Zeigt Liste aller Freunde mit Empty-State, wenn keine Freunde vorhanden sind.
   * Displays list of all friends with empty state when no friends exist.
   */
  
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import PageHeader from 'src/components/layout/PageHeader.vue'
  import FriendListItem from 'src/components/ui/FriendListItem.vue'
  import { useFriendsStore } from 'src/stores/friends-store'

  const friendsStore = useFriendsStore()
  const router = useRouter()

  // Navigiert zur AddFriend-Seite
  const goToAddFriend = () => {
    router.push('/add-friend')
  }

  // Navigiert zur NewRequest-Seite
  const goToNewRequest = () => {
    router.push('/new-request')
  }

  /**
   * Gefilterte Freunde-Liste (nur akzeptierte, nicht gelöschte und nicht blockierte Freunde).
   * @returns {ComputedRef<FriendData[]>} Liste der angezeigten Freunde.
   */
  const friends = computed(() => {
    return friendsStore.allFriends.filter(friend => 
      friendsStore.acceptedRequests.includes(friend.id) &&
      !friendsStore.isFriendDeleted(friend.id) && 
      !friendsStore.isFriendBlocked(friend.id)
    )
  })
</script>

<style scoped lang="scss">
/* Seiten-Stile */
.page {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 0.5rem 1rem calc(2rem + 5.5rem);
  
  /* Seiten-Hintergrund vor Container */
  background: var(--q-background);
  min-height: 100vh;  // Angemessene Seitenhöhe
}

/* Äußerer Container - größerer Container um die Liste */
.outer-container {
  background: var(--q-primary);
  border-radius: 15px;
  padding: 1rem;   // Abstand von allen Seiten zwischen hellem und innerem Kasten
  margin-top: 0.5rem;  // Container leicht anheben
  min-height: 500px;  // Höhe erhöhen
}

/* Freunde-Bereich - nur Liste */
.friends-section {
  background: var(--q-secondary);
  border-radius: 14px;
  padding: 0;  // Kein Padding, da Liste vollen Raum einnimmt
  margin: 1rem auto 0;  // Abstand zwischen Kästen und Text darüber
  min-height: 450px;  // Höhe für Liste
  display: flex;  // Karten gleichmäßig verteilen
  flex-direction: column;
}

/* Leerer Zustand */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  min-height: 450px;
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
  margin: 0 0 2rem 0;
}

.empty-action-btn {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  background: var(--q-accent);
  color: var(--q-text);
  border-radius: 25px;
  text-transform: none;
}

/* Abschnitts-Header */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--q-text);
  margin: .2rem;  // Margin-Wert korrigieren
}

.new-request-link {
  background: none;
  border: none;
  color: var(--q-text);
  font-size: 1rem;
  opacity: 0.8;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  
  &:active {
    opacity: 1;
  }
}

.add-friends-btn {
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
}

.add-icon {
  font-size: 1.3rem;  // Symbol-Größe mit größerer Schrift erhöhen
  color: var(--q-text);
}

/* Freunde-Liste */
.friends-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;  // Karten gleichmäßig verteilen
  align-items: center;  // Karten zentrieren
  gap: 0;  // Kein Abstand - weiße Linien trennen Elemente
  margin: 0 auto;  // Horizontal zentrieren
  
  /* Transparenter Hintergrund, da Hintergrund in friends-section existiert */
  background: transparent;
  border-radius: 8px;
  overflow: hidden;  // Innere Ecken verstecken
  padding: 0.5rem 0;  // Vertikales Padding für bessere Verteilung
  width: 100%;  // Volle Breite für inneren Container
  height: 100%;  // Volle Höhe für gleichmäßige Verteilung
  flex: 1;  // Verfügbaren Raum einnehmen
}
</style>
