<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import PuzzleContainer from '../components/treasure-hunt/PuzzleContainer.vue'

const router = useRouter()
const store = useGameStore()

const showUnlockAnimation = ref(false)

watch(() => store.allPuzzlesCompleted.value, (completed) => {
  if (completed) {
    showUnlockAnimation.value = true
    setTimeout(() => {
      router.push('/wrapped')
    }, 3000)
  }
})

const progressPercent = computed(() => {
  return (store.completedCount.value / 6) * 100
})
</script>

<template>
  <div class="min-h-screen relative z-10">
    <!-- Header -->
    <header class="pt-8 pb-4 px-4 text-center">
      <h1 class="text-4xl md:text-5xl font-bold gradient-text mb-2">
        A Treasure Hunt for Elizabeth
      </h1>
      <p class="text-rose-600/80 text-lg">
        Solve all 6 puzzles to unlock your surprise
      </p>

      <!-- Progress bar -->
      <div class="max-w-md mx-auto mt-6">
        <div class="flex justify-between text-sm text-rose-600 mb-2">
          <span>Progress</span>
          <span>{{ store.completedCount.value }} / 6</span>
        </div>
        <div class="h-3 bg-white/50 rounded-full overflow-hidden shadow-inner">
          <div
            class="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-700 ease-out"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
      </div>
    </header>

    <!-- Puzzle Container -->
    <main class="px-4 pb-12">
      <PuzzleContainer />
    </main>

    <!-- Unlock Animation Overlay -->
    <transition name="fade">
      <div
        v-if="showUnlockAnimation"
        class="fixed inset-0 bg-gradient-to-br from-rose-500 to-pink-600 z-50 flex items-center justify-center"
      >
        <div class="text-center text-white">
          <div class="text-8xl mb-6 animate-heart-beat">💕</div>
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            All Puzzles Complete!
          </h2>
          <p class="text-xl opacity-90">
            Unlocking your surprise...
          </p>
        </div>
      </div>
    </transition>

    <!-- Dev controls (remove in production) -->
    <div class="fixed bottom-4 right-4 opacity-30 hover:opacity-100 transition-opacity">
      <button
        @click="store.unlockAll()"
        class="text-xs bg-gray-800 text-white px-3 py-1 rounded"
      >
        Dev: Unlock All
      </button>
      <button
        @click="store.resetProgress()"
        class="text-xs bg-gray-800 text-white px-3 py-1 rounded ml-2"
      >
        Dev: Reset
      </button>
    </div>
  </div>
</template>
