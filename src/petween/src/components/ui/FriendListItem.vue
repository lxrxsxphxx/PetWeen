<template>
    <!-- FriendListItem Komponente -->
    <div class="friend-item" @click="friendId ? handleClick() : null">
        <!-- Profilbild -->
        <img :src="image" :alt="name" class="profile-picture" />

        <!-- Inhalt -->
        <div class="content">
            <strong class="name">{{ displayName }}</strong>
            <span class="tags">{{ tags }}</span>
        </div>

        <!-- Pfeil-Icon oder Slot für benutzerdefinierte Inhalte -->
        <slot name="arrow">
          <q-icon name="chevron_right" class="arrow-icon" />
        </slot>
    </div>
</template>

<script setup lang="ts">
  /**
   * FriendListItem Komponente - Wiederverwendbare Komponente zur Anzeige von Freund-Informationen.
   * Zeigt Profilbild, Namen und Tags an. Unterstützt benutzerdefinierte Anzeigenamen aus dem Store.
   */
  
  // Imports
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useFriendsStore } from 'src/stores/friends-store'

  const props = defineProps<{
    image: string
    name: string
    tags: string
    friendId?: string
  }>()

  const router = useRouter()
  const friendsStore = useFriendsStore()

  // Anzeigename aus Store abrufen (falls vorhanden)
  const displayName = computed(() => {
    if (props.friendId) return friendsStore.getFriendDisplayName(props.friendId, props.name)
    return props.name
  })

  // Navigation zur Friend-Settings-Seite
  const handleClick = () => {
    if (props.friendId) {
      router.push({
        path: '/friend-settings',
        query: { friendId: props.friendId, name: props.name }
      })
    }
  }
</script>

<style scoped lang="scss">
/* FriendListItem Stile */
.friend-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    padding: 0.75rem 1rem;
    cursor: pointer;
    width: 95%;  // Kartenbreite - kann geändert werden
    margin: 0 auto;  // Karte zentrieren
    flex: 1;  // Jede Karte nimmt gleich viel Platz ein
    position: relative;
    
    /* Dünne Trennlinie zwischen jedem Eintrag */
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--q-text);
        opacity: 0.2;
    }
    
    transition: background-color 0.2s ease;
    
    &:last-child::after {
        display: none;  // Linie vom letzten Element entfernen
    }
    
    &:active {
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--q-text);
            opacity: 0.2;
            pointer-events: none;
        }
    }

     .theme-info {
        margin-top: 1rem;
        font-size: 0.9rem;
        opacity: 0.75;
    }
 
}

/* Profilbild */
.profile-picture {
    width: 50px;
    height: 50px;
    border-radius: 8px;  // Quadratisch mit leicht abgerundeten Ecken
    object-fit: cover;
    flex-shrink: 0;
}

/* Inhalt */
.content {
    flex: 1;                    // Nimmt den gesamten verfügbaren Platz zwischen Bild und Icon ein
    display: flex;              // Macht Name und Tags in einer Spalte
    flex-direction: column;     // Vertikale Anordnung (Name oben, Tags unten)
    gap: 0.3rem;                // Abstand zwischen Name und Tags
    min-width: 0;              // Ermöglicht, dass Text schrumpft, wenn nötig
}
.name {
    font-size: 1rem;           // Schriftgröße
    font-weight: 400;           // Schriftgewicht
    color: var(--q-text);       // Farbe aus Theme
    white-space: nowrap;        // Verhindert, dass Text in neue Zeile umbricht
    overflow: hidden;           // Versteckt überlaufenden Text
    text-overflow: ellipsis;    // Fügt "..." für langen Text hinzu
}
.tags {
    font-size: 0.85rem;        // Etwas kleiner als Name
    opacity: 0.8;               // Leichte Transparenz (heller als Name)
    color: var(--q-text);       // Farbe aus Theme
    white-space: nowrap;        // Verhindert Umbrechen in neue Zeile
    overflow: hidden;           // Versteckt überlaufenden Text
    text-overflow: ellipsis;    // Fügt "..." für langen Text hinzu
}

.arrow-icon {
    font-size: 1.5rem;          // Icon-Größe
    color: var(--q-text);        // Farbe aus Theme
    opacity: 0.7;                // Mittlere Transparenz
    flex-shrink: 0;              // Schrumpft nie (behält seine Größe)
}
</style>
