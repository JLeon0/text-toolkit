<script setup>
import { ref, computed } from 'vue'
import { useTextTools } from '../composables/useTextTools'
import { useI18n } from '../composables/useI18n'
import { cleaners, converters } from '../lib/tools'

const emit = defineEmits(['notify', 'share'])
const { text, applyMutation } = useTextTools()
const { t, toolLabel } = useI18n()

const isCleanerExpanded = ref(true)
const isConverterExpanded = ref(true)

const selectedCleaner = ref(null)

const toggleCleaner = (tool) => {
  selectedCleaner.value = selectedCleaner.value?.id === tool.id ? null : tool
}

const previewCleanerText = computed(() => {
  if (!selectedCleaner.value || !text.value) return text.value || ''
  return selectedCleaner.value.fn(text.value)
})

const handleCleanerApply = () => {
  if (!selectedCleaner.value) return
  applyMutation(selectedCleaner.value.fn)
  emit('notify', toolLabel(selectedCleaner.value.id), 'success')
  selectedCleaner.value = null
}

const handleCleanerCopy = async () => {
  try {
    await navigator.clipboard.writeText(previewCleanerText.value)
    emit('notify', toolLabel(selectedCleaner.value.id) + t('toastCopied'), 'success')
  } catch (err) {
    emit('notify', t('toastErrorCopy'), 'error')
  }
}

const selectedConverter = ref(null)

const toggleConverter = (conv) => {
  selectedConverter.value = selectedConverter.value?.id === conv.id ? null : conv
}

const previewConverterText = computed(() => {
  if (!selectedConverter.value || !text.value) return text.value || ''
  return selectedConverter.value.fn(text.value)
})

const isHtmlPreview = computed(() => selectedConverter.value?.isHtml === true)

const handleConverterApply = () => {
  if (!selectedConverter.value) return
  applyMutation(selectedConverter.value.fn)
  emit('notify', toolLabel(selectedConverter.value.id) + t('toastApplied'), 'success')
  selectedConverter.value = null
}

const handleConverterCopy = async () => {
  try {
    await navigator.clipboard.writeText(previewConverterText.value)
    emit('notify', toolLabel(selectedConverter.value.id) + t('toastCopied'), 'success')
  } catch (err) {
    emit('notify', t('toastErrorCopy'), 'error')
  }
}
</script>

<template>
  <div class="flex flex-col gap-5 h-full">
    <div>
      <button @click="isCleanerExpanded = !isCleanerExpanded" class="flex items-center justify-between w-full text-left mb-2 group">
        <h2 class="text-base font-medium text-white group-hover:text-indigo-400 transition-colors">{{ t('cleanerTitle') }}</h2>
        <span class="text-gray-500 group-hover:text-indigo-400 transition-transform duration-200 text-xs" :class="{'rotate-180': isCleanerExpanded}">▼</span>
      </button>
      <div v-show="isCleanerExpanded" class="flex flex-col gap-2">
        <div class="flex flex-wrap gap-1.5 mb-2">
          <button
            v-for="tool in cleaners"
            :key="tool.id"
            @click="toggleCleaner(tool)"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-all text-xs',
              selectedCleaner?.id === tool.id
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border-gray-700 hover:border-gray-600'
            ]"
          >
            <span class="opacity-75 text-sm">{{ tool.icon }}</span>
            <span>{{ toolLabel(tool.id) }}</span>
          </button>
        </div>

        <div v-if="selectedCleaner" class="flex flex-col gap-2 animate-in fade-in duration-200 min-h-[100px]">
          <div class="flex justify-between items-center shrink-0">
            <span class="text-xs font-bold text-indigo-400 uppercase">{{ t('preview') }}</span>
            <div class="flex gap-2">
              <button @click="handleCleanerCopy" class="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300">{{ t('copy') }}</button>
              <button @click="handleCleanerApply" class="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-xs text-white">{{ t('apply') }}</button>
            </div>
          </div>
          <textarea
            :value="previewCleanerText"
            readonly
            class="w-full p-4 bg-gray-900 text-gray-200 text-sm font-mono rounded-lg outline-none border border-gray-700 resize-none h-24"
          ></textarea>
        </div>
      </div>
    </div>

    <hr class="border-gray-800" />

    <div class="flex flex-col flex-1">
      <button @click="isConverterExpanded = !isConverterExpanded" class="flex items-center justify-between w-full text-left mb-2 group">
        <h2 class="text-base font-medium text-white group-hover:text-indigo-400 transition-colors">{{ t('converterTitle') }}</h2>
        <span class="text-gray-500 group-hover:text-indigo-400 transition-transform duration-200 text-xs" :class="{'rotate-180': isConverterExpanded}">▼</span>
      </button>
      <div v-show="isConverterExpanded" class="flex flex-col flex-1">
        <div class="flex flex-wrap gap-1.5 mb-2">
          <button
            v-for="conv in converters"
            :key="conv.id"
            @click="toggleConverter(conv)"
            :class="[
              'px-2.5 py-1.5 rounded-md text-[11px] transition-all border',
              selectedConverter?.id === conv.id
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ toolLabel(conv.id) }}
          </button>
        </div>

        <div v-if="selectedConverter" class="flex-1 flex flex-col gap-2 animate-in fade-in duration-200 mt-4 min-h-[150px]">
          <div class="flex justify-between items-center shrink-0">
            <span class="text-xs font-bold text-indigo-400 uppercase">{{ t('preview') }}</span>
            <div class="flex gap-2">
              <button @click="emit('share')" class="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300" :title="t('shareTitle')">🔗</button>
              <button @click="handleConverterCopy" class="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300">{{ t('copy') }}</button>
              <button @click="handleConverterApply" class="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-xs text-white">{{ t('apply') }}</button>
            </div>
          </div>
          <textarea
            v-if="!isHtmlPreview"
            :value="previewConverterText"
            readonly
            class="flex-1 w-full p-4 bg-gray-900 text-gray-200 text-sm font-mono rounded-lg outline-none border border-gray-700 resize-none"
          ></textarea>
          <div
            v-else
            class="flex-1 w-full p-4 bg-gray-900 text-gray-200 rounded-lg border border-gray-700 overflow-auto markdown-body"
            v-html="previewConverterText"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
