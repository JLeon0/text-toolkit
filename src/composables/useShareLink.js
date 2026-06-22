import { useTextTools } from './useTextTools'
import { toBase64, fromBase64 } from '../lib/textUtils'

export function useShareLink() {
  const { text } = useTextTools()

  const loadFromUrl = () => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) {
      try {
        text.value = fromBase64(q)
      } catch (e) { /* ignore */ }
    }
    const tab = params.get('tab')
    if (tab === 'stats') return 'stats'
    return 'format'
  }

  const buildUrl = () => {
    if (!text.value) return window.location.origin + window.location.pathname
    const encoded = toBase64(text.value)
    return window.location.origin + window.location.pathname + '?q=' + encoded
  }

  const copyShareUrl = async () => {
    const url = buildUrl()
    try {
      await navigator.clipboard.writeText(url)
      return true
    } catch (e) {
      return false
    }
  }

  return { loadFromUrl, buildUrl, copyShareUrl }
}
