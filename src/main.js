import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'

inject()
injectSpeedInsights()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

createApp(App).mount('#app')
