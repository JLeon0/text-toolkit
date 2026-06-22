<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
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
  <div class="relative flex flex-col h-full w-full bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
    <textarea
      :value="modelValue"
      @input="handleInput"
      :placeholder="t('placeholder')"
      class="flex-1 w-full p-5 bg-transparent text-gray-100 outline-none resize-none font-mono text-sm leading-relaxed placeholder-gray-600"
    ></textarea>
    <div class="flex justify-between items-center px-4 py-2 bg-gray-900/50 border-t border-gray-700/50">
      <div class="flex gap-2 items-center">
        <button @click="undo" :disabled="!canUndo" :class="canUndo ? 'text-gray-400 hover:text-white' : 'text-gray-700'" class="text-xs px-1.5 py-0.5 rounded transition-colors" title="Ctrl+Z">↩</button>
        <button @click="redo" :disabled="!canRedo" :class="canRedo ? 'text-gray-400 hover:text-white' : 'text-gray-700'" class="text-xs px-1.5 py-0.5 rounded transition-colors" title="Ctrl+Shift+Z">↪</button>
      </div>
      <div class="flex gap-4 text-xs text-gray-500 font-medium">
        <span>{{ t('chars') }}: <span class="text-gray-300">{{ stats.chars }}</span></span>
        <span>{{ t('words') }}: <span class="text-gray-300">{{ stats.words }}</span></span>
        <span>{{ t('lines') }}: <span class="text-gray-300">{{ stats.lines }}</span></span>
      </div>
      <div class="text-[10px] text-gray-600">{{ t('brand') }}</div>
    </div>
  </div>
</template>
