<script setup lang="ts">
import { Blog } from "vuepress-theme-hope/blog";
import HitokotoTyping from "../components/HitokotoTyping.vue";
</script>

<template>
  <Blog>
    <template #heroInfo="hero">
      <div class="custom-hero-info" :style="hero.style">
        <h1 v-if="hero.text" class="hero-title">{{ hero.text }}</h1>
        <HitokotoTyping />
      </div>
    </template>
  </Blog>
</template>

<style scoped>
.custom-hero-info {
  text-align: center;
}

.hero-title {
  margin: 0 auto;
  padding: 0;
  font-size: clamp(2rem, 5vw, 3.2rem);
  line-height: 1.25;
  color: inherit;
}
</style>
