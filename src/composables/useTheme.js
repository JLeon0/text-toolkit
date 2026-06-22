import { ref, watchEffect } from 'vue'

const THEME_KEY = 'text-toolkit-theme'

const stored = localStorage.getItem(THEME_KEY)
const isDark = ref(stored !== null ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches)

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
})

export function useTheme() {
  const toggle = () => {
    isDark.value = !isDark.value
  }

  return { isDark, toggle }
}
