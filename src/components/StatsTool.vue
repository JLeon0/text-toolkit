<script setup>
import { computed } from 'vue'
import { useTextTools } from '../composables/useTextTools'
import { useI18n } from '../composables/useI18n'

const { text, stats, getWordCloud } = useTextTools()
const { t } = useI18n()

const cloud = computed(() => getWordCloud(text.value))

const maxCount = computed(() => cloud.value.length > 0 ? cloud.value[0][1] : 1)
</script>

<template>
  <div>
    <h2 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">{{ t('statsTitle') }}</h2>
    
    <div class="grid grid-cols-2 md:grid-cols-3 gap-2.5">
      <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <p class="text-gray-500 text-[10px] uppercase font-semibold tracking-wider mb-1">{{ t('chars') }}</p>
        <p class="text-xl font-mono font-bold text-gray-900 dark:text-white">{{ stats.chars.toLocaleString() }}</p>
      </div>
      <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <p class="text-gray-500 text-[10px] uppercase font-semibold tracking-wider mb-1">{{ t('charsNoSpaces') }}</p>
        <p class="text-xl font-mono font-bold text-gray-900 dark:text-white">{{ stats.charsNoSpaces.toLocaleString() }}</p>
      </div>
      <div class="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
        <p class="text-indigo-500 text-[10px] uppercase font-semibold tracking-wider mb-1">{{ t('words') }}</p>
        <p class="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-300">{{ stats.words.toLocaleString() }}</p>
      </div>
      <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <p class="text-gray-500 text-[10px] uppercase font-semibold tracking-wider mb-1">{{ t('lines') }}</p>
        <p class="text-xl font-mono font-bold text-gray-900 dark:text-white">{{ stats.lines.toLocaleString() }}</p>
      </div>
      <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <p class="text-gray-500 text-[10px] uppercase font-semibold tracking-wider mb-1">{{ t('paragraphs') }}</p>
        <p class="text-xl font-mono font-bold text-gray-900 dark:text-white">{{ stats.paragraphs.toLocaleString() }}</p>
      </div>
      <div class="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
        <p class="text-emerald-500 text-[10px] uppercase font-semibold tracking-wider mb-1">{{ t('readingTime') }}</p>
        <p class="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-300">{{ stats.readingTime }} min</p>
      </div>
    </div>

    <div v-if="cloud.length > 0" class="mt-5">
      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{{ t('frequentWords') }}</h3>
      <div class="flex flex-wrap gap-1.5">
        <span 
          v-for="[word, count] in cloud" 
          :key="word"
          :style="{ opacity: 0.4 + (count / maxCount) * 0.6 }"
          class="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 text-sm leading-tight transition-opacity duration-300"
        >
          {{ word }}
          <span class="text-[10px] text-gray-400 ml-1 font-mono">{{ count }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
