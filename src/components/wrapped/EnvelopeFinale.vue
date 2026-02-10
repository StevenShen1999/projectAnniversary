<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../../stores/gameStore'
import { wrappedContent } from '../../data/wrapped-content'

const router = useRouter()
const store = useGameStore()

const isOpen = ref(false)
const response = ref(null) // null, 'yes', 'maybe'

const openEnvelope = () => {
  if (!isOpen.value) {
    isOpen.value = true
  }
}

const sayYes = () => {
  response.value = 'yes'
}

const sayMaybe = () => {
  response.value = 'maybe'
}

const restartEverything = () => {
  store.resetProgress()
  router.push('/')
}
</script>

<template>
  <div class="text-white max-w-2xl mx-auto px-4 text-center">
    <transition name="fade" mode="out-in">
      <!-- Initial envelope state -->
      <div v-if="!response" key="envelope">
        <h2 class="text-3xl md:text-4xl font-bold mb-12">
          One Last Thing...
        </h2>

        <!-- Envelope -->
        <div
          class="relative cursor-pointer mx-auto"
          style="width: 280px; height: 200px;"
          @click="openEnvelope"
        >
          <!-- Envelope body -->
          <div class="absolute inset-0 bg-gradient-to-br from-rose-200 to-rose-300 rounded-lg shadow-2xl">
            <!-- Envelope flap -->
            <div
              class="absolute top-0 left-0 right-0 h-1/2 origin-top transition-transform duration-700"
              :class="{ 'rotate-x-180': isOpen }"
              style="transform-style: preserve-3d;"
            >
              <div
                class="absolute inset-0 bg-gradient-to-b from-rose-300 to-rose-200 rounded-t-lg"
                style="clip-path: polygon(0 0, 50% 100%, 100% 0);"
              ></div>
            </div>

            <!-- Heart seal -->
            <div
              v-if="!isOpen"
              class="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div class="text-4xl animate-pulse">💌</div>
            </div>
          </div>

          <!-- Letter inside -->
          <transition name="letter">
            <div
              v-if="isOpen"
              class="absolute left-4 right-4 bg-white rounded-lg shadow-lg p-6 text-rose-700"
              style="bottom: 20px; transform-origin: bottom center;"
            >
              <p class="text-lg md:text-xl font-medium leading-relaxed">
                {{ wrappedContent.finale.question }}
              </p>

              <div class="flex flex-col items-center gap-3 mt-6">
                <button
                  @click="sayYes"
                  class="px-8 py-3 bg-rose-500 text-white rounded-full font-bold
                         hover:bg-rose-600 transition-all transform hover:scale-105
                         shadow-lg hover:shadow-xl"
                >
                  Yes! 💕
                </button>
                <button
                  @click="sayMaybe"
                  class="px-6 py-2 bg-rose-200 text-rose-600 rounded-full text-sm font-medium
                         hover:bg-rose-300 transition-all transform hover:scale-105
                         shadow hover:shadow-md"
                >
                  Let me think about it...
                </button>
              </div>

              <p class="mt-4 text-rose-400 italic text-sm">
                {{ wrappedContent.finale.signature }}
              </p>
            </div>
          </transition>
        </div>

        <p v-if="!isOpen" class="mt-8 text-white/60 animate-pulse">
          Click to open
        </p>
      </div>

      <!-- Yes response -->
      <div v-else-if="response === 'yes'" key="yes-response" class="py-12">
        <div class="text-8xl mb-8 animate-heart-beat">💕</div>

        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          {{ wrappedContent.finale.yesResponse }}
        </h2>

        <div class="space-y-4 text-xl text-white/80">
          <p>Thank you for these amazing months.</p>
          <p>I'm so grateful in a sea of people, and across this great and big world of ours. We found each other, despite overwhelming odds.</p>
          <p>Here's to our great adventure together.</p>
        </div>

        <div class="mt-12">
          <div class="text-4xl md:text-6xl whitespace-nowrap">
            🎉✨💝✨🎉
          </div>
        </div>

        <p class="mt-8 text-white/60 italic">
          Happy Valentine's Day, Elizabeth
        </p>

        <button
          @click="restartEverything"
          class="mt-10 px-6 py-2 bg-white/10 hover:bg-white/20 text-white/50 hover:text-white/70 rounded-full text-sm font-medium
                 transition-all transform hover:scale-105 backdrop-blur-sm"
        >
          Start over from the beginning
        </button>
      </div>

      <!-- Maybe response -->
      <div v-else key="maybe-response" class="py-12">
        <div class="text-8xl mb-8">💔😢💔</div>

        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          I didn't expect this response...
        </h2>

        <div class="space-y-4 text-lg text-white/70">
          <p>Maybe it was a misclick? 🥺</p>
          <p>If not, only time can heal my wound 😭</p>
        </div>

        <div class="mt-12">
          <button
            @click="response = null; isOpen = false"
            class="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium
                   transition-all transform hover:scale-105 backdrop-blur-sm"
          >
            Okay fine, let me reconsider 💕
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.rotate-x-180 {
  transform: rotateX(180deg);
}

.letter-enter-active {
  transition: all 0.8s ease-out 0.4s;
}

.letter-enter-from {
  opacity: 0;
  transform: translateY(50px);
}

.letter-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
