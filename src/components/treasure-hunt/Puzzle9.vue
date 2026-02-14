<script setup>
import { ref, onMounted } from 'vue'
import { checkAnswer } from '../../data/puzzles'

const props = defineProps(['puzzle'])
const emit = defineEmits(['solved'])

const WORD_LENGTH = 9 // "motorbike"
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const dials = ref(Array.from({ length: WORD_LENGTH }, () => 0))
const error = ref(false)
const dialCooldown = Array.from({ length: WORD_LENGTH }, () => false)

onMounted(() => {
  // Randomize starting positions
  dials.value = dials.value.map(() => Math.floor(Math.random() * 26))
})

const rotateDial = (index, direction) => {
  if (dialCooldown[index]) return
  dialCooldown[index] = true
  setTimeout(() => { dialCooldown[index] = false }, 80)

  const current = dials.value[index]
  if (direction === 'up') {
    dials.value[index] = (current - 1 + 26) % 26
  } else {
    dials.value[index] = (current + 1) % 26
  }
}

const getLetterAt = (dialIndex, offset) => {
  const pos = (dials.value[dialIndex] + offset + 26) % 26
  return ALPHABET[pos]
}

const submit = async () => {
  const combined = dials.value.map(i => ALPHABET[i]).join('')
  if (await checkAnswer(8, combined)) {
    emit('solved')
  } else {
    error.value = true
    setTimeout(() => error.value = false, 800)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center text-rose-700/80 text-lg">
      <p>{{ puzzle.question }}</p>
      <p class="text-sm text-rose-400 mt-2">Rotate each dial to spell out the answer</p>
    </div>

    <!-- Cryptex -->
    <div class="flex justify-center">
      <div class="cryptex-body" :class="{ 'animate-shake': error }">
        <!-- End cap left -->
        <div class="cryptex-cap cryptex-cap-left"></div>

        <!-- Dials -->
        <div class="flex">
          <div
            v-for="(dialPos, index) in dials"
            :key="index"
            class="cryptex-dial-wrapper"
          >
            <!-- Up arrow -->
            <button
              @click="rotateDial(index, 'up')"
              class="dial-arrow dial-arrow-up"
              aria-label="Rotate up"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 pointer-events-none">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </button>

            <!-- Dial display -->
            <div class="dial-window">
              <span class="dial-letter-adjacent">{{ getLetterAt(index, -1) }}</span>
              <span class="dial-letter-current">
                {{ getLetterAt(index, 0) }}
              </span>
              <span class="dial-letter-adjacent">{{ getLetterAt(index, 1) }}</span>
            </div>

            <!-- Down arrow -->
            <button
              @click="rotateDial(index, 'down')"
              class="dial-arrow dial-arrow-down"
              aria-label="Rotate down"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 pointer-events-none">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>

        <!-- End cap right -->
        <div class="cryptex-cap cryptex-cap-right"></div>
      </div>
    </div>

    <!-- Submit -->
    <div class="max-w-md mx-auto">
      <button
        @click="submit"
        class="btn-primary w-full"
      >
        Unlock Cryptex
      </button>
    </div>
  </div>
</template>

<style scoped>
.cryptex-body {
  display: flex;
  align-items: center;
  background: linear-gradient(180deg, #d4a853 0%, #b8860b 30%, #cd9b1d 50%, #b8860b 70%, #d4a853 100%);
  border-radius: 12px;
  padding: 4px 0;
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  overflow: visible;
}

.cryptex-cap {
  width: 14px;
  min-height: 80px;
  background: linear-gradient(180deg, #c9a84c 0%, #a67c00 50%, #c9a84c 100%);
  box-shadow: inset 0 2px 3px rgba(255, 255, 255, 0.3), inset 0 -2px 3px rgba(0, 0, 0, 0.2);
}
.cryptex-cap-left {
  border-radius: 8px 0 0 8px;
}
.cryptex-cap-right {
  border-radius: 0 8px 8px 0;
}

.cryptex-dial-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.dial-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 22px;
  color: rgba(120, 80, 20, 0.7);
  cursor: pointer;
  transition: color 0.15s, transform 0.1s;
  background: none;
  border: none;
  padding: 0;
}
.dial-arrow:hover {
  color: rgba(80, 40, 0, 0.95);
  transform: scale(1.2);
}
.dial-arrow:active {
  transform: scale(0.95);
}

.dial-window {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 72px;
  background: linear-gradient(180deg, #a67c00 0%, #c9a84c 15%, #f0d990 50%, #c9a84c 85%, #a67c00 100%);
  border-left: 1px solid rgba(0, 0, 0, 0.15);
  border-right: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow:
    inset 0 0 8px rgba(0, 0, 0, 0.15),
    inset 2px 0 4px rgba(0, 0, 0, 0.1),
    inset -2px 0 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  user-select: none;
}

.dial-window::before,
.dial-window::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(139, 90, 20, 0.5);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}
.dial-window::before { top: 22px; }
.dial-window::after { bottom: 22px; }

.dial-letter-adjacent {
  font-size: 12px;
  font-weight: 500;
  color: rgba(100, 60, 10, 0.35);
  line-height: 22px;
  font-family: 'Georgia', serif;
}

.dial-letter-current {
  font-size: 22px;
  font-weight: 700;
  color: #4a2800;
  line-height: 28px;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.3);
  font-family: 'Georgia', serif;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-6px); }
  30% { transform: translateX(5px); }
  45% { transform: translateX(-4px); }
  60% { transform: translateX(3px); }
  75% { transform: translateX(-2px); }
}
.animate-shake {
  animation: shake 0.5s ease-in-out;
}

@media (max-width: 400px) {
  .dial-window {
    width: 28px;
    height: 64px;
  }
  .dial-letter-current {
    font-size: 18px;
  }
  .dial-arrow {
    width: 28px;
  }
}
</style>
