import { defineStore } from 'pinia'

/**
 * Store für zentrale Verwaltung von Success/Error-Zuständen
 * Central store for managing success/error states
 */

type MessageType = 'success' | 'error' | 'warning' | 'info'

export const useMessagesStore = defineStore('messages', {
  state: (): {
    message: string | null
    type: MessageType | null
    show: boolean
  } => ({
    message: null,
    type: null,
    show: false
  }),

  actions: {
    /**
     * Zeigt eine Nachricht an
     * Shows a message
     * 
     * @param message - Der Nachrichtentext / The message text
     * @param type - Der Typ der Nachricht / The message type
     * @param autoHideDuration - Automatisches Ausblenden nach Millisekunden / Auto hide after milliseconds (optional)
     */
    showMessage(message: string, type: MessageType = 'success', autoHideDuration?: number) {
      this.message = message
      this.type = type
      this.show = true

      if (autoHideDuration !== undefined && autoHideDuration > 0) {
        setTimeout(() => {
          this.clearMessage()
        }, autoHideDuration)
      }
    },

    /**
     * Zeigt eine Success-Nachricht an
     * Shows a success message
     */
    showSuccess(message: string, autoHideDuration: number = 3000) {
      this.showMessage(message, 'success', autoHideDuration)
    },

    /**
     * Zeigt eine Error-Nachricht an
     * Shows an error message
     */
    showError(message: string, autoHideDuration: number = 3000) {
      this.showMessage(message, 'error', autoHideDuration)
    },

    /**
     * Zeigt eine Warning-Nachricht an
     * Shows a warning message
     */
    showWarning(message: string, autoHideDuration: number = 3000) {
      this.showMessage(message, 'warning', autoHideDuration)
    },

    /**
     * Zeigt eine Info-Nachricht an
     * Shows an info message
     */
    showInfo(message: string, autoHideDuration: number = 3000) {
      this.showMessage(message, 'info', autoHideDuration)
    },

    /**
     * Löscht die aktuelle Nachricht
     * Clears the current message
     */
    clearMessage() {
      this.show = false
      this.message = null
      this.type = null
    }
  }
})
