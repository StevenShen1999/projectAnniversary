<script setup>
import { ref, computed } from 'vue'
import { checkAnswer } from '../../data/puzzles'

const props = defineProps(['puzzle'])
const emit = defineEmits(['solved'])

const part1 = ref('')
const part2 = ref('')
const part3 = ref('')
const error = ref(false)

const part1Input = ref(null)
const part2Input = ref(null)
const part3Input = ref(null)

const fullAnswer = computed(() => `${part1.value}-${part2.value}-${part3.value}`)

const onInput = (part, event) => {
  const value = event.target.value.replace(/\D/g, '').slice(0, 2)
  if (part === 1) {
    part1.value = value
    if (value.length === 2) part2Input.value?.focus()
  } else if (part === 2) {
    part2.value = value
    if (value.length === 2) part3Input.value?.focus()
  } else {
    part3.value = value
  }
}

const submit = async () => {
  if (await checkAnswer(6, fullAnswer.value)) {
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
    </div>

    <div class="max-w-md mx-auto">
      <div
        class="flex items-center justify-center gap-3 mb-6"
        :class="{ 'animate-shake': error }"
      >
        <input
          ref="part1Input"
          :value="part1"
          @input="onInput(1, $event)"
          type="text"
          inputmode="numeric"
          maxlength="2"
          placeholder="__"
          class="w-20 h-16 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-300"
          :class="{
            'border-rose-300 focus:border-rose-500': !error,
            'border-red-500 bg-red-50': error
          }"
        />
        <span class="text-3xl font-bold text-rose-400">-</span>
        <input
          ref="part2Input"
          :value="part2"
          @input="onInput(2, $event)"
          type="text"
          inputmode="numeric"
          maxlength="2"
          placeholder="__"
          class="w-20 h-16 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-300"
          :class="{
            'border-rose-300 focus:border-rose-500': !error,
            'border-red-500 bg-red-50': error
          }"
        />
        <span class="text-3xl font-bold text-rose-400">-</span>
        <input
          ref="part3Input"
          :value="part3"
          @input="onInput(3, $event)"
          type="text"
          inputmode="numeric"
          maxlength="2"
          placeholder="__"
          class="w-20 h-16 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-300"
          :class="{
            'border-rose-300 focus:border-rose-500': !error,
            'border-red-500 bg-red-50': error
          }"
          @keyup.enter="submit"
        />
      </div>

      <button
        @click="submit"
        class="btn-primary w-full"
      >
        Submit Answer
      </button>
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
</style>
