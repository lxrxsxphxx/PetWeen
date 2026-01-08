import { boot } from 'quasar/wrappers'
import { Dark } from 'quasar'
import { watch } from 'vue'
import { useThemeStore } from 'src/stores/theme-store'

export default boot(() => {
    const store = useThemeStore()

    const applyTheme = () => {
        const theme = store.currentTheme
        Dark.set(theme.mode === 'dark')

        // Body Hintergrund + Text
        document.body.style.backgroundColor = theme.background
        document.body.style.color = theme.text
        document.documentElement.style.setProperty('--q-primary', theme.primary)
        document.documentElement.style.setProperty('--q-secondary', theme.secondary)
        document.documentElement.style.setProperty('--q-accent', theme.accent)
}

applyTheme()

    watch(
        () => store.currentTheme,
        () => applyTheme(),
        { deep: true }
    )
})