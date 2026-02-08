<script setup>
import { ref, onMounted } from 'vue'
import { wrappedContent } from '../../data/wrapped-content'

const visibleQuotes = ref([])

onMounted(() => {
  // Animate quotes appearing one by one
  wrappedContent.messageQuotes.forEach((quote, index) => {
    setTimeout(() => {
      visibleQuotes.value.push(quote)
    }, index * 600)
  })
})
</script>

<template>
  <div class="text-white max-w-3xl mx-auto px-4">
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
      Messages that made me smile
    </h2>

    <div class="space-y-8">
      <transition-group name="fade-up">
        <div
          v-for="(quote, index) in visibleQuotes"
          :key="index"
          class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform transition-all duration-500"
          :style="{ transitionDelay: index * 100 + 'ms' }"
        >
          <p class="text-xl md:text-2xl italic mb-4">
            "{{ quote.text }}"
          </p>
          <div class="flex justify-between text-white/60 text-sm">
            <span>{{ quote.context }}</span>
            <span>{{ quote.date }}</span>
          </div>
        </div>
      </transition-group>
    </div>

    <div v-if="visibleQuotes.length === 0" class="text-center text-white/40">
      Loading memories...
    </div>
  </div>
</template>

<style scoped>
.fade-up-enter-active {
  transition: all 0.5s ease-out;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
</style>
