<script setup>
import { ref, onMounted } from 'vue'
import { wordEmojiStats } from '../../data/word-emoji-stats'

const view = ref('month') // 'month' or 'day'
const showItems = ref(false)

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

    <p class="text-center text-white/60 mb-8">
      The words and emojis that defined us
    </p>

    <!-- Overall stats -->
    <div class="flex justify-center gap-8 mb-10">
      <div class="text-center">
        <div class="text-4xl md:text-5xl font-bold mb-1">
          "{{ wordEmojiStats.overall.word }}"
        </div>
        <p class="text-white/60 text-sm">Most used word</p>
        <p class="text-white/40 text-xs">{{ wordEmojiStats.overall.wordCount }} times</p>
      </div>
      <div class="text-center">
        <div class="text-4xl md:text-5xl mb-1">
          {{ wordEmojiStats.overall.emoji }}
        </div>
        <p class="text-white/60 text-sm">Most used emoji</p>
        <p class="text-white/40 text-xs">{{ wordEmojiStats.overall.emojiCount }} times</p>
      </div>
    </div>

    <!-- Toggle -->
    <div class="flex justify-center mb-6">
      <div class="bg-white/10 rounded-full p-1 flex gap-1">
        <button
          @click="view = 'month'"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
          :class="{
            'bg-white text-rose-600': view === 'month',
            'text-white/70 hover:text-white': view !== 'month'
          }"
        >
          By Month
        </button>
        <button
          @click="view = 'day'"
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
          v-for="(item, index) in wordEmojiStats.byMonth"
          :key="item.month"
          class="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 transition-all duration-500"
          :class="{ 'opacity-0 translate-y-4': !showItems }"
          :style="{ transitionDelay: (index * 100) + 'ms' }"
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
        </div>
      </div>

      <!-- By Day -->
      <div v-else key="day" class="space-y-2">
        <div
          v-for="(item, index) in wordEmojiStats.byDay"
          :key="item.day"
          class="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-4 transition-all duration-500"
          :class="{ 'opacity-0 translate-y-4': !showItems }"
          :style="{ transitionDelay: (index * 70) + 'ms' }"
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
        </div>
      </div>
    </transition>
  </div>
</template>
