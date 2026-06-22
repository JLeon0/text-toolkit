import { ref, watchEffect } from 'vue'
import { locales } from '../lib/i18n'

const LOCALE_KEY = 'text-toolkit-locale'

const stored = localStorage.getItem(LOCALE_KEY)
const browserLang = navigator.language?.startsWith('en') ? 'en' : 'es'
const locale = ref(stored || browserLang)

watchEffect(() => {
  localStorage.setItem(LOCALE_KEY, locale.value)
})

export function useI18n() {
  const t = (key) => {
    return locales[locale.value]?.[key] || key
  }

  const toolLabel = (id) => {
    return locales[locale.value]?.tools?.[id] || id
  }

  const setLocale = (lang) => {
    locale.value = lang
  }

  return { locale, t, toolLabel, setLocale }
}
