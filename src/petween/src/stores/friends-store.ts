import { defineStore } from 'pinia'
import { allFriendsData } from './friends-data'

/**
 * Store für Freunde-Daten und Anzeigenamen
 */

export const useFriendsStore = defineStore('friends', {
  state: (): { 
    friendDisplayNames: Record<string, string>
    deletedFriends: string[]
    blockedFriends: string[]
  } => ({
    friendDisplayNames: {},
    deletedFriends: [],
    blockedFriends: []
  }),

  getters: {
    // Alle Freunde-Daten
    allFriends: () => allFriendsData,

    // Anzeigename abrufen
    getFriendDisplayName: (state) => (friendId: string, originalName: string): string => {
      return state.friendDisplayNames[friendId] || originalName
    }
  },

  actions: {
    // Anzeigename setzen
    setFriendDisplayName(friendId: string, displayName: string) {
      if (displayName?.trim()) {
        this.friendDisplayNames[friendId] = displayName.trim()
      } else {
        delete this.friendDisplayNames[friendId]
      }
    },

    // Anzeigename entfernen
    removeFriendDisplayName(friendId: string) {
      delete this.friendDisplayNames[friendId]
    },

    // Freund löschen
    deleteFriend(friendId: string) {
      if (!this.deletedFriends.includes(friendId)) {
        this.deletedFriends.push(friendId)
      }
      this.blockedFriends = this.blockedFriends.filter(id => id !== friendId)
      delete this.friendDisplayNames[friendId]
    },

    // Freund sperren
    blockFriend(friendId: string) {
      if (!this.blockedFriends.includes(friendId)) {
        this.blockedFriends.push(friendId)
      }
      this.deletedFriends = this.deletedFriends.filter(id => id !== friendId)
    },

    // Prüfen ob gelöscht
    isFriendDeleted(friendId: string): boolean {
      return this.deletedFriends.includes(friendId)
    },

    // Prüfen ob gesperrt
    isFriendBlocked(friendId: string): boolean {
      return this.blockedFriends.includes(friendId)
    },

    // Freund entsperren
    unblockFriend(friendId: string) {
      this.blockedFriends = this.blockedFriends.filter(id => id !== friendId)
    }
  }
})
