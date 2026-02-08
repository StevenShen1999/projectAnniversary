<script setup>
import { wrappedContent } from '../../data/wrapped-content'
</script>

<template>
  <div class="text-center text-white max-w-2xl mx-auto">
    <div class="text-8xl mb-8 animate-heart-beat">💕</div>

    <h1 class="text-5xl md:text-7xl font-bold mb-4">
      {{ wrappedContent.intro.title }}
    </h1>

    <p class="text-2xl md:text-3xl text-white/80 mb-8">
      {{ wrappedContent.intro.subtitle }}
    </p>

    <div class="w-24 h-1 bg-white/30 rounded-full mx-auto mb-8"></div>

    <p class="text-lg text-white/60">
      A special look back at us
    </p>
  </div>
</template>
