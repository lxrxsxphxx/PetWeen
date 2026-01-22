import { defineStore } from 'pinia'
import { allFriendsData } from './friends-data'

/**
 * Store für Freunde-Daten und Anzeigenamen
 * 
 * TODO: Langfristig sollten Freunde-Daten in einer Datenbank gespeichert werden
 * und nicht ausschließlich im Store, da der Store öffentlich einsehbar ist.
 * Der Store sollte als Cache fungieren und mit einem Backend-API synchronisiert werden.
 * 
 * TODO: Friends data should be stored in a database long-term and not exclusively
 * in the store, as the store is publicly accessible. The store should act as a cache
 * and be synchronized with a backend API.
 */

export const useFriendsStore = defineStore('friends', {
  state: (): { 
    friendDisplayNames: Record<string, string>
    deletedFriends: string[]
    blockedFriends: string[]
    acceptedRequests: string[]
    declinedRequests: string[]
  } => ({
    friendDisplayNames: {},
    deletedFriends: [],
    blockedFriends: [],
    acceptedRequests: [],
    declinedRequests: []
  }),

  getters: {
    // Gibt alle Freunde-Daten zurück
    allFriends: () => allFriendsData,

    // Ruft den Anzeigenamen für einen Freund ab
    getFriendDisplayName: (state) => (friendId: string, originalName: string): string => {
      return state.friendDisplayNames[friendId] || originalName
    }
  },

  actions: {
    /**
     * Setzt den Anzeigenamen für einen Freund.
     * @param {string} friendId - Die ID des Freundes.
     * @param {string} displayName - Der Anzeigename, der gesetzt werden soll.
     * @returns {void}
     */
    setFriendDisplayName(friendId: string, displayName: string) {
      if (displayName?.trim()) {
        this.friendDisplayNames[friendId] = displayName.trim()
      } else {
        delete this.friendDisplayNames[friendId]
      }
    },

    // Entfernt den Anzeigenamen für einen Freund
    removeFriendDisplayName(friendId: string) {
      delete this.friendDisplayNames[friendId]
    },

    // Löscht einen Freund
    deleteFriend(friendId: string) {
      if (!this.deletedFriends.includes(friendId)) {
        this.deletedFriends.push(friendId)
      }
      this.blockedFriends = this.blockedFriends.filter(id => id !== friendId)
      delete this.friendDisplayNames[friendId]
    },

    // Sperrt einen Freund
    blockFriend(friendId: string) {
      if (!this.blockedFriends.includes(friendId)) {
        this.blockedFriends.push(friendId)
      }
      this.deletedFriends = this.deletedFriends.filter(id => id !== friendId)
    },

    // Prüft, ob ein Freund gelöscht wurde
    isFriendDeleted(friendId: string): boolean {
      return this.deletedFriends.includes(friendId)
    },

    // Prüft, ob ein Freund gesperrt wurde
    isFriendBlocked(friendId: string): boolean {
      return this.blockedFriends.includes(friendId)
    },

    // Entsperrt einen blockierten Freund
    unblockFriend(friendId: string) {
      this.blockedFriends = this.blockedFriends.filter(id => id !== friendId)
    },

    // Akzeptiert eine Freund-Anfrage
    acceptFriendRequest(friendId: string) {
      if (!this.acceptedRequests.includes(friendId)) {
        this.acceptedRequests.push(friendId)
      }
      this.declinedRequests = this.declinedRequests.filter(id => id !== friendId)
    },

    // Lehnt eine Freund-Anfrage ab
    declineFriendRequest(friendId: string) {
      if (!this.declinedRequests.includes(friendId)) {
        this.declinedRequests.push(friendId)
      }
      this.acceptedRequests = this.acceptedRequests.filter(id => id !== friendId)
    }
  }
})
