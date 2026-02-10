<script setup>
import { ref, computed, onMounted } from 'vue'
import { wordEmojiStats } from '../../data/word-emoji-stats'

const view = ref('month') // 'month' or 'day'
const person = ref('combined') // 'combined', 'steven', 'elizabeth'
const showItems = ref(false)
const expandedMonth = ref(null) // month string or null
const expandedDay = ref(null) // day string or null

const activeStats = computed(() => wordEmojiStats[person.value])

const subtitle = computed(() => {
  if (person.value === 'steven') return "Steven's words and emojis"
  if (person.value === 'elizabeth') return "Elizabeth's words and emojis"
  return 'The words and emojis that defined us'
})

function toggleMonth(month) {
  expandedMonth.value = expandedMonth.value === month ? null : month
}

function toggleDay(day) {
  expandedDay.value = expandedDay.value === day ? null : day
}

onMounted(() => {
  setTimeout(() => showItems.value = true, 300)
})

const dayAbbrevs = {
  Sunday: 'Sun', Monday: 'Mon', Tuesday: 'Tue',
  Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat'
}
</script>

<template>
  <div class="text-white max-w-4xl mx-auto px-4 w-full">
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">
      Our Vocabulary
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

    <!-- Overall stats -->
    <div class="flex justify-center gap-8 mb-10">
      <div class="text-center">
        <div class="text-4xl md:text-5xl font-bold mb-1">
          "{{ activeStats.overall.word }}"
        </div>
        <p class="text-white/60 text-sm">Most used word</p>
        <p class="text-white/40 text-xs">{{ activeStats.overall.wordCount }} times</p>
      </div>
      <div class="text-center">
        <div class="text-4xl md:text-5xl mb-1">
          {{ activeStats.overall.emoji }}
        </div>
        <p class="text-white/60 text-sm">Most used emoji</p>
        <p class="text-white/40 text-xs">{{ activeStats.overall.emojiCount }} times</p>
      </div>
    </div>

    <!-- Toggle -->
    <div class="flex justify-center mb-6">
      <div class="bg-white/10 rounded-full p-1 flex gap-1">
        <button
          @click="view = 'month'; expandedDay = null"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
          :class="{
            'bg-white text-rose-600': view === 'month',
            'text-white/70 hover:text-white': view !== 'month'
          }"
        >
          By Month
        </button>
        <button
          @click="view = 'day'; expandedMonth = null"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
          :class="{
            'bg-white text-rose-600': view === 'day',
            'text-white/70 hover:text-white': view !== 'day'
          }"
        >
          By Day
        </button>
      </div>
    </div>

    <!-- By Month -->
    <transition name="fade" mode="out-in">
      <div v-if="view === 'month'" key="month" class="space-y-3">
        <div
          v-for="(item, index) in activeStats.byMonth"
          :key="item.month"
          class="transition-all duration-500"
          :class="{ 'opacity-0 translate-y-4': !showItems }"
          :style="{ transitionDelay: (index * 100) + 'ms' }"
        >
          <div
            @click="toggleMonth(item.month)"
            class="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white/15 transition-colors"
            :class="{ 'rounded-b-none': expandedMonth === item.month }"
          >
            <div class="w-20 text-sm font-medium text-white/70 shrink-0">
              {{ item.month }}
            </div>
            <div class="flex-1 flex items-center gap-6">
              <div class="flex items-center gap-2 flex-1">
                <span class="text-white/50 text-xs uppercase tracking-wide w-12">Word</span>
                <span class="font-bold text-lg">"{{ item.word }}"</span>
                <span class="text-white/40 text-xs">&times;{{ item.wordCount }}</span>
              </div>
              <div class="flex items-center gap-2 flex-1">
                <span class="text-white/50 text-xs uppercase tracking-wide w-12">Emoji</span>
                <span class="text-2xl">{{ item.emoji }}</span>
                <span class="text-white/40 text-xs">&times;{{ item.emojiCount }}</span>
              </div>
            </div>
            <svg
              class="w-4 h-4 text-white/40 shrink-0 transition-transform duration-300"
              :class="{ 'rotate-180': expandedMonth === item.month }"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <!-- Expanded top 10 dropdown -->
          <transition name="expand">
            <div
              v-if="expandedMonth === item.month"
              class="bg-white/5 backdrop-blur-sm rounded-b-xl px-4 pb-4 pt-2 border-t border-white/5"
            >
              <div class="grid grid-cols-2 gap-4">
                <!-- Top 10 Words -->
                <div>
                  <p class="text-white/50 text-xs uppercase tracking-wide mb-2">Top Words</p>
                  <div class="space-y-1">
                    <div
                      v-for="(w, i) in item.topWords"
                      :key="w.key"
                      class="flex items-center gap-2 text-sm h-7"
                    >
                      <span class="text-white/30 w-4 text-right text-xs">{{ i + 1 }}</span>
                      <div class="flex-1 flex items-center gap-2">
                        <div
                          class="h-1.5 rounded-full bg-rose-400/60"
                          :style="{ width: Math.max(8, (w.count / item.topWords[0].count) * 100) + '%' }"
                        ></div>
                      </div>
                      <span class="font-medium w-24 text-right truncate shrink-0">"{{ w.key }}"</span>
                      <span class="text-white/40 text-xs w-8 text-right shrink-0">&times;{{ w.count }}</span>
                    </div>
                  </div>
                </div>
                <!-- Top 10 Emojis -->
                <div>
                  <p class="text-white/50 text-xs uppercase tracking-wide mb-2">Top Emojis</p>
                  <div class="space-y-1">
                    <div
                      v-for="(e, i) in item.topEmojis"
                      :key="e.key"
                      class="flex items-center gap-2 text-sm h-7"
                    >
                      <span class="text-white/30 w-4 text-right text-xs">{{ i + 1 }}</span>
                      <div class="flex-1 flex items-center gap-2">
                        <div
                          class="h-1.5 rounded-full bg-amber-400/60"
                          :style="{ width: Math.max(8, (e.count / item.topEmojis[0].count) * 100) + '%' }"
                        ></div>
                      </div>
                      <span class="text-base w-8 text-center shrink-0">{{ e.key }}</span>
                      <span class="text-white/40 text-xs w-8 text-right shrink-0">&times;{{ e.count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- By Day -->
      <div v-else key="day" class="space-y-2">
        <div
          v-for="(item, index) in activeStats.byDay"
          :key="item.day"
          class="transition-all duration-500"
          :class="{ 'opacity-0 translate-y-4': !showItems }"
          :style="{ transitionDelay: (index * 70) + 'ms' }"
        >
          <div
            @click="toggleDay(item.day)"
            class="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-4 cursor-pointer hover:bg-white/15 transition-colors"
            :class="{ 'rounded-b-none': expandedDay === item.day }"
          >
            <div class="w-10 text-sm font-medium text-white/70 shrink-0">
              {{ dayAbbrevs[item.day] }}
            </div>
            <div class="flex-1 flex items-center gap-6">
              <div class="flex items-center gap-2 flex-1">
                <span class="text-white/50 text-xs uppercase tracking-wide w-12">Word</span>
                <span class="font-bold">"{{ item.word }}"</span>
                <span class="text-white/40 text-xs">&times;{{ item.wordCount }}</span>
              </div>
              <div class="flex items-center gap-2 flex-1">
                <span class="text-white/50 text-xs uppercase tracking-wide w-12">Emoji</span>
                <span class="text-xl">{{ item.emoji }}</span>
                <span class="text-white/40 text-xs">&times;{{ item.emojiCount }}</span>
              </div>
            </div>
            <svg
              class="w-4 h-4 text-white/40 shrink-0 transition-transform duration-300"
              :class="{ 'rotate-180': expandedDay === item.day }"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <!-- Expanded top 10 dropdown -->
          <transition name="expand">
            <div
              v-if="expandedDay === item.day"
              class="bg-white/5 backdrop-blur-sm rounded-b-xl px-4 pb-4 pt-2 border-t border-white/5"
            >
              <div class="grid grid-cols-2 gap-4">
                <!-- Top 10 Words -->
                <div>
                  <p class="text-white/50 text-xs uppercase tracking-wide mb-2">Top Words</p>
                  <div class="space-y-1">
                    <div
                      v-for="(w, i) in item.topWords"
                      :key="w.key"
                      class="flex items-center gap-2 text-sm h-7"
                    >
                      <span class="text-white/30 w-4 text-right text-xs">{{ i + 1 }}</span>
                      <div class="flex-1 flex items-center gap-2">
                        <div
                          class="h-1.5 rounded-full bg-rose-400/60"
                          :style="{ width: Math.max(8, (w.count / item.topWords[0].count) * 100) + '%' }"
                        ></div>
                      </div>
                      <span class="font-medium w-24 text-right truncate shrink-0">"{{ w.key }}"</span>
                      <span class="text-white/40 text-xs w-8 text-right shrink-0">&times;{{ w.count }}</span>
                    </div>
                  </div>
                </div>
                <!-- Top 10 Emojis -->
                <div>
                  <p class="text-white/50 text-xs uppercase tracking-wide mb-2">Top Emojis</p>
                  <div class="space-y-1">
                    <div
                      v-for="(e, i) in item.topEmojis"
                      :key="e.key"
                      class="flex items-center gap-2 text-sm h-7"
                    >
                      <span class="text-white/30 w-4 text-right text-xs">{{ i + 1 }}</span>
                      <div class="flex-1 flex items-center gap-2">
                        <div
                          class="h-1.5 rounded-full bg-amber-400/60"
                          :style="{ width: Math.max(8, (e.count / item.topEmojis[0].count) * 100) + '%' }"
                        ></div>
                      </div>
                      <span class="text-base w-8 text-center shrink-0">{{ e.key }}</span>
                      <span class="text-white/40 text-xs w-8 text-right shrink-0">&times;{{ e.count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
