<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { messagingStatsData } from '../../data/word-emoji-stats'

const person = ref('combined') // 'combined', 'steven', 'elizabeth'
const perspective = ref('his') // 'his' = AEDT (UTC+11), 'hers' = Saint Petersburg (UTC+3)

const activeMessaging = computed(() => messagingStatsData[person.value])

const animatedValue = ref(0)
let animationFrame = null

function animateToTarget(target) {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  const start = Date.now()
  const startVal = animatedValue.value
  const duration = 1200

  const animate = () => {
    const elapsed = Date.now() - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    animatedValue.value = Math.floor(startVal + (target - startVal) * eased)

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate)
    }
  }

  animate()
}

onMounted(() => {
  animateToTarget(activeMessaging.value.totalMessages)
})

// Re-animate when person changes
watch(person, () => {
  animateToTarget(activeMessaging.value.totalMessages)
})

const baseHeatmapData = computed(() => {
  if (activeMessaging.value.heatmapData && activeMessaging.value.heatmapData.length > 0) {
    return activeMessaging.value.heatmapData
  }

  const data = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      let intensity = Math.random()
      if (hour >= 18 && hour <= 23) intensity *= 2
      if (hour >= 0 && hour <= 6) intensity *= 0.3
      data.push({ day, hour, count: Math.floor(intensity * 100) })
    }
  }
  return data
})

// Shift heatmap data by hour offset, handling day wraparound
function shiftHeatmap(data, hourOffset) {
  const shifted = []
  const buckets = {}

  for (const entry of data) {
    let newHour = entry.hour + hourOffset
    let newDay = entry.day

    if (newHour < 0) {
      newHour += 24
      newDay = (newDay - 1 + 7) % 7
    } else if (newHour >= 24) {
      newHour -= 24
      newDay = (newDay + 1) % 7
    }

    const key = `${newDay}-${newHour}`
    if (!buckets[key]) {
      buckets[key] = { day: newDay, hour: newHour, count: 0 }
    }
    buckets[key].count += entry.count
  }

  return Object.values(buckets)
}

const heatmapData = computed(() => {
  if (perspective.value === 'hers') {
    // AEDT (UTC+11) to Saint Petersburg (UTC+3) = -8 hours
    return shiftHeatmap(baseHeatmapData.value, -8)
  }
  return baseHeatmapData.value
})

const peakHourLabel = computed(() => {
  // Find actual peak hour from current heatmap data
  const hourTotals = {}
  for (const entry of heatmapData.value) {
    hourTotals[entry.hour] = (hourTotals[entry.hour] || 0) + entry.count
  }
  let peakHour = 0
  let maxCount = 0
  for (const [hour, count] of Object.entries(hourTotals)) {
    if (count > maxCount) {
      maxCount = count
      peakHour = parseInt(hour)
    }
  }
  const period = peakHour >= 12 ? 'PM' : 'AM'
  const displayHour = peakHour === 0 ? 12 : peakHour > 12 ? peakHour - 12 : peakHour
  return `${displayHour} ${period}`
})

const heatmapMax = computed(() => {
  let max = 1
  for (const entry of heatmapData.value) {
    if (entry.count > max) max = entry.count
  }
  return max
})

const getHeatmapColor = (count) => {
  if (count === 0) return 'rgba(255, 255, 255, 0.03)'
  const t = Math.pow(count / heatmapMax.value, 0.45) // aggressive curve to spread low values
  const alpha = 0.08 + t * 0.92
  return `rgba(255, 255, 255, ${alpha})`
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const hours = Array.from({ length: 24 }, (_, i) => i)

const tooltip = ref({ show: false, x: 0, y: 0, text: '' })

const showTooltip = (event, dayIndex, hour) => {
  const count = heatmapData.value.find(d => d.day === dayIndex && d.hour === hour)?.count || 0
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHr = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  tooltip.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    text: `${days[dayIndex]} ${displayHr}${period} — ${count} msgs`
  }
}

const hideTooltip = () => {
  tooltip.value.show = false
}

const subtitle = computed(() => {
  if (person.value === 'steven') return "Steven's messaging heatmap"
  if (person.value === 'elizabeth') return "Elizabeth's messaging heatmap"
  return 'Our messaging heatmap'
})
</script>

<template>
  <div class="text-white max-w-4xl mx-auto px-4">
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">
      When We Talk Most
    </h2>

    <p class="text-center text-white/60 mb-6">
      {{ subtitle }}
    </p>

    <!-- Person toggle -->
    <div class="flex justify-center mb-6">
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

    <!-- Big number display -->
    <div class="text-center mb-12">
      <div class="text-6xl md:text-8xl font-bold mb-2">
        {{ animatedValue.toLocaleString() }}+
      </div>
      <p class="text-xl text-white/80">messages and counting</p>
    </div>

    <!-- Heatmap -->
    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 overflow-x-auto">
      <!-- Timezone toggle -->
      <div class="flex justify-center mb-4">
        <div class="bg-white/10 rounded-full p-1 flex gap-1">
          <button
            @click="perspective = 'his'"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
            :class="{
              'bg-white text-rose-600': perspective === 'his',
              'text-white/70 hover:text-white': perspective !== 'his'
            }"
          >
            His time (AEDT)
          </button>
          <button
            @click="perspective = 'hers'"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
            :class="{
              'bg-white text-rose-600': perspective === 'hers',
              'text-white/70 hover:text-white': perspective !== 'hers'
            }"
          >
            Her time (MSK)
          </button>
        </div>
      </div>

      <div class="min-w-[500px]">
        <!-- Hours header -->
        <div class="flex items-center mb-2">
          <div class="w-12 shrink-0"></div>
          <div class="flex-1 flex gap-0.5">
            <div
              v-for="h in hours"
              :key="'label-' + h"
              class="flex-1 text-center"
            >
              <span v-if="h % 6 === 0" class="text-xs text-white/40">{{ h }}:00</span>
            </div>
          </div>
        </div>

        <!-- Rows by day -->
        <div class="space-y-1">
          <div v-for="(day, dayIndex) in days" :key="day" class="flex items-center">
            <div class="w-12 text-xs text-white/60 shrink-0">{{ day }}</div>
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
                @mouseenter="showTooltip($event, dayIndex, hour)"
                @mouseleave="hideTooltip"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <Teleport to="body">
      <div
        v-if="tooltip.show"
        class="fixed z-50 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
        :style="{ left: tooltip.x + 12 + 'px', top: tooltip.y - 36 + 'px' }"
      >
        {{ tooltip.text }}
      </div>
    </Teleport>

    <!-- Peak time callout -->
    <div class="mt-8 text-center">
      <p class="text-white/60">Peak messaging time</p>
      <p class="text-2xl font-bold">{{ peakHourLabel }}</p>
      <p class="text-sm text-white/40 mt-1">
        {{ perspective === 'his' ? 'Sydney time' : 'Saint Petersburg time' }}
      </p>
    </div>
  </div>
</template>
