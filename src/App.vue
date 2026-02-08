<script setup>
import { RouterView } from 'vue-router'
import FloatingHearts from './components/FloatingHearts.vue'
</script>

<template>
  <div class="min-h-screen relative">
    <FloatingHearts />
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>
