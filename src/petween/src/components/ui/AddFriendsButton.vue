<template>
    <!-- AddFriendsButton Komponente -->
    <button class="add-friends-btn" @click="goToAddFriend">
        <!-- Hinzufügen-Symbol (+) -->
        <q-icon name="add" class="add-icon" />
        <!-- Button-Text -->
        <span>add new friends</span>
    </button>
</template>

<script setup lang="ts">
/**
 * AddFriendsButton Komponente
 * Zeigt einen Button zum Hinzufügen neuer Freunde an
 * Navigiert zur AddFriend-Seite beim Klick
 */

import { useRouter } from 'vue-router'

const router = useRouter()

// Zur AddFriend-Seite navigieren
const goToAddFriend = () => {
  router.push('/add-friend')
}
</script>

<style scoped lang="scss">
/* Stile für Freunde hinzufügen Button - gleicher Stil wie Bild hinzufügen Button */
.add-friends-btn {
    position: fixed;
    left: 1rem;
    right: 1rem;
    bottom: 9rem;   // Abstand zwischen Button und Element darüber

    font-size: 1.2rem;  // Button-Größe mit größerer Schrift und Padding erhöhen
    padding: 1rem;
    min-height: 60px;  // Rechteckhöhe erhöhen

    color: var(--q-text);
    background: var(--q-primary);
    border-radius: 30px;
}

/* Hinzufügen-Symbol Stile */
.add-icon {
    font-size: 1.3rem;  // Symbol-Größe mit größerer Schrift erhöhen
    color: var(--q-text);
}
</style>
