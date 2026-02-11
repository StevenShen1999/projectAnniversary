<script setup>
import { ref, onMounted } from 'vue'
import { wrappedContent } from '../../data/wrapped-content'

const visibleItems = ref([])

onMounted(() => {
  wrappedContent.firsts.forEach((_, index) => {
    setTimeout(() => visibleItems.value.push(index), 300 + index * 400)
  })
})
</script>

<template>
  <div class="text-white max-w-4xl mx-auto px-4">
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
      Our Many Firsts
    </h2>

    <div class="grid md:grid-cols-2 gap-6">
      <transition v-for="(item, index) in wrappedContent.firsts" :key="index" name="scale">
        <div
          v-if="visibleItems.includes(index)"
          class="bg-white/10 backdrop-blur-sm rounded-3xl p-4 transform hover:scale-105 transition-transform duration-300"
        >
          <!-- Photo type -->
          <div v-if="item.type === 'photo'" class="aspect-square bg-white/20 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
            <img
              v-if="item.src"
              :src="item.src"
              :alt="item.caption"
              class="w-full h-full object-cover"
              @error="$event.target.style.display = 'none'"
            />
            <span v-else class="text-6xl">{{ item.icon }}</span>
          </div>

          <!-- Voice message -->
          <div v-else-if="item.type === 'voice'" class="aspect-square bg-white/10 rounded-2xl mb-4 flex flex-col items-center justify-center gap-4 p-6">
            <span class="text-6xl">{{ item.icon }}</span>
            <audio v-if="item.src" controls class="w-full max-w-[220px]">
              <source :src="item.src" type="audio/ogg" />
            </audio>
          </div>

          <!-- Video message -->
          <div v-else-if="item.type === 'video'" class="aspect-square bg-white/10 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
            <video v-if="item.src" controls playsinline class="w-full h-full object-cover rounded-2xl">
              <source :src="item.src" />
            </video>
            <span v-else class="text-6xl">{{ item.icon }}</span>
          </div>

          <p class="text-center text-lg font-medium">
            {{ item.caption }}
          </p>
          <p v-if="item.date" class="text-center text-white/60 text-sm mt-1">
            {{ item.date }}
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>
