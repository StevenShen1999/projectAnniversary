<script setup>
import { ref, onMounted } from 'vue'
import { wrappedContent } from '../../data/wrapped-content'

const showFirst = ref(false)
const showSecond = ref(false)

onMounted(() => {
  setTimeout(() => showFirst.value = true, 300)
  setTimeout(() => showSecond.value = true, 1000)
})
</script>

<template>
  <div class="text-white max-w-4xl mx-auto px-4">
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
      Our First Photos
    </h2>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- First photo of her -->
      <transition name="scale">
        <div
          v-if="showFirst"
          class="bg-white/10 backdrop-blur-sm rounded-3xl p-4 transform hover:scale-105 transition-transform duration-300"
        >
          <div class="aspect-square bg-white/20 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
            <img
              v-if="wrappedContent.images.firstOfHer.src"
              :src="wrappedContent.images.firstOfHer.src"
              :alt="wrappedContent.images.firstOfHer.caption"
              class="w-full h-full object-cover"
              @error="$event.target.style.display = 'none'"
            />
            <span v-else class="text-6xl">📷</span>
          </div>
          <p class="text-center text-lg font-medium">
            {{ wrappedContent.images.firstOfHer.caption }}
          </p>
          <p class="text-center text-white/60 text-sm mt-1">
            {{ wrappedContent.images.firstOfHer.date }}
          </p>
        </div>
      </transition>

      <!-- First photo sent -->
      <transition name="scale">
        <div
          v-if="showSecond"
          class="bg-white/10 backdrop-blur-sm rounded-3xl p-4 transform hover:scale-105 transition-transform duration-300"
        >
          <div class="aspect-square bg-white/20 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
            <img
              v-if="wrappedContent.images.firstSent.src"
              :src="wrappedContent.images.firstSent.src"
              :alt="wrappedContent.images.firstSent.caption"
              class="w-full h-full object-cover"
              @error="$event.target.style.display = 'none'"
            />
            <span v-else class="text-6xl">📸</span>
          </div>
          <p class="text-center text-lg font-medium">
            {{ wrappedContent.images.firstSent.caption }}
          </p>
          <p class="text-center text-white/60 text-sm mt-1">
            {{ wrappedContent.images.firstSent.date }}
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>
