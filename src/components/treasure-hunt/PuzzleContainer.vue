<script setup>
import { computed, ref } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { puzzles } from '../../data/puzzles'
import Puzzle1 from './Puzzle1.vue'
import Puzzle2 from './Puzzle2.vue'
import Puzzle3 from './Puzzle3.vue'
import Puzzle4 from './Puzzle4.vue'
import Puzzle5 from './Puzzle5.vue'
import Puzzle6 from './Puzzle6.vue'
import Puzzle7 from './Puzzle7.vue'
import Puzzle8 from './Puzzle8.vue'

const store = useGameStore()

const puzzleComponents = {
  0: Puzzle1,
  1: Puzzle3,
  2: Puzzle4,
  3: Puzzle5,
  4: Puzzle8,
  5: Puzzle7,
  6: Puzzle2,
  7: Puzzle6
}

const currentPuzzleComponent = computed(() => {
  return puzzleComponents[store.state.currentPuzzle]
})

const currentPuzzleData = computed(() => {
  return puzzles[store.state.currentPuzzle]
})

const handlePuzzleSolved = () => {
  store.completePuzzle(store.state.currentPuzzle)
}

const selectPuzzle = (index) => {
  if (store.canAccessPuzzle(index)) {
    store.setCurrentPuzzle(index)
  }
}

const getPuzzleStatus = (index) => {
  if (store.state.puzzlesCompleted[index]) return 'completed'
  if (store.canAccessPuzzle(index)) return 'available'
  return 'locked'
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Puzzle Navigation -->
    <div class="flex justify-center gap-3 mb-8 flex-wrap">
      <button
        v-for="(puzzle, index) in puzzles"
        :key="puzzle.id"
        @click="selectPuzzle(index)"
        :disabled="!store.canAccessPuzzle(index)"
        class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300"
        :class="{
          'bg-green-500 text-white shadow-lg shadow-green-500/30': getPuzzleStatus(index) === 'completed',
          'bg-white text-rose-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer': getPuzzleStatus(index) === 'available' && store.state.currentPuzzle !== index,
          'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-4 ring-rose-300': store.state.currentPuzzle === index,
          'bg-gray-200 text-gray-400 cursor-not-allowed': getPuzzleStatus(index) === 'locked'
        }"
      >
        <span v-if="getPuzzleStatus(index) === 'completed'">✓</span>
        <span v-else-if="getPuzzleStatus(index) === 'locked'">🔒</span>
        <span v-else>{{ index + 1 }}</span>
      </button>
    </div>

    <!-- Current Puzzle -->
    <transition name="scale" mode="out-in">
      <div :key="store.state.currentPuzzle" class="puzzle-card">
        <div class="text-center mb-6">
          <span class="text-sm text-rose-400 uppercase tracking-wider">
            Puzzle {{ store.state.currentPuzzle + 1 }} of 8
          </span>
          <h2 class="text-3xl font-bold gradient-text mt-1">
            {{ currentPuzzleData.title }}
          </h2>
        </div>

        <component
          :is="currentPuzzleComponent"
          :puzzle="currentPuzzleData"
          @solved="handlePuzzleSolved"
        />
      </div>
    </transition>
  </div>
</template>
