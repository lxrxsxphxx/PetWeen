import { defineStore } from 'pinia'
import type { Theme } from 'src/themes/colors'
import { allThemes, whimsicalSky } from 'src/themes/colors'

/**
 * Store to manage the application's theme.
 * Includes state, getters, and actions for theme management.
 *
 * State:
 * - currentTheme: The currently active theme.
 *
 * Getters:
 * - isDark: Returns true if the current theme is dark mode.
 *
 * Actions:
 * - setTheme(theme): Sets the current theme.
 * - toggleMode(): Toggles between light and dark modes using paired themes.
 * - cycleThemes(): Cycles through all available themes.
 */

export const useThemeStore = defineStore('theme', {
    // State
    state: (): { currentTheme: Theme } => ({
        currentTheme: whimsicalSky
    }),

    // Getters 
    getters: {
        /**
         * 
         * @param state 
         * @returns 
         */
        isDark: (state): boolean => state.currentTheme.mode === 'dark'
    },

    // Actions
    actions: {
        /**
         * Sets the current theme.
         * @param theme 
         * 
         */
        setTheme(theme: Theme) {
            this.currentTheme = theme
        },

        toggleMode() {
            /**
             * Toggles between light and dark modes using paired themes.
             * @param theme
             */
            const paired = this.currentTheme.pairedTheme
            if (paired) {
                this.currentTheme = paired
            }
        },

        cycleThemes() {
            /**
             * Cycles through all available themes.
             */
            const index = allThemes.indexOf(this.currentTheme)
            if (index === -1) return
        
            const next = allThemes[(index + 1) % allThemes.length]
            if (!next) return // Safety check should not be triggered
        
            this.currentTheme = next
        }

    }
})
