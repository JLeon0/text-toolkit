<script setup>
defineProps({
  show: Boolean,
  message: String,
  type: {
    type: String,
    default: 'success'
  }
})
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="show" 
      :class="[
        'fixed top-6 right-6 px-6 py-3 rounded-2xl shadow-2xl text-sm font-medium z-50 flex items-center gap-3 animate-bounce-in',
        type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      ]"
    >
      <span>{{ type === 'success' ? '✅' : '❌' }}</span>
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
</style>
