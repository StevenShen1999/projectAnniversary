<script setup>
import { ref, computed } from 'vue'
import { messagingStatsData, dailyCalendarData, dailyCalendarDataMsk } from '../../data/word-emoji-stats'

const person = ref('combined') // 'combined', 'steven', 'elizabeth'
const perspective = ref('his') // 'his' = AEDT (UTC+11), 'hers' = Saint Petersburg (UTC+3)

const activeMessaging = computed(() => messagingStatsData[person.value])

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

// ── Daily Calendar Heatmap ──
const activeCalendar = computed(() => {
  const source = perspective.value === 'hers' ? dailyCalendarDataMsk : dailyCalendarData
  return source[person.value]
})

const CALENDAR_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CAL_DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun']

const calendarGrid = computed(() => {
  const data = activeCalendar.value
  const start = new Date('2025-11-19')
  const end = new Date('2026-02-13')

  // Build array of all dates
  const allDates = []
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    allDates.push(new Date(d))
  }

  // Monday-start: JS getDay() 0=Sun, we want Mon=0..Sun=6
  const mondayIndex = (d) => (d.getDay() + 6) % 7

  // Pad leading empty cells so first date lands on correct row
  const firstDayOffset = mondayIndex(allDates[0])
  const cells = []
  for (let i = 0; i < firstDayOffset; i++) cells.push(null)
  for (const d of allDates) {
    const iso = d.toISOString().slice(0, 10)
    cells.push({ date: d, iso, count: data[iso] || 0 })
  }

  // Build weeks (columns of 7)
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  // Pad last week to 7
  const last = weeks[weeks.length - 1]
  while (last.length < 7) last.push(null)

  // Month labels: find first week index where a new month starts
  const monthLabels = []
  let lastMonth = -1
  for (let wi = 0; wi < weeks.length; wi++) {
    for (const cell of weeks[wi]) {
      if (cell && cell.date) {
        const m = cell.date.getMonth()
        if (m !== lastMonth) {
          monthLabels.push({ weekIndex: wi, label: CALENDAR_MONTH_NAMES[m] })
          lastMonth = m
          break
        }
      }
    }
  }

  return { weeks, monthLabels }
})

const calendarMax = computed(() => {
  const data = activeCalendar.value
  let max = 1
  for (const v of Object.values(data)) {
    if (v > max) max = v
  }
  return max
})

const getCalendarColor = (count) => {
  if (count === 0) return 'rgba(255, 255, 255, 0.03)'
  const t = Math.pow(count / calendarMax.value, 0.45)
  const alpha = 0.08 + t * 0.92
  return `rgba(255, 255, 255, ${alpha})`
}

const calTooltip = ref({ show: false, x: 0, y: 0, text: '' })

const showCalTooltip = (event, cell) => {
  if (!cell) return
  const d = cell.date
  const label = `${CALENDAR_MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  calTooltip.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    text: `${label} — ${cell.count} msgs`
  }
}

const hideCalTooltip = () => {
  calTooltip.value.show = false
}
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
        {{ activeMessaging.totalMessages.toLocaleString() }}+
      </div>
      <p class="text-xl text-white/80">messages and counting</p>
    </div>

    <!-- Heatmap -->
    <div class="bg-white/10 rounded-2xl p-4 md:p-6 overflow-x-auto">
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

      <div class="min-w-[320px]">
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
                class="flex-1 aspect-square rounded-sm"
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

    <!-- Daily Calendar Heatmap -->
    <div class="bg-white/10 rounded-2xl p-4 md:p-6 mt-6 overflow-x-auto">
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

      <div class="min-w-[320px]">
        <!-- Month labels -->
        <div class="flex items-center mb-1">
          <div class="w-10 shrink-0 mr-1"></div>
          <div class="flex-1 relative h-4">
            <template v-for="(ml, idx) in calendarGrid.monthLabels" :key="'ml-' + idx">
              <span
                class="text-xs text-white/40 absolute"
                :style="{ left: (ml.weekIndex / calendarGrid.weeks.length * 100) + '%' }"
              >{{ ml.label }}</span>
            </template>
          </div>
        </div>

        <!-- Grid: 7 rows (Mon-Sun), N week columns using CSS grid -->
        <div
          class="grid"
          :style="{
            gridTemplateColumns: `auto repeat(${calendarGrid.weeks.length}, 1fr)`,
            gridTemplateRows: 'repeat(7, 1fr)',
            gap: '3px'
          }"
        >
          <template v-for="row in 7" :key="'row-' + row">
            <!-- Day label -->
            <div class="flex items-center justify-end pr-1">
              <span class="text-[10px] text-white/50">{{ CAL_DAY_LABELS[row - 1] }}</span>
            </div>
            <!-- Cells for this row across all weeks -->
            <div
              v-for="(week, wi) in calendarGrid.weeks"
              :key="'cc-' + wi + '-' + (row - 1)"
              class="aspect-square rounded-sm"
              :class="week[row - 1] ? 'cursor-pointer' : ''"
              :style="{
                backgroundColor: week[row - 1] ? getCalendarColor(week[row - 1].count) : 'transparent'
              }"
              @mouseenter="week[row - 1] && showCalTooltip($event, week[row - 1])"
              @mouseleave="hideCalTooltip"
            ></div>
          </template>
        </div>

        <!-- Legend -->
        <div class="flex justify-end items-center gap-1 mt-3">
          <span class="text-[10px] text-white/40">Less</span>
          <div
            v-for="level in [0, 0.2, 0.4, 0.7, 1.0]"
            :key="'leg-' + level"
            class="w-[10px] h-[10px] rounded-sm"
            :style="{
              backgroundColor: level === 0
                ? 'rgba(255,255,255,0.03)'
                : `rgba(255,255,255,${0.08 + Math.pow(level, 0.45) * 0.92})`
            }"
          ></div>
          <span class="text-[10px] text-white/40">More</span>
        </div>
      </div>
    </div>

    <!-- Tooltips -->
    <Teleport to="body">
      <div
        v-if="tooltip.show"
        class="fixed z-50 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
        :style="{ left: tooltip.x + 12 + 'px', top: tooltip.y - 36 + 'px' }"
      >
        {{ tooltip.text }}
      </div>
      <div
        v-if="calTooltip.show"
        class="fixed z-50 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
        :style="{ left: calTooltip.x + 12 + 'px', top: calTooltip.y - 36 + 'px' }"
      >
        {{ calTooltip.text }}
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

