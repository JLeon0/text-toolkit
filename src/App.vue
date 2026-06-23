<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TextInput from './components/TextInput.vue'
import FormatTool from './components/FormatTool.vue'
import Toast from './components/Toast.vue'
import { useTextTools } from './composables/useTextTools'
import { useTheme } from './composables/useTheme'
import { useShareLink } from './composables/useShareLink'
import { useI18n } from './composables/useI18n'

const { text } = useTextTools()
const { isDark, toggle: toggleTheme } = useTheme()
const { loadFromUrl, copyShareUrl } = useShareLink()
const { t, locale, setLocale } = useI18n()

const toast = ref({ show: false, message: '', type: 'success' })

const inputHeight = ref(50)
const isDragging = ref(false)
const isMobile = ref(false)

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 2000)
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
  if (newHeight > 20 && newHeight < 80) inputHeight.value = newHeight
}

const stopDrag = () => { isDragging.value = false }
const checkMobile = () => { isMobile.value = window.innerWidth < 768 }

onMounted(() => {
  checkMobile()
  loadFromUrl()
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
  <div class="flex flex-col h-screen w-full bg-[#fafafa] dark:bg-[#0a0a0a] text-neutral-800 dark:text-neutral-200 font-sans overflow-hidden">
    
    <header class="hidden md:flex h-12 items-center px-6 border-b border-neutral-200 dark:border-neutral-800 shrink-0 z-20">
      <span class="font-semibold text-sm tracking-tight text-neutral-800 dark:text-neutral-200">TextTool</span>
      <div class="ml-auto flex items-center gap-3">
        <button @click="setLocale(locale === 'es' ? 'en' : 'es')" class="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 font-medium transition-colors">{{ locale === 'es' ? 'EN' : 'ES' }}</button>
        <button @click="handleShare" :title="t('shareTitle')" class="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">🔗</button>
        <button @click="toggleTheme" class="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">{{ isDark ? '☀️' : '🌙' }}</button>
      </div>
    </header>

    <main id="main-split" class="flex-1 flex flex-col md:flex-row h-full overflow-hidden pb-14 md:pb-0">
      
      <div 
        class="w-full md:w-1/2 overflow-hidden md:border-r border-neutral-200 dark:border-neutral-800 shrink-0 md:shrink flex flex-col"
        :style="{ height: isMobile ? `calc(${inputHeight}% - 2px)` : '100%' }"
      >
        <div class="h-full p-3 md:p-5 flex-1 overflow-hidden">
          <TextInput v-model="text" />
        </div>
      </div>

      <div 
        class="w-full h-1 bg-neutral-200 dark:bg-neutral-800 hover:bg-indigo-400 dark:hover:bg-indigo-600 cursor-row-resize flex items-center justify-center touch-none transition-colors shrink-0 z-10 md:hidden"
        @mousedown="startDrag" @touchstart="startDrag"
      >
        <div class="w-12 h-0.5 bg-neutral-300 dark:bg-neutral-600 rounded-full"></div>
      </div>

      <div class="w-full md:w-1/2 overflow-y-auto flex-1">
        <div class="p-4 md:p-8 max-w-3xl mx-auto min-h-full">
          <FormatTool @notify="showToast" @share="handleShare" />
        </div>
      </div>
    </main>

    <Toast :show="toast.show" :message="toast.message" :type="toast.type" />
  </div>
</template>

<style>
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 2px; }
.dark ::-webkit-scrollbar-thumb { background: #404040; }
</style>
