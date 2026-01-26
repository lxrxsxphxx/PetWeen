import { defineStore } from 'pinia'

export type MessageType = 'success' | 'error' | 'warning' | 'info'

let currentToken = 0

/**
 * Simple global message store for small success/error banners.
 */
export const useMessagesStore = defineStore('messages', {
  state: () => ({
    message: null as string | null,
    type: null as MessageType | null,
    show: false,
  }),

  actions: {
    showMessage(message: string, type: MessageType = 'success', autoHideMs: number = 3000) {
      const token = ++currentToken
      this.message = message
      this.type = type
      this.show = true

      if (autoHideMs > 0) {
        window.setTimeout(() => {
          if (token === currentToken) this.clearMessage()
        }, autoHideMs)
      }
    },

    showSuccess(message: string, autoHideMs: number = 3000) {
      this.showMessage(message, 'success', autoHideMs)
    },

    showError(message: string, autoHideMs: number = 3000) {
      this.showMessage(message, 'error', autoHideMs)
    },

    showWarning(message: string, autoHideMs: number = 3000) {
      this.showMessage(message, 'warning', autoHideMs)
    },

    showInfo(message: string, autoHideMs: number = 3000) {
      this.showMessage(message, 'info', autoHideMs)
    },

    clearMessage() {
      this.show = false
      this.message = null
      this.type = null
    },
  },
})
