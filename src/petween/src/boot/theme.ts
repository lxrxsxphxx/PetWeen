import { boot } from 'quasar/wrappers'
import { Dark } from 'quasar'
import { watch } from 'vue'
import { useThemeStore } from 'src/stores/theme-store'

/** Initialize theme based on store state 
 * Applies theme colors to document and watches for changes to update them dynamically.
*/

export default boot(() => {
    const store = useThemeStore()

    const applyTheme = () => {
        /**
         * currentTheme from store
         * mode: 'light' | 'dark'
         * background: string
         * text: string
         * primary: string
         * secondary: string
         * accent: string
         */
        const theme = store.currentTheme
        Dark.set(theme.mode === 'dark')

        // Body Hintergrund + Text
        document.body.style.backgroundColor = theme.background
        document.body.style.color = theme.text
        document.documentElement.style.setProperty('--q-primary', theme.primary)
        document.documentElement.style.setProperty('--q-secondary', theme.secondary)
        document.documentElement.style.setProperty('--q-accent', theme.accent)
        document.documentElement.style.setProperty('--q-background', theme.background)
}

applyTheme()

    watch(
        // Watch for changes in the currentTheme and reapply theme
        () => store.currentTheme,
        () => applyTheme(),
        { deep: true }
    )
})