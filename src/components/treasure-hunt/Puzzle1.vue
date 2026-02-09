<script setup>
import { ref } from 'vue'
import { checkAnswer } from '../../data/puzzles'

const props = defineProps(['puzzle'])
const emit = defineEmits(['solved'])

const selectedColour = ref(null)
const error = ref(false)

const colourMap = {
  Red: '#ef4444',
  Blue: '#3b82f6',
  Green: '#22c55e',
  Yellow: '#eab308',
  Purple: '#a855f7',
  Pink: '#ec4899',
  Orange: '#f97316'
}

const selectColour = (colour) => {
  selectedColour.value = colour
}

const submit = () => {
  if (checkAnswer(0, selectedColour.value)) {
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
      <div class="grid grid-cols-4 gap-4 mb-6">
        <button
          v-for="colour in puzzle.colours"
          :key="colour"
          @click="selectColour(colour)"
          class="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300"
          :class="{
            'border-transparent hover:border-rose-200': selectedColour !== colour,
            'border-rose-600 shadow-lg scale-105': selectedColour === colour && !error,
            'border-red-500 animate-shake': error && selectedColour === colour
          }"
        >
          <div
            class="w-14 h-14 rounded-full shadow-md transition-transform hover:scale-110"
            :style="{ backgroundColor: colourMap[colour] }"
          ></div>
          <span class="text-sm text-rose-700 font-medium">{{ colour }}</span>
        </button>
      </div>

      <button
        @click="submit"
        :disabled="!selectedColour"
        class="btn-primary w-full"
        :class="{ 'opacity-50 cursor-not-allowed': !selectedColour }"
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
