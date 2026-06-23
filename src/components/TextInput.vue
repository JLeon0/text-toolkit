<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useTextTools } from '../composables/useTextTools'
import { useI18n } from '../composables/useI18n'

const props = defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])

const { text, stats, canUndo, canRedo, undo, redo } = useTextTools()
const { t } = useI18n()

const handleInput = (e) => { emit('update:modelValue', e.target.value) }
const clear = () => { text.value = '' }

const onKeydown = (e) => {
  if (e.ctrlKey && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
  if (e.ctrlKey && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo() }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="flex flex-col h-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
    <textarea
      :value="modelValue"
      @input="handleInput"
      :placeholder="t('placeholder')"
      class="flex-1 w-full p-5 bg-transparent text-neutral-800 dark:text-neutral-200 outline-none resize-none font-mono text-sm leading-relaxed placeholder-neutral-300 dark:placeholder-neutral-700"
      autofocus
    ></textarea>
    <div class="flex items-center justify-between px-4 h-9 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 dark:text-neutral-600 shrink-0">
      <div class="flex items-center gap-1">
        <button @click="undo" :disabled="!canUndo" :class="canUndo ? 'hover:text-neutral-700 dark:hover:text-neutral-300' : 'opacity-30'" class="px-1 transition-colors" title="Ctrl+Z">↩</button>
        <button @click="redo" :disabled="!canRedo" :class="canRedo ? 'hover:text-neutral-700 dark:hover:text-neutral-300' : 'opacity-30'" class="px-1 transition-colors" title="Ctrl+Shift+Z">↪</button>
        <button @click="clear" class="px-1 hover:text-red-500 transition-colors" title="Limpiar">✕</button>
      </div>
      <div class="flex gap-2">
        <span>{{ stats.chars.toLocaleString() }} {{ t('chars').toLowerCase() }}</span>
        <span class="text-neutral-200 dark:text-neutral-800">·</span>
        <span>{{ stats.words.toLocaleString() }} {{ t('words').toLowerCase() }}</span>
      </div>
    </div>
  </div>
</template>
