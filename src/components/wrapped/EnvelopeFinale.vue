<script setup>
import { ref } from 'vue'
import { wrappedContent } from '../../data/wrapped-content'

const isOpen = ref(false)
const showResponse = ref(false)
const answered = ref(false)

const openEnvelope = () => {
  if (!isOpen.value) {
    isOpen.value = true
  }
}

const sayYes = () => {
  answered.value = true
  showResponse.value = true
}
</script>

<template>
  <div class="text-white max-w-2xl mx-auto px-4 text-center">
    <transition name="fade" mode="out-in">
      <!-- Initial envelope state -->
      <div v-if="!showResponse" key="envelope">
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

              <div class="flex justify-center gap-4 mt-6">
                <button
                  @click="sayYes"
                  class="px-8 py-3 bg-rose-500 text-white rounded-full font-bold
                         hover:bg-rose-600 transition-all transform hover:scale-105
                         shadow-lg hover:shadow-xl"
                >
                  Yes! 💕
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

      <!-- Success response -->
      <div v-else key="response" class="py-12">
        <div class="text-8xl mb-8 animate-heart-beat">💕</div>

        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          {{ wrappedContent.finale.yesResponse }}
        </h2>

        <div class="space-y-4 text-xl text-white/80">
          <p>Thank you for these amazing 4 months.</p>
          <p>Here's to many more adventures together.</p>
        </div>

        <div class="mt-12">
          <div class="text-6xl">
            🎉✨💝✨🎉
          </div>
        </div>

        <p class="mt-8 text-white/60 italic">
          Happy Valentine's Day, Elizabeth
        </p>
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
