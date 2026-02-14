<script setup>
import { ref, computed } from 'vue'
import { checkAnswer } from '../../data/puzzles'

const props = defineProps(['puzzle'])
const emit = defineEmits(['solved'])

const WORD = 'ЗВЕРИ'
const slots = ref(Array(WORD.length).fill(null))
const error = ref(false)

const decoys = ['А', 'Б', 'Г', 'Д', 'К', 'Л', 'М', 'Н', 'О', 'П']
const correctLetters = [...WORD]
const allLetters = ref(shuffle([...correctLetters, ...decoys]))

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const usedLetterIndices = computed(() => {
  const used = new Set()
  for (const entry of slots.value) {
    if (entry !== null) used.add(entry.sourceIndex)
  }
  return used
})

const nextEmptySlot = computed(() => slots.value.findIndex(s => s === null))

const isFull = computed(() => slots.value.every(s => s !== null))

const selectLetter = (letter, index) => {
  if (usedLetterIndices.value.has(index)) return
  const empty = nextEmptySlot.value
  if (empty === -1) return
  slots.value[empty] = { letter, sourceIndex: index }
}

const removeSlot = (slotIndex) => {
  slots.value[slotIndex] = null
}

const reset = () => {
  slots.value = Array(WORD.length).fill(null)
}

const submit = async () => {
  const answer = slots.value.map(s => s?.letter ?? '').join('')
  if (await checkAnswer(4, answer)) {
    emit('solved')
  } else {
    error.value = true
    setTimeout(() => error.value = false, 1000)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center text-rose-700/80 text-lg">
      <p>{{ puzzle.question }}</p>
      <p class="text-sm mt-2 text-rose-500/70 italic">Pick the Cyrillic letters to fill in the band name on the ticket</p>
    </div>

    <!-- Concert Ticket -->
    <div class="max-w-sm mx-auto">
      <div
        class="ticket relative rounded-2xl overflow-hidden shadow-2xl"
        :class="{ 'animate-shake': error }"
      >
        <!-- Perforated edge -->
        <div class="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-around items-center z-10">
          <div v-for="n in 10" :key="n" class="w-3 h-3 rounded-full bg-rose-50/80"></div>
        </div>

        <div class="ticket-body pl-6 pr-4 py-6 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500">
          <!-- Header -->
          <div class="text-center mb-4">
            <div class="flex justify-center gap-1 mb-1">
              <span v-for="n in 5" :key="n" class="text-yellow-200 text-xs">★</span>
            </div>
            <p class="text-amber-900/70 text-xs font-bold uppercase tracking-[0.3em]">Живой Концерт</p>
          </div>

          <!-- Band name slots -->
          <div class="flex justify-center gap-2 my-6">
            <button
              v-for="(slot, index) in slots"
              :key="'slot-' + index"
              @click="slot !== null && removeSlot(index)"
              class="w-12 h-14 rounded-lg border-2 border-dashed flex items-center justify-center text-2xl font-bold transition-all duration-200"
              :class="{
                'border-amber-800/40 bg-amber-300/40': slot === null,
                'border-amber-900 bg-white/90 text-amber-900 hover:bg-red-100 cursor-pointer': slot !== null
              }"
            >
              {{ slot?.letter ?? '' }}
            </button>
          </div>

          <!-- Decorative bottom -->
          <div class="text-center mt-4 space-y-1">
            <div class="flex justify-center gap-1">
              <span v-for="n in 5" :key="n" class="text-yellow-200 text-xs">★</span>
            </div>
            <p class="text-amber-900/50 text-[10px] font-semibold uppercase tracking-[0.2em]">Один Билет</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Cyrillic letter crowd -->
    <div class="max-w-md mx-auto">
      <div class="flex flex-wrap justify-center gap-2 mb-6">
        <button
          v-for="(letter, index) in allLetters"
          :key="'crowd-' + index"
          @click="selectLetter(letter, index)"
          :disabled="usedLetterIndices.has(index)"
          class="w-11 h-11 rounded-full font-bold text-lg transition-all transform"
          :class="{
            'bg-amber-100 text-amber-800 hover:bg-amber-200 hover:scale-110 shadow-md': !usedLetterIndices.has(index),
            'bg-gray-100 text-gray-300 cursor-not-allowed scale-90': usedLetterIndices.has(index)
          }"
        >
          {{ letter }}
        </button>
      </div>

      <div class="flex gap-3">
        <button @click="reset" class="btn-secondary flex-1">
          Reset
        </button>
        <button
          @click="submit"
          :disabled="!isFull"
          class="btn-primary flex-1"
          :class="{ 'opacity-50 cursor-not-allowed': !isFull }"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake {
  animation: shake 0.3s ease-in-out;
}

.ticket {
  border: 2px solid rgba(120, 53, 15, 0.3);
}
</style>
