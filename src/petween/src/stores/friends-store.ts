import { defineStore } from 'pinia'
import { allFriendsData, type FriendData } from './friends-data'

/**
 * Friends store (frontend-only).
 *
 * Keeps local UI state like renamed friends, accepted/declined requests,
 * and simple blocked/deleted lists.
 */
export const useFriendsStore = defineStore('friends', {
  state: () => ({
    friendDisplayNames: {} as Record<string, string>,

    deletedFriends: [] as string[],
    blockedFriends: [] as string[],

    // Prototype defaults: some accepted friends + some pending requests.
    acceptedRequests: ['2134567890', '658396383947', '9988776655', '4433221100', '2134568877', '9988716655', '1988716655', '3344556677', '7788990011'] as string[],
    declinedRequests: [] as string[],
  }),

  getters: {
    allFriends: (): FriendData[] => allFriendsData,

    getFriendDisplayName: (state) => (friendId: string, fallback: string): string => {
      return state.friendDisplayNames[friendId] || fallback
    },
  },

  actions: {
    setFriendDisplayName(friendId: string, displayName: string) {
      const name = displayName.trim()
      if (name) this.friendDisplayNames[friendId] = name
      else delete this.friendDisplayNames[friendId]
    },

    deleteFriend(friendId: string) {
      if (!this.deletedFriends.includes(friendId)) this.deletedFriends.push(friendId)
      this.blockedFriends = this.blockedFriends.filter((id) => id !== friendId)
      delete this.friendDisplayNames[friendId]
    },

    blockFriend(friendId: string) {
      if (!this.blockedFriends.includes(friendId)) this.blockedFriends.push(friendId)
      this.deletedFriends = this.deletedFriends.filter((id) => id !== friendId)
    },

    unblockFriend(friendId: string) {
      this.blockedFriends = this.blockedFriends.filter((id) => id !== friendId)
    },

    isFriendDeleted(friendId: string) {
      return this.deletedFriends.includes(friendId)
    },

    isFriendBlocked(friendId: string) {
      return this.blockedFriends.includes(friendId)
    },

    acceptFriendRequest(friendId: string) {
      if (!this.acceptedRequests.includes(friendId)) this.acceptedRequests.push(friendId)
      this.declinedRequests = this.declinedRequests.filter((id) => id !== friendId)
    },

    declineFriendRequest(friendId: string) {
      if (!this.declinedRequests.includes(friendId)) this.declinedRequests.push(friendId)
      this.acceptedRequests = this.acceptedRequests.filter((id) => id !== friendId)
    },
  },
})
