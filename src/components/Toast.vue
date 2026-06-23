<script setup>
defineProps({
  show: Boolean,
  message: String,
  type: { type: String, default: 'success' }
})
</script>

<template>
  <Transition name="fade">
    <div v-if="show"
      :class="[
        'fixed top-4 right-4 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium z-50',
        type === 'success' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'bg-red-600 text-white'
      ]"
    >
      {{ message }}
    </div>
  </Transition>
</template>
