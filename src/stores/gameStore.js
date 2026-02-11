import { reactive, computed, watch } from 'vue'

const STORAGE_KEY = 'elizabeth-valentine-progress'

const defaultState = {
  puzzlesCompleted: [false, false, false, false, false, false, false, false],
  currentPuzzle: 0,
  wrappedUnlocked: false,
  currentSlide: 0
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return { ...defaultState, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error('Failed to load progress:', e)
  }
  return { ...defaultState }
}

const state = reactive(loadFromStorage())

watch(
  () => ({ ...state }),
  (newState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
    } catch (e) {
      console.error('Failed to save progress:', e)
    }
  },
  { deep: true }
)

export function useGameStore() {
  const allPuzzlesCompleted = computed(() =>
    state.puzzlesCompleted.every(completed => completed)
  )

  const completedCount = computed(() =>
    state.puzzlesCompleted.filter(Boolean).length
  )

  const canAccessPuzzle = (index) => {
    if (index === 0) return true
    return state.puzzlesCompleted[index - 1]
  }

  const completePuzzle = (index) => {
    if (index >= 0 && index < state.puzzlesCompleted.length) {
      state.puzzlesCompleted[index] = true
      if (index < 7) {
        state.currentPuzzle = index + 1
      }
      if (allPuzzlesCompleted.value) {
        state.wrappedUnlocked = true
      }
    }
  }

  const setCurrentPuzzle = (index) => {
    if (canAccessPuzzle(index)) {
      state.currentPuzzle = index
    }
  }

  const setCurrentSlide = (index) => {
    state.currentSlide = index
  }

  const resetProgress = () => {
    state.puzzlesCompleted = [false, false, false, false, false, false, false, false]
    state.currentPuzzle = 0
    state.wrappedUnlocked = false
    state.currentSlide = 0
  }

  // Dev helper - unlock all puzzles
  const unlockAll = () => {
    state.puzzlesCompleted = [true, true, true, true, true, true, true, true]
    state.wrappedUnlocked = true
  }

  return {
    state,
    allPuzzlesCompleted,
    completedCount,
    canAccessPuzzle,
    completePuzzle,
    setCurrentPuzzle,
    setCurrentSlide,
    resetProgress,
    unlockAll
  }
}
