<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TextInput from './components/TextInput.vue'
import FormatTool from './components/FormatTool.vue'
import StatsTool from './components/StatsTool.vue'
import Toast from './components/Toast.vue'
import { useTextTools } from './composables/useTextTools'
import { useTheme } from './composables/useTheme'
import { useShareLink } from './composables/useShareLink'
import { useI18n } from './composables/useI18n'

const { text } = useTextTools()
const { isDark, toggle: toggleTheme } = useTheme()
const { loadFromUrl, copyShareUrl } = useShareLink()
const { t, locale, setLocale } = useI18n()

const activeTab = ref('format')
const toast = ref({ show: false, message: '', type: 'success' })

const inputHeight = ref(50)
const isDragging = ref(false)
const isMobile = ref(false)

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

const handleShare = async () => {
  const ok = await copyShareUrl()
  showToast(ok ? t('toastLinkCopied') : t('toastErrorLink'), ok ? 'success' : 'error')
}

const startDrag = (e) => {
  isDragging.value = true
  if (e.type === 'touchstart') e.preventDefault()
}

const onDrag = (e) => {
  if (!isDragging.value) return
  const container = document.getElementById('main-split')
  if (!container) return
  
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const rect = container.getBoundingClientRect()
  const newHeight = ((clientY - rect.top) / rect.height) * 100
  
  if (newHeight > 20 && newHeight < 80) {
    inputHeight.value = newHeight
  }
}

const stopDrag = () => {
  isDragging.value = false
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  activeTab.value = loadFromUrl()
  document.title = t('siteTitle')
  window.addEventListener('resize', checkMobile)
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend', stopDrag)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
})
</script>

<template>
  <div class="flex flex-col h-screen w-full text-gray-800 dark:text-gray-100 font-sans overflow-hidden relative">
    
    <!-- Mobile Header -->
    <header class="md:hidden h-11 items-center px-4 glass border-b border-black/5 dark:border-white/5 shrink-0 z-20 flex">
      <div class="w-6 h-6 gradient-accent rounded-md flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-500/20">T</div>
      <span class="ml-2 font-semibold text-sm text-gray-800 dark:text-white">TextTool</span>
      <div class="ml-auto flex items-center gap-1.5">
        <button @click="setLocale(locale === 'es' ? 'en' : 'es')" class="text-[10px] px-2 py-1 rounded-md bg-white/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-medium hover:bg-white/80 dark:hover:bg-white/10 transition-all">{{ locale === 'es' ? 'EN' : 'ES' }}</button>
        <button @click="handleShare" class="text-xs px-2 py-1 rounded-md bg-white/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-white/10 transition-all">🔗</button>
        <button @click="toggleTheme" class="text-xs px-2 py-1 rounded-md bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all">{{ isDark ? '☀️' : '🌙' }}</button>
      </div>
    </header>

    <!-- Desktop Header -->
    <header class="hidden md:flex h-14 items-center px-6 glass border-b border-black/5 dark:border-white/5 shrink-0 z-20">
      <div class="w-7 h-7 gradient-accent rounded-lg flex items-center justify-center text-white font-bold text-base shadow-lg shadow-indigo-500/20">T</div>
      <span class="ml-2.5 font-semibold text-sm tracking-tight text-gray-800 dark:text-white">TextTool</span>
      <span class="ml-2 text-[10px] text-gray-400 dark:text-gray-500 font-medium bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">v1</span>
      <div class="ml-auto flex items-center gap-2">
        <button @click="setLocale(locale === 'es' ? 'en' : 'es')" class="text-[11px] px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 font-medium transition-all">{{ locale === 'es' ? 'EN' : 'ES' }}</button>
        <button @click="handleShare" :title="t('shareTitle')" class="text-[11px] px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 transition-all">🔗 {{ t('share') }}</button>
        <button @click="toggleTheme" class="text-sm px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all" :title="isDark ? 'Modo claro' : 'Modo oscuro'">{{ isDark ? '☀️' : '🌙' }}</button>
      </div>
    </header>

    <main id="main-split" class="flex-1 flex flex-col md:flex-row h-full overflow-hidden pb-16 md:pb-0">
      
      <div 
        class="w-full md:w-1/2 overflow-hidden border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5 shrink-0 md:shrink flex flex-col"
        :style="{ height: isMobile ? `calc(${inputHeight}% - 4px)` : '100%', minHeight: isMobile ? '50px' : 'auto', maxHeight: isMobile ? '90%' : '100%' }"
      >
        <div class="h-full p-2 md:p-4 flex-1 overflow-hidden">
          <TextInput v-model="text" />
        </div>
      </div>

      <div 
        class="w-full h-1.5 hover:h-2 hover:bg-indigo-400/30 cursor-row-resize flex items-center justify-center touch-none transition-all shrink-0 z-10 md:hidden"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <div class="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>

      <div class="w-full md:w-1/2 overflow-y-auto flex-1">
        <div class="p-4 md:p-8 max-w-4xl mx-auto min-h-full">
          
          <div class="md:hidden">
            <Transition name="fade" mode="out-in">
              <div :key="activeTab">
                <FormatTool v-if="activeTab === 'format'" @notify="showToast" @share="handleShare" />
                <StatsTool v-else-if="activeTab === 'stats'" />
              </div>
            </Transition>
          </div>

          <div class="hidden md:flex flex-col gap-6 pb-10">
            <div class="glass-card rounded-2xl p-6 shadow-xl shadow-black/5 dark:shadow-black/20">
              <FormatTool @notify="showToast" @share="handleShare" />
            </div>
            <div class="glass-card rounded-2xl p-6 shadow-xl shadow-black/5 dark:shadow-black/20">
              <StatsTool />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Mobile Nav -->
    <nav class="md:hidden w-full h-16 glass border-t border-black/5 dark:border-white/5 flex flex-row gap-1.5 p-2 fixed bottom-0 left-0 z-30">
      <button
        v-for="tab in [{id: 'format', labelKey: 'toolsTab', icon: '◇'}, {id: 'stats', labelKey: 'statsTab', icon: '◉'}]"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex-1 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all text-[11px] font-semibold',
          activeTab === tab.id 
            ? 'gradient-accent text-white shadow-lg shadow-indigo-500/20' 
            : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
        ]"
      >
        <span class="text-base leading-none">{{ tab.icon }}</span>
        <span>{{ t(tab.labelKey) }}</span>
      </button>
    </nav>

    <Toast :show="toast.show" :message="toast.message" :type="toast.type" />
  </div>
</template>

<style>
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
.dark ::-webkit-scrollbar-thumb { background: #374151; }
</style>
