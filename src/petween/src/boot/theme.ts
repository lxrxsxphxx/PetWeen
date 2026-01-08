import { boot } from 'quasar/wrappers'
import { Dark } from 'quasar'
import type { Theme } from 'src/themes/colors'
import { allThemes, whimsicalSky } from 'src/themes/colors'

let currentTheme: Theme = whimsicalSky

export const applyTheme = (theme: Theme) => {
    currentTheme = theme


    Dark.set(theme.mode === 'dark')

    // Body Hintergrund + Text
    document.body.style.backgroundColor = theme.background
    document.body.style.color = theme.text
    document.documentElement.style.setProperty('--q-primary', theme.primary)
    document.documentElement.style.setProperty('--q-secondary', theme.secondary)
    document.documentElement.style.setProperty('--q-accent', theme.accent)
}

export const toggleMode = () => {
if (!currentTheme.pairedTheme) return
applyTheme(currentTheme.pairedTheme)
}

export const cycleThemes = () => {
    const index = allThemes.indexOf(currentTheme)
    const next = allThemes[(index + 1) % allThemes.length]!
    applyTheme(next)
}

export default boot(({ app }) => {
    applyTheme(currentTheme)
})

