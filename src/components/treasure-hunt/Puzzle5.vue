<script setup>
import { ref } from 'vue'
import { checkAnswer } from '../../data/puzzles'

const props = defineProps(['puzzle'])
const emit = defineEmits(['solved'])

const answer = ref('')
const error = ref(false)

const submit = () => {
  if (checkAnswer(4, answer.value)) {
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
      <input
        v-model="answer"
        type="text"
        placeholder="City name..."
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
