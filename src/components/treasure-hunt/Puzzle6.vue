<script setup>
import { ref } from 'vue'

const props = defineProps(['puzzle'])
const emit = defineEmits(['solved'])

const options = ref([
  { id: 'a', text: 'Option A - TBD', correct: false },
  { id: 'b', text: 'Option B - TBD', correct: true },
  { id: 'c', text: 'Option C - TBD', correct: false },
  { id: 'd', text: 'Option D - TBD', correct: false }
])

const selectedOption = ref(null)
const error = ref(false)
const showHint = ref(false)

const selectOption = (option) => {
  selectedOption.value = option.id
}

const submit = () => {
  const selected = options.value.find(o => o.id === selectedOption.value)
  if (selected && selected.correct) {
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
      <p>The Final Puzzle - Choose wisely...</p>
      <p class="text-sm mt-2 italic">(Multiple choice options TBD)</p>
    </div>

    <div class="max-w-md mx-auto space-y-3">
      <button
        v-for="option in options"
        :key="option.id"
        @click="selectOption(option)"
        class="w-full p-4 rounded-xl border-2 text-left transition-all duration-300"
        :class="{
          'border-rose-300 bg-white hover:border-rose-400': selectedOption !== option.id && !error,
          'border-rose-600 bg-rose-50 shadow-lg': selectedOption === option.id && !error,
          'border-red-500 bg-red-50 animate-shake': error && selectedOption === option.id
        }"
      >
        <span class="font-bold text-rose-600 mr-3">{{ option.id.toUpperCase() }}.</span>
        <span class="text-rose-700">{{ option.text }}</span>
      </button>

      <button
        @click="submit"
        :disabled="!selectedOption"
        class="btn-primary w-full mt-4"
        :class="{ 'opacity-50 cursor-not-allowed': !selectedOption }"
      >
        Submit Final Answer
      </button>

      <button
        @click="showHint = !showHint"
        class="w-full mt-3 text-rose-500 hover:text-rose-600 text-sm"
      >
        {{ showHint ? 'Hide hint' : 'Need a hint?' }}
      </button>

      <transition name="fade">
        <p v-if="showHint" class="mt-3 text-center text-rose-600/70 italic">
          💡 {{ puzzle.hint }}
        </p>
      </transition>
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
