<script setup>
import { ref, onMounted, computed } from 'vue'
import { wrappedContent } from '../../data/wrapped-content'

const stats = wrappedContent.messagingStats
const animatedValue = ref(0)

onMounted(() => {
  // Animate the message count
  const target = stats.totalMessages || 10000
  const duration = 2000
  const start = Date.now()

  const animate = () => {
    const elapsed = Date.now() - start
    const progress = Math.min(elapsed / duration, 1)
    // Easing function for smooth animation
    const eased = 1 - Math.pow(1 - progress, 3)
    animatedValue.value = Math.floor(target * eased)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  animate()
})

// Generate sample heatmap data if not provided
const heatmapData = computed(() => {
  if (stats.heatmapData && stats.heatmapData.length > 0) {
    return stats.heatmapData
  }

  // Generate sample data for visualization
  const data = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // More activity in evening hours
      let intensity = Math.random()
      if (hour >= 18 && hour <= 23) intensity *= 2
      if (hour >= 0 && hour <= 6) intensity *= 0.3
      data.push({ day, hour, count: Math.floor(intensity * 100) })
    }
  }
  return data
})

const getHeatmapColor = (count) => {
  const max = 100
  const intensity = Math.min(count / max, 1)
  const alpha = 0.2 + intensity * 0.8
  return `rgba(255, 255, 255, ${alpha})`
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const hours = Array.from({ length: 24 }, (_, i) => i)
</script>

<template>
  <div class="text-white max-w-4xl mx-auto px-4">
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">
      When We Talk Most
    </h2>

    <p class="text-center text-white/60 mb-8">
      Our messaging heatmap
    </p>

    <!-- Big number display -->
    <div class="text-center mb-12">
      <div class="text-6xl md:text-8xl font-bold mb-2">
        {{ animatedValue.toLocaleString() }}+
      </div>
      <p class="text-xl text-white/80">messages and counting</p>
    </div>

    <!-- Heatmap -->
    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 overflow-x-auto">
      <div class="min-w-[500px]">
        <!-- Hours header -->
        <div class="flex mb-2 pl-12">
          <div
            v-for="hour in [0, 6, 12, 18, 23]"
            :key="'hour-' + hour"
            class="text-xs text-white/40"
            :style="{ width: (hour === 0 ? 0 : 24) + '%', textAlign: hour === 23 ? 'right' : 'left' }"
          >
            {{ hour }}:00
          </div>
        </div>

        <!-- Rows by day -->
        <div class="space-y-1">
          <div v-for="(day, dayIndex) in days" :key="day" class="flex items-center">
            <div class="w-12 text-xs text-white/60">{{ day }}</div>
            <div class="flex-1 flex gap-0.5">
              <div
                v-for="hour in hours"
                :key="'cell-' + dayIndex + '-' + hour"
                class="flex-1 aspect-square rounded-sm transition-all duration-300 hover:scale-150 hover:z-10"
                :style="{
                  backgroundColor: getHeatmapColor(
                    heatmapData.find(d => d.day === dayIndex && d.hour === hour)?.count || 0
                  )
                }"
                :title="`${day} ${hour}:00 - ${heatmapData.find(d => d.day === dayIndex && d.hour === hour)?.count || 0} messages`"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Peak time callout -->
    <div class="mt-8 text-center">
      <p class="text-white/60">Peak messaging time</p>
      <p class="text-2xl font-bold">{{ stats.peakHour || '9 PM' }}</p>
    </div>
  </div>
</template>
