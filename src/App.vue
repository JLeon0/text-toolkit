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
  <div class="flex flex-col h-screen w-full bg-gray-950 text-gray-100 font-sans overflow-hidden relative">
    
    <header class="hidden md:flex h-16 items-center px-6 border-b border-gray-800 bg-gray-900 shrink-0 z-20">
      <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">T</div>
      <span class="ml-3 font-bold text-lg tracking-tight">TextTool</span>
      <div class="ml-auto flex items-center gap-3">
        <button @click="setLocale(locale === 'es' ? 'en' : 'es')" class="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-md border border-gray-700 transition-colors font-medium">
          {{ locale === 'es' ? 'EN' : 'ES' }}
        </button>
        <button @click="handleShare" :title="t('shareTitle')" class="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-md border border-gray-700 transition-colors">🔗 {{ t('share') }}</button>
        <button @click="toggleTheme" class="text-sm px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded-md border border-gray-700 transition-colors" :title="isDark ? 'Modo claro' : 'Modo oscuro'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
        <div class="text-xs text-gray-500">v1.0.0</div>
      </div>
    </header>

    <main id="main-split" class="flex-1 flex flex-col md:flex-row h-full overflow-hidden pb-16 md:pb-0">
      
      <div 
        class="w-full md:w-1/2 overflow-hidden border-b md:border-b-0 md:border-r border-gray-800 bg-gray-950 shrink-0 md:shrink flex flex-col"
        :style="{ height: isMobile ? `calc(${inputHeight}% - 4px)` : '100%', minHeight: isMobile ? '50px' : 'auto', maxHeight: isMobile ? '90%' : '100%' }"
      >
        <div class="h-full p-2 md:p-6 flex-1 overflow-hidden">
          <TextInput v-model="text" />
        </div>
      </div>

      <div 
        class="w-full h-2 bg-gray-950 hover:bg-indigo-500 cursor-row-resize flex items-center justify-center touch-none transition-colors shrink-0 z-10 md:hidden"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <div class="w-8 h-1 bg-gray-600 hover:bg-white rounded-full transition-colors"></div>
      </div>

      <div class="w-full md:w-1/2 bg-gray-950 overflow-y-auto flex-1">
        <div class="p-4 md:p-8 max-w-4xl mx-auto min-h-full">
          
          <div class="md:hidden">
            <Transition name="fade" mode="out-in">
              <div :key="activeTab">
                <FormatTool v-if="activeTab === 'format'" @notify="showToast" @share="handleShare" />
                <StatsTool v-else-if="activeTab === 'stats'" />
              </div>
            </Transition>
          </div>

          <div class="hidden md:flex flex-col gap-8 pb-10">
            <div class="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <FormatTool @notify="showToast" @share="handleShare" />
            </div>
            <div class="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <StatsTool />
            </div>
          </div>
        </div>
      </div>
    </main>

    <nav class="md:hidden w-full h-16 bg-gray-900 border-t border-gray-800 flex flex-row gap-1 p-2 fixed bottom-0 left-0 z-30">
      <button
        v-for="tab in [{id: 'format', labelKey: 'toolsTab', icon: '✨'}, {id: 'stats', labelKey: 'statsTab', icon: '📊'}]"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-all text-xs font-medium',
          activeTab === tab.id 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
        ]"
      >
        <span class="text-lg leading-none">{{ tab.icon }}</span>
        <span>{{ t(tab.labelKey) }}</span>
      </button>
    </nav>

    <Toast :show="toast.show" :message="toast.message" :type="toast.type" />
  </div>
</template>

<style>
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #374151; border-radius: 2px; }
</style>
