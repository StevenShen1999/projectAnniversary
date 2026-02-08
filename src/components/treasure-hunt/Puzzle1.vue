<script setup>
import { ref } from 'vue'
import { checkAnswer } from '../../data/puzzles'

const props = defineProps(['puzzle'])
const emit = defineEmits(['solved'])

const answer = ref('')
const error = ref(false)
const showHint = ref(false)

const submit = () => {
  if (checkAnswer(0, answer.value)) {
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
      <!-- Puzzle 1 content/question goes here -->
      <p>Enter the answer to unlock the next puzzle...</p>
      <p class="text-sm mt-2 italic">(Puzzle content TBD - currently accepts any answer)</p>
    </div>

    <div class="max-w-md mx-auto">
      <input
        v-model="answer"
        type="text"
        placeholder="Your answer..."
        class="w-full px-6 py-4 text-lg rounded-xl border-2 transition-all duration-300 outline-none"
        :class="{
          'border-rose-300 focus:border-rose-500': !error,
          'border-red-500 bg-red-50 animate-shake': error
        }"
        @keyup.enter="submit"
      />

      <button
        @click="submit"
        class="btn-primary w-full mt-4"
      >
        Submit Answer
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
