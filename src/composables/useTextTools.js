import { ref, computed, watch } from 'vue'
import * as textUtils from '../lib/textUtils'

const STORAGE_KEY = 'text-toolkit-text'
const MAX_HISTORY = 50

const saved = localStorage.getItem(STORAGE_KEY)
const text = ref(saved || '')

const history = ref([])
const historyIndex = ref(-1)

watch(text, (v) => {
  localStorage.setItem(STORAGE_KEY, v)
})

export function useTextTools() {
  const pushHistory = () => {
    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push(text.value)
    if (history.value.length > MAX_HISTORY) history.value.shift()
    else historyIndex.value++
  }

  const undo = () => {
    if (historyIndex.value < 0) return
    text.value = history.value[historyIndex.value]
    historyIndex.value--
  }

  const redo = () => {
    if (historyIndex.value >= history.value.length - 1) return
    historyIndex.value++
    text.value = history.value[historyIndex.value]
  }

  const applyMutation = (fn) => {
    if (!text.value) return
    pushHistory()
    text.value = fn(text.value)
  }

  return {
    text,
    stats: computed(() => textUtils.getStats(text.value)),
    canUndo: computed(() => historyIndex.value >= 0),
    canRedo: computed(() => historyIndex.value < history.value.length - 1),
    pushHistory,
    undo,
    redo,
    applyMutation,
    ...textUtils
  }
}
