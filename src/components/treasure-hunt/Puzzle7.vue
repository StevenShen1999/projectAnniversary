<script setup>
import { ref } from 'vue'

const props = defineProps(['puzzle'])
const emit = defineEmits(['solved'])

const selectedOption = ref(null)
const error = ref(false)

const selectOption = (option) => {
  selectedOption.value = option
}

const submit = () => {
  if (selectedOption.value && selectedOption.value.correct) {
    emit('solved')
  } else {
    error.value = true
    setTimeout(() => error.value = false, 1000)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center text-rose-700/80 text-lg">
      <p>{{ puzzle.question }}</p>
    </div>

    <div class="max-w-md mx-auto">
      <div class="grid grid-cols-3 gap-4 mb-6">
        <button
          v-for="option in puzzle.options"
          :key="option.label"
          @click="selectOption(option)"
          class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300"
          :class="{
            'border-rose-200 bg-white hover:border-rose-400 hover:shadow-md': selectedOption !== option && !error,
            'border-rose-600 bg-rose-50 shadow-lg scale-105': selectedOption === option && !error,
            'border-red-500 bg-red-50 animate-shake': error && selectedOption === option
          }"
        >
          <span class="text-4xl">{{ option.emoji }}</span>
          <span class="text-sm text-rose-700 font-medium">{{ option.label }}</span>
        </button>
      </div>

      <button
        @click="submit"
        :disabled="!selectedOption"
        class="btn-primary w-full"
        :class="{ 'opacity-50 cursor-not-allowed': !selectedOption }"
      >
        Submit Final Answer
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
