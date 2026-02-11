<script setup>
import { ref, computed } from 'vue'
import { checkAnswer } from '../../data/puzzles'

const props = defineProps(['puzzle'])
const emit = defineEmits(['solved'])

// Scramble the letters of "ageofmythology"
const targetWord = 'ageofmythology'
const scrambledLetters = ref(shuffle([...targetWord.toUpperCase()]))
const selectedIndices = ref([])
const error = ref(false)

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const selectedLetters = computed(() =>
  selectedIndices.value.map(i => scrambledLetters.value[i])
)

const currentAnswer = computed(() => selectedLetters.value.join(''))

const isUsed = (index) => selectedIndices.value.includes(index)

const selectLetter = (index) => {
  if (!isUsed(index)) {
    selectedIndices.value.push(index)
  }
}

const removeLetter = (position) => {
  selectedIndices.value.splice(position, 1)
}

const submit = async () => {
  if (await checkAnswer(3, currentAnswer.value)) {
    emit('solved')
  } else {
    error.value = true
    setTimeout(() => error.value = false, 1000)
  }
}

const reset = () => {
  selectedIndices.value = []
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center text-rose-700/80 text-lg">
      <p>{{ puzzle.question }}</p>
      <p class="text-sm mt-2 text-rose-500/70 italic">Unscramble the letters to form the answer (no spaces)</p>
    </div>

    <div class="max-w-md mx-auto">
      <!-- Selected letters display -->
      <div
        class="min-h-16 p-4 bg-white rounded-xl border-2 mb-4 flex flex-wrap justify-center gap-2 transition-all duration-300"
        :class="{
          'border-rose-300': !error,
          'border-red-500 bg-red-50 animate-shake': error
        }"
      >
        <button
          v-for="(letter, position) in selectedLetters"
          :key="'selected-' + position"
          @click="removeLetter(position)"
          class="w-10 h-10 bg-rose-500 text-white rounded-lg font-bold text-lg
                 hover:bg-rose-600 transition-all transform hover:scale-105"
        >
          {{ letter }}
        </button>
        <span v-if="selectedLetters.length === 0" class="text-rose-300 italic">
          Click letters below to form your answer...
        </span>
      </div>

      <!-- Available letters -->
      <div class="flex flex-wrap justify-center gap-2 mb-6">
        <button
          v-for="(letter, index) in scrambledLetters"
          :key="'available-' + index"
          @click="selectLetter(index)"
          :disabled="isUsed(index)"
          class="w-12 h-12 rounded-xl font-bold text-xl transition-all transform"
          :class="{
            'bg-rose-100 text-rose-600 hover:bg-rose-200 hover:scale-110 shadow-md': !isUsed(index),
            'bg-gray-100 text-gray-300 cursor-not-allowed': isUsed(index)
          }"
        >
          {{ letter }}
        </button>
      </div>

      <div class="flex gap-3">
        <button
          @click="reset"
          class="btn-secondary flex-1"
        >
          Reset
        </button>
        <button
          @click="submit"
          class="btn-primary flex-1"
        >
          Submit
        </button>
      </div>
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
