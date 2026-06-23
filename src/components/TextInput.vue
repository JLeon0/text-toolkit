<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useTextTools } from '../composables/useTextTools'
import { useI18n } from '../composables/useI18n'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const { text, stats, canUndo, canRedo, undo, redo } = useTextTools()
const { t } = useI18n()

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}

const clear = () => {
  text.value = ''
}

const onKeydown = (e) => {
  if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
    e.preventDefault()
    undo()
  }
  if (e.ctrlKey && e.key === 'z' && e.shiftKey) {
    e.preventDefault()
    redo()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="relative flex flex-col h-full w-full glass-input rounded-2xl overflow-hidden shadow-xl shadow-black/5 dark:shadow-black/20">
    <textarea
      :value="modelValue"
      @input="handleInput"
      :placeholder="t('placeholder')"
      class="flex-1 w-full p-5 bg-transparent text-gray-800 dark:text-gray-100 outline-none resize-none font-mono text-sm leading-relaxed placeholder-gray-400/60 dark:placeholder-gray-500/60"
    ></textarea>
    <div class="flex items-center justify-between px-3 py-1.5 border-t border-black/5 dark:border-white/5">
      <div class="flex items-center gap-1">
        <button @click="undo" :disabled="!canUndo" :class="canUndo ? 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white' : 'text-gray-300 dark:text-gray-700'" class="text-xs px-1.5 py-0.5 rounded transition-colors" title="Ctrl+Z">↩</button>
        <button @click="redo" :disabled="!canRedo" :class="canRedo ? 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white' : 'text-gray-300 dark:text-gray-700'" class="text-xs px-1.5 py-0.5 rounded transition-colors" title="Ctrl+Shift+Z">↪</button>
        <button @click="clear" class="text-xs px-1.5 py-0.5 text-gray-400 dark:text-gray-500 hover:text-red-500 rounded transition-colors" title="Limpiar">✕</button>
      </div>
      <div class="flex gap-3 text-[11px] text-gray-400 dark:text-gray-500 font-medium">
        <span>{{ stats.chars.toLocaleString() }} {{ t('chars').toLowerCase() }}</span>
        <span class="text-gray-300 dark:text-gray-600">·</span>
        <span>{{ stats.words.toLocaleString() }} {{ t('words').toLowerCase() }}</span>
        <span class="text-gray-300 dark:text-gray-600">·</span>
        <span>{{ stats.lines.toLocaleString() }} {{ t('lines').toLowerCase() }}</span>
      </div>
    </div>
  </div>
</template>
