import { defineStore } from 'pinia'
import type { Theme } from 'src/themes/colors'
import { allThemes, whimsicalSky } from 'src/themes/colors'

export const useThemeStore = defineStore('theme', {
    state: (): { currentTheme: Theme } => ({
        currentTheme: whimsicalSky
    }),

    getters: {
        isDark: (state): boolean => state.currentTheme.mode === 'dark'
    },

    actions: {
        setTheme(theme: Theme) {
            this.currentTheme = theme
        },

        toggleMode() {
            const paired = this.currentTheme.pairedTheme
            if (paired) {
                this.currentTheme = paired
            }
        },

        cycleThemes() {
            const index = allThemes.indexOf(this.currentTheme)
            if (index === -1) return
        
            const next = allThemes[(index + 1) % allThemes.length]
            if (!next) return
        
            this.currentTheme = next
        }

    }
})
