<script setup>
import { ref, onMounted } from 'vue'

const hearts = ref([])

onMounted(() => {
  // Create floating hearts with random positions and delays
  for (let i = 0; i < 15; i++) {
    hearts.value.push({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      size: 20 + Math.random() * 30,
      duration: 12 + Math.random() * 8
    })
  }
})
</script>

<template>
  <div class="hearts-bg">
    <svg
      v-for="heart in hearts"
      :key="heart.id"
      class="floating-heart text-rose-400"
      :style="{
        left: heart.left + '%',
        width: heart.size + 'px',
        height: heart.size + 'px',
        animationDelay: heart.delay + 's',
        animationDuration: heart.duration + 's'
      }"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  </div>
</template>
