<script setup>
import { ref, computed } from 'vue'
import { checkAnswer } from '../../data/puzzles'

const props = defineProps(['puzzle'])
const emit = defineEmits(['solved'])

// Word scramble puzzle
const scrambledLetters = ref(['L', 'O', 'V', 'E', 'Y', 'O', 'U']) // Example - TBD
const selectedLetters = ref([])
const error = ref(false)
const showHint = ref(false)

const availableLetters = computed(() => {
  const selected = [...selectedLetters.value]
  return scrambledLetters.value.filter((letter, index) => {
    const idx = selected.indexOf(letter)
    if (idx !== -1) {
      selected.splice(idx, 1)
      return false
    }
    return true
  })
})

const currentAnswer = computed(() => selectedLetters.value.join(''))

const selectLetter = (letter, index) => {
  selectedLetters.value.push(letter)
}

const removeLetter = (index) => {
  selectedLetters.value.splice(index, 1)
}

const submit = () => {
  if (checkAnswer(4, currentAnswer.value)) {
    emit('solved')
  } else {
    error.value = true
    setTimeout(() => error.value = false, 1000)
  }
}

const reset = () => {
  selectedLetters.value = []
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center text-rose-700/80 text-lg">
      <p>Unscramble the letters to reveal the hidden message...</p>
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
          v-for="(letter, index) in selectedLetters"
          :key="'selected-' + index"
          @click="removeLetter(index)"
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
          @click="selectLetter(letter, index)"
          :disabled="!availableLetters.includes(letter)"
          class="w-12 h-12 rounded-xl font-bold text-xl transition-all transform"
          :class="{
            'bg-rose-100 text-rose-600 hover:bg-rose-200 hover:scale-110 shadow-md': availableLetters.includes(letter),
            'bg-gray-100 text-gray-300 cursor-not-allowed': !availableLetters.includes(letter)
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
