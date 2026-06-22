<script setup>
import { computed } from 'vue'
import { useTextTools } from '../composables/useTextTools'
import { useI18n } from '../composables/useI18n'

const { text, stats, getWordCloud } = useTextTools()
const { t } = useI18n()

const cloud = computed(() => getWordCloud(text.value))
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-base font-medium text-gray-900 dark:text-white">{{ t('statsTitle') }}</h2>
    
    <div class="space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-400 dark:border-gray-600">
          <p class="text-gray-600 dark:text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">{{ t('chars') }}</p>
          <p class="text-lg font-mono font-semibold">{{ stats.chars }}</p>
        </div>
        <div class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-400 dark:border-gray-600">
          <p class="text-gray-600 dark:text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">{{ t('charsNoSpaces') }}</p>
          <p class="text-lg font-mono font-semibold">{{ stats.charsNoSpaces }}</p>
        </div>
        <div class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-400 dark:border-gray-600">
          <p class="text-gray-600 dark:text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">{{ t('words') }}</p>
          <p class="text-lg font-mono font-semibold">{{ stats.words }}</p>
        </div>
        <div class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-400 dark:border-gray-600">
          <p class="text-gray-600 dark:text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">{{ t('lines') }}</p>
          <p class="text-lg font-mono font-semibold">{{ stats.lines }}</p>
        </div>
        <div class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-400 dark:border-gray-600">
          <p class="text-gray-600 dark:text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">{{ t('paragraphs') }}</p>
          <p class="text-lg font-mono font-semibold">{{ stats.paragraphs }}</p>
        </div>
        <div class="p-3 bg-blue-900/30 rounded-lg border border-blue-800">
          <p class="text-gray-600 dark:text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">{{ t('readingTime') }}</p>
          <p class="text-lg font-mono font-semibold">{{ stats.readingTime }} min</p>
        </div>
      </div>

      <div v-if="cloud.length > 0" class="space-y-2">
        <h3 class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">{{ t('frequentWords') }}</h3>
        <div class="flex flex-wrap gap-1.5">
          <span 
            v-for="[word, count] in cloud" 
            :key="word"
            :style="{ fontSize: `${Math.max(0.7, Math.min(1.1, count / 5 + 0.6))}rem` }"
            class="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-300 rounded-md border border-gray-400 dark:border-gray-600 leading-tight"
          >
            {{ word }} <span class="text-gray-500 text-[10px]">({{ count }})</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
