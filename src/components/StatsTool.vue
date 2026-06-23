<script setup>
import { computed } from 'vue'
import { useTextTools } from '../composables/useTextTools'
import { useI18n } from '../composables/useI18n'

const { text, stats, getWordCloud } = useTextTools()
const { t } = useI18n()

const cloud = computed(() => getWordCloud(text.value))
const maxCount = computed(() => cloud.value.length > 0 ? cloud.value[0][1] : 1)

const platforms = [
  { name: 'Twitter / X', limit: 280 },
  { name: 'Instagram', limit: 2200 },
  { name: 'TikTok', limit: 2200 },
  { name: 'SMS', limit: 160 },
  { name: 'Meta Title', limit: 60 },
  { name: 'Meta Description', limit: 160 },
]
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

    <div v-if="stats.chars > 0" class="mt-4 space-y-1.5">
      <h3 class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">{{ t('platformLimits') }}</h3>
      <div v-for="p in platforms" :key="p.name" class="flex items-center gap-2">
        <span class="text-[11px] text-neutral-500 dark:text-neutral-400 w-24 shrink-0">{{ p.name }}</span>
        <div class="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            :class="stats.chars > p.limit ? 'bg-red-500' : stats.chars > p.limit * 0.8 ? 'bg-amber-500' : 'bg-emerald-500'"
            class="h-full rounded-full transition-all duration-300"
            :style="{ width: `${Math.min(100, (stats.chars / p.limit) * 100)}%` }"
          ></div>
        </div>
        <span class="text-[10px] font-mono tabular-nums w-10 text-right" :class="stats.chars > p.limit ? 'text-red-500' : 'text-neutral-400'">{{ stats.chars }}/{{ p.limit }}</span>
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
