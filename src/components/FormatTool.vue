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
  } catch (err) { emit('notify', t('toastErrorCopy'), 'error') }
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
  for (const g of converterGroups) map[g] = converters.filter(c => c.group === g)
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
  } catch (err) { emit('notify', t('toastErrorCopy'), 'error') }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Cleaner -->
    <section>
      <button @click="isCleanerExpanded = !isCleanerExpanded" class="flex items-center gap-2 w-full text-left group mb-3">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{{ t('cleanerTitle') }}</h2>
        <span class="text-neutral-300 dark:text-neutral-700 text-[10px] transition-transform duration-200" :class="{'rotate-180': isCleanerExpanded}">▼</span>
      </button>
      <div v-show="isCleanerExpanded">
        <div class="flex flex-wrap gap-1.5 mb-2">
          <button
            v-for="tool in cleaners" :key="tool.id"
            @click="toggleCleaner(tool)" :title="toolLabel(tool.id)"
            :class="[
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all',
              selectedCleaner?.id === tool.id
                ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-800 dark:hover:text-neutral-200'
            ]"
          >
            <span class="text-neutral-400 dark:text-neutral-500 text-sm">{{ tool.icon }}</span>
            {{ toolLabel(tool.id) }}
          </button>
        </div>

        <div v-if="selectedCleaner" class="mt-2 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <div class="flex justify-between items-center mb-2">
            <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{{ t('preview') }}</span>
            <div class="flex gap-1.5">
              <button @click="handleCleanerCopy" class="px-2.5 py-1 text-[11px] rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">{{ t('copy') }}</button>
              <button @click="handleCleanerApply" class="px-2.5 py-1 text-[11px] rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">{{ t('apply') }}</button>
            </div>
          </div>
          <textarea :value="previewCleanerText" readonly
            class="w-full p-3 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-sm font-mono rounded-md outline-none border border-neutral-200 dark:border-neutral-800 resize-none h-24"
          ></textarea>
        </div>
      </div>
    </section>

    <!-- Converter -->
    <section class="flex flex-col flex-1 min-h-0">
      <button @click="isConverterExpanded = !isConverterExpanded" class="flex items-center gap-2 w-full text-left group mb-3 shrink-0">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{{ t('converterTitle') }}</h2>
        <span class="text-neutral-300 dark:text-neutral-700 text-[10px] transition-transform duration-200" :class="{'rotate-180': isConverterExpanded}">▼</span>
      </button>
      <div v-show="isConverterExpanded" class="flex flex-col min-h-0 flex-1">
        <div v-for="group in converterGroups" :key="group" class="mb-3">
          <span class="text-[9px] font-semibold uppercase tracking-widest text-neutral-300 dark:text-neutral-700 mb-1.5 block">{{ t('toolGroups')[group] }}</span>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="conv in groupedConverters[group]" :key="conv.id"
              @click="toggleConverter(conv)" :title="toolLabel(conv.id)"
              :class="[
                'px-2 py-1 rounded-md text-[10px] font-medium border transition-all',
                selectedConverter?.id === conv.id
                  ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-200'
              ]"
            >
              {{ toolLabel(conv.id) }}
            </button>
          </div>
        </div>

        <div v-if="selectedConverter" class="flex-1 flex flex-col gap-2 mt-1 min-h-[120px]">
          <div class="flex justify-between items-center shrink-0">
            <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{{ t('preview') }}</span>
            <div class="flex gap-1.5">
              <button @click="emit('share')" class="px-2.5 py-1 text-[11px] rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" :title="t('shareTitle')">🔗</button>
              <button @click="handleConverterCopy" class="px-2.5 py-1 text-[11px] rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">{{ t('copy') }}</button>
              <button @click="handleConverterApply" class="px-2.5 py-1 text-[11px] rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">{{ t('apply') }}</button>
            </div>
          </div>
          <textarea v-if="!isHtmlPreview" :value="previewConverterText" readonly
            class="flex-1 w-full p-3 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-sm font-mono rounded-md outline-none border border-neutral-200 dark:border-neutral-800 resize-none"
          ></textarea>
          <div v-else
            class="flex-1 w-full p-3 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 rounded-md border border-neutral-200 dark:border-neutral-800 overflow-auto markdown-body"
            v-html="previewConverterText"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>
