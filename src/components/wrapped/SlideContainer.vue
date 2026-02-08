<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import IntroSlide from './IntroSlide.vue'
import MessageRecap from './MessageRecap.vue'
import FirstImages from './FirstImages.vue'
import MessagingStats from './MessagingStats.vue'
import StatisticsSlide from './StatisticsSlide.vue'
import EnvelopeFinale from './EnvelopeFinale.vue'

const store = useGameStore()

const slides = [
  { component: IntroSlide, name: 'intro' },
  { component: MessageRecap, name: 'messages' },
  { component: FirstImages, name: 'images' },
  { component: MessagingStats, name: 'stats' },
  { component: StatisticsSlide, name: 'statistics' },
  { component: EnvelopeFinale, name: 'finale' }
]

const currentSlide = ref(0)
const direction = ref('forward')
const touchStartX = ref(0)
const touchEndX = ref(0)

const currentComponent = computed(() => slides[currentSlide.value].component)

const canGoNext = computed(() => currentSlide.value < slides.length - 1)
const canGoPrev = computed(() => currentSlide.value > 0)

const nextSlide = () => {
  if (canGoNext.value) {
    direction.value = 'forward'
    currentSlide.value++
    store.setCurrentSlide(currentSlide.value)
  }
}

const prevSlide = () => {
  if (canGoPrev.value) {
    direction.value = 'backward'
    currentSlide.value--
    store.setCurrentSlide(currentSlide.value)
  }
}

const goToSlide = (index) => {
  if (index >= 0 && index < slides.length) {
    direction.value = index > currentSlide.value ? 'forward' : 'backward'
    currentSlide.value = index
    store.setCurrentSlide(currentSlide.value)
  }
}

// Touch handling for swipe
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
}

const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].clientX
  const diff = touchStartX.value - touchEndX.value

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  }
}

// Keyboard navigation
const handleKeydown = (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    nextSlide()
  } else if (e.key === 'ArrowLeft') {
    prevSlide()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  currentSlide.value = store.state.currentSlide || 0
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    class="min-h-screen flex flex-col"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- Progress dots -->
    <div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
      <button
        v-for="(slide, index) in slides"
        :key="slide.name"
        @click="goToSlide(index)"
        class="w-2 h-2 rounded-full transition-all duration-300"
        :class="{
          'bg-white w-6': currentSlide === index,
          'bg-white/40 hover:bg-white/60': currentSlide !== index
        }"
      />
    </div>

    <!-- Slide content -->
    <div class="flex-1 flex items-center justify-center p-4 md:p-8">
      <transition
        :name="direction === 'forward' ? 'slide-forward' : 'slide-backward'"
        mode="out-in"
      >
        <component :is="currentComponent" :key="currentSlide" />
      </transition>
    </div>

    <!-- Navigation buttons -->
    <div class="fixed bottom-8 left-0 right-0 flex justify-center gap-4 z-50">
      <button
        v-if="canGoPrev"
        @click="prevSlide"
        class="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all backdrop-blur-sm"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        v-if="canGoNext"
        @click="nextSlide"
        class="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all backdrop-blur-sm"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Swipe hint (first slide only) -->
    <transition name="fade">
      <div
        v-if="currentSlide === 0"
        class="fixed bottom-24 left-1/2 transform -translate-x-1/2 text-white/60 text-sm animate-pulse"
      >
        Swipe or use arrow keys to navigate
      </div>
    </transition>
  </div>
</template>

<style scoped>
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-backward-enter-active,
.slide-backward-leave-active {
  transition: all 0.5s ease-out;
}

.slide-forward-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.slide-forward-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.slide-backward-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}

.slide-backward-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
