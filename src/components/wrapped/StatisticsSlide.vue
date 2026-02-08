<script setup>
import { ref, onMounted } from 'vue'
import { wrappedContent } from '../../data/wrapped-content'

const visibleStats = ref([])

onMounted(() => {
  // Stagger the appearance of stats
  wrappedContent.statistics.forEach((stat, index) => {
    setTimeout(() => {
      visibleStats.value.push(stat)
    }, index * 400)
  })
})
</script>

<template>
  <div class="text-white max-w-3xl mx-auto px-4">
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
      Our Numbers
    </h2>

    <div class="grid grid-cols-2 gap-6">
      <transition-group name="pop">
        <div
          v-for="(stat, index) in visibleStats"
          :key="stat.label"
          class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-transform duration-300"
        >
          <div class="text-4xl mb-3">{{ stat.icon }}</div>
          <div class="text-3xl md:text-4xl font-bold mb-2">
            {{ stat.value }}
          </div>
          <div class="text-white/70 text-sm md:text-base">
            {{ stat.label }}
          </div>
        </div>
      </transition-group>
    </div>

    <div v-if="visibleStats.length === 0" class="text-center text-white/40 py-12">
      Calculating our moments together...
    </div>
  </div>
</template>

<style scoped>
.pop-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
</style>
