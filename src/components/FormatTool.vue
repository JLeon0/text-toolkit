<script setup>
import { ref, computed } from 'vue'
import { useTextTools } from '../composables/useTextTools'
import { useI18n } from '../composables/useI18n'
import { cleaners, converters, converterGroups } from '../lib/tools'

const emit = defineEmits(['notify', 'share'])
const { text, applyMutation } = useTextTools()
const { t, toolLabel } = useI18n()

const isCleanerExpanded = ref(true)
const isConverterExpanded = ref(true)

const selectedCleaner = ref(null)

const toggleCleaner = (tool) => {
  if (!text.value) { emit('notify', t('toastEmptyText'), 'error'); return }
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
  if (!text.value) { emit('notify', t('toastEmptyText'), 'error'); return }
  selectedConverter.value = selectedConverter.value?.id === conv.id ? null : conv
}

const previewConverterText = computed(() => {
  if (!selectedConverter.value || !text.value) return text.value || ''
  return selectedConverter.value.fn(text.value)
})

const isHtmlPreview = computed(() => selectedConverter.value?.isHtml === true)

const groupedConverters = computed(() => {
  const map = {}
  for (const g of converterGroups) {
    map[g] = converters.filter(c => c.group === g)
  }
  return map
})

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
    <!-- Cleaner -->
    <div>
      <button @click="isCleanerExpanded = !isCleanerExpanded" class="flex items-center justify-between w-full text-left group">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-400 transition-colors">{{ t('cleanerTitle') }}</h2>
        <span class="text-gray-500 group-hover:text-indigo-400 transition-transform duration-200 text-xs" :class="{'rotate-180': isCleanerExpanded}">▼</span>
      </button>
      <div v-show="isCleanerExpanded" class="mt-3 flex flex-col gap-2">
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="tool in cleaners"
            :key="tool.id"
            @click="toggleCleaner(tool)"
            :title="toolLabel(tool.id)"
            :class="[
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all text-xs',
              selectedCleaner?.id === tool.id
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
            ]"
          >
            <span class="text-sm">{{ tool.icon }}</span>
            <span>{{ toolLabel(tool.id) }}</span>
          </button>
        </div>

        <div v-if="selectedCleaner" class="flex flex-col gap-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-800 mt-1">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{{ t('preview') }} — {{ toolLabel(selectedCleaner.id) }}</span>
            <div class="flex gap-1.5">
              <button @click="handleCleanerCopy" class="px-2.5 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-[11px] text-gray-600 dark:text-gray-300 transition-colors">{{ t('copy') }}</button>
              <button @click="handleCleanerApply" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-md text-[11px] text-white transition-colors">{{ t('apply') }}</button>
            </div>
          </div>
          <textarea
            :value="previewCleanerText"
            readonly
            class="w-full p-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm font-mono rounded-lg outline-none border border-gray-200 dark:border-gray-700 resize-none h-24"
          ></textarea>
        </div>
      </div>
    </div>

    <hr class="border-gray-200 dark:border-gray-800" />

    <!-- Converter -->
    <div class="flex flex-col flex-1 min-h-0">
      <button @click="isConverterExpanded = !isConverterExpanded" class="flex items-center justify-between w-full text-left group shrink-0">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-400 transition-colors">{{ t('converterTitle') }}</h2>
        <span class="text-gray-500 group-hover:text-indigo-400 transition-transform duration-200 text-xs" :class="{'rotate-180': isConverterExpanded}">▼</span>
      </button>
      <div v-show="isConverterExpanded" class="mt-3 flex flex-col min-h-0 flex-1">
        <div v-for="group in converterGroups" :key="group" class="mb-2">
          <span class="text-[9px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest mb-1 block">{{ t('toolGroups')[group] }}</span>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="conv in groupedConverters[group]"
              :key="conv.id"
              @click="toggleConverter(conv)"
              :title="toolLabel(conv.id)"
              :class="[
                'px-2 py-1 rounded-md text-[10px] transition-all border',
                selectedConverter?.id === conv.id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
              ]"
            >
              {{ toolLabel(conv.id) }}
            </button>
          </div>
        </div>

        <div v-if="selectedConverter" class="flex-1 flex flex-col gap-2 mt-3 min-h-[120px]">
          <div class="flex justify-between items-center shrink-0">
            <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{{ t('preview') }} — {{ toolLabel(selectedConverter.id) }}</span>
            <div class="flex gap-1.5">
              <button @click="emit('share')" class="px-2.5 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-[11px] text-gray-600 dark:text-gray-300 transition-colors" :title="t('shareTitle')">🔗</button>
              <button @click="handleConverterCopy" class="px-2.5 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-[11px] text-gray-600 dark:text-gray-300 transition-colors">{{ t('copy') }}</button>
              <button @click="handleConverterApply" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-md text-[11px] text-white transition-colors">{{ t('apply') }}</button>
            </div>
          </div>
          <textarea
            v-if="!isHtmlPreview"
            :value="previewConverterText"
            readonly
            class="flex-1 w-full p-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm font-mono rounded-lg outline-none border border-gray-200 dark:border-gray-700 resize-none"
          ></textarea>
          <div
            v-else
            class="flex-1 w-full p-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 overflow-auto markdown-body"
            v-html="previewConverterText"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
