<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import SlideContainer from '../components/wrapped/SlideContainer.vue'

const store = useGameStore()
</script>

<template>
  <div class="min-h-screen relative z-10 bg-gradient-to-br from-rose-900 via-pink-800 to-rose-900">
    <SlideContainer />
  </div>
</template>
