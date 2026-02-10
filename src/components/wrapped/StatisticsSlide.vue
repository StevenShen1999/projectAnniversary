<script setup>
import { ref, computed, onMounted } from 'vue'
import { numericStats } from '../../data/word-emoji-stats'

const person = ref('combined')
const showStats = ref(false)

const activeStats = computed(() => numericStats[person.value])

onMounted(() => {
  setTimeout(() => showStats.value = true, 100)
})
</script>

<template>
  <div class="text-white max-w-3xl mx-auto px-4">
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">
      Our Numbers
    </h2>

    <!-- Person toggle -->
    <div class="flex justify-center mb-8">
      <div class="bg-white/10 rounded-full p-1 flex gap-1">
        <button
          @click="person = 'combined'"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
          :class="{
            'bg-white text-rose-600': person === 'combined',
            'text-white/70 hover:text-white': person !== 'combined'
          }"
        >
          Both
        </button>
        <button
          @click="person = 'steven'"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
          :class="{
            'bg-white text-rose-600': person === 'steven',
            'text-white/70 hover:text-white': person !== 'steven'
          }"
        >
          Steven
        </button>
        <button
          @click="person = 'elizabeth'"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
          :class="{
            'bg-white text-rose-600': person === 'elizabeth',
            'text-white/70 hover:text-white': person !== 'elizabeth'
          }"
        >
          Elizabeth
        </button>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div :key="person" class="grid grid-cols-2 gap-6">
        <div
          v-for="(stat, index) in activeStats"
          :key="stat.label"
          class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-500"
          :class="{ 'opacity-0 translate-y-4': !showStats }"
          :style="{ transitionDelay: (index * 150) + 'ms' }"
        >
          <div class="text-4xl mb-3">{{ stat.icon }}</div>
          <div class="text-3xl md:text-4xl font-bold mb-2">
            {{ stat.value }}
          </div>
          <div class="text-white/70 text-xs md:text-base whitespace-nowrap">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
