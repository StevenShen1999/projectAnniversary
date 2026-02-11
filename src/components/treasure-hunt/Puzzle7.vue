<script setup>
import { ref } from 'vue'
import { checkAnswer } from '../../data/puzzles'

const props = defineProps(['puzzle'])
const emit = defineEmits(['solved'])

const selectedOption = ref(null)
const error = ref(false)

const isSelected = (option) => selectedOption.value?.label === option.label

const selectOption = (option) => {
  selectedOption.value = option
}

const submit = async () => {
  if (selectedOption.value && await checkAnswer(5, selectedOption.value.label)) {
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
            'border-rose-200 bg-white hover:border-rose-400 hover:shadow-md': !isSelected(option) && !error,
            'border-rose-500 ring-2 ring-rose-300 bg-rose-100 shadow-lg scale-110 selected-glow': isSelected(option) && !error,
            'border-red-500 bg-red-50 animate-shake': error && isSelected(option)
          }"
        >
          <span class="text-4xl relative">
            {{ option.emoji }}
            <span v-if="isSelected(option)" class="absolute -top-1 -right-3 text-sm bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center">✓</span>
          </span>
          <span class="text-sm font-medium" :class="isSelected(option) ? 'text-rose-800' : 'text-rose-700'">{{ option.label }}</span>
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
.selected-glow {
  box-shadow: 0 0 12px rgba(244, 63, 94, 0.4), 0 4px 12px rgba(244, 63, 94, 0.2);
}
</style>
