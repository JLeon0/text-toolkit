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
    <h2 class="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4">{{ t('statsTitle') }}</h2>
    
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">{{ t('chars') }}</p>
        <p class="text-2xl font-mono font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">{{ stats.chars.toLocaleString() }}</p>
      </div>
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">{{ t('words') }}</p>
        <p class="text-2xl font-mono font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">{{ stats.words.toLocaleString() }}</p>
      </div>
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">{{ t('lines') }}</p>
        <p class="text-2xl font-mono font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">{{ stats.lines.toLocaleString() }}</p>
      </div>
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">{{ t('charsNoSpaces') }}</p>
        <p class="text-2xl font-mono font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">{{ stats.charsNoSpaces.toLocaleString() }}</p>
      </div>
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">{{ t('paragraphs') }}</p>
        <p class="text-2xl font-mono font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">{{ stats.paragraphs.toLocaleString() }}</p>
      </div>
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">{{ t('readingTime') }}</p>
        <p class="text-2xl font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">{{ stats.readingTime }}<span class="text-base text-neutral-400"> min</span></p>
      </div>
    </div>

    <div v-if="cloud.length > 0" class="mt-5">
      <h3 class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">{{ t('frequentWords') }}</h3>
      <div class="flex flex-wrap gap-1.5">
        <span v-for="[word, count] in cloud" :key="word"
          :style="{ opacity: 0.35 + (count / maxCount) * 0.65 }"
          class="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-md border border-neutral-200 dark:border-neutral-800 text-sm"
        >
          {{ word }} <span class="text-[10px] text-neutral-400 ml-0.5 font-mono">{{ count }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
