<script setup>
import { ref } from 'vue'
import { checkAnswer } from '../../data/puzzles'

const props = defineProps(['puzzle'])
const emit = defineEmits(['solved'])

const selected = ref([])
const error = ref(false)

const toggleOption = (option) => {
  const idx = selected.value.indexOf(option)
  if (idx === -1) {
    selected.value.push(option)
  } else {
    selected.value.splice(idx, 1)
  }
}

const isSelected = (option) => selected.value.includes(option)

const submit = () => {
  if (checkAnswer(5, selected.value)) {
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
      <p class="text-sm mt-2 text-rose-500/70 italic">Select all that apply</p>
    </div>

    <div class="max-w-md mx-auto space-y-3">
      <button
        v-for="option in puzzle.options"
        :key="option"
        @click="toggleOption(option)"
        class="w-full p-4 rounded-xl border-2 text-left transition-all duration-300 flex items-center gap-3"
        :class="{
          'border-rose-300 bg-white hover:border-rose-400': !isSelected(option) && !error,
          'border-rose-600 bg-rose-50 shadow-lg': isSelected(option) && !error,
          'border-red-500 bg-red-50 animate-shake': error && isSelected(option)
        }"
      >
        <div
          class="w-6 h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0"
          :class="{
            'border-rose-300': !isSelected(option),
            'border-rose-600 bg-rose-600': isSelected(option)
          }"
        >
          <span v-if="isSelected(option)" class="text-white text-sm">✓</span>
        </div>
        <span class="text-rose-700 font-medium">{{ option }}</span>
      </button>

      <button
        @click="submit"
        :disabled="selected.length === 0"
        class="btn-primary w-full mt-4"
        :class="{ 'opacity-50 cursor-not-allowed': selected.length === 0 }"
      >
        Submit Answer
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
