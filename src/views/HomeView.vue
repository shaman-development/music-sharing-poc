<script setup lang="ts">
import { ROUTE_NAME } from "@/constants/router";
</script>

<template>
  <div class="home-view">
    <div class="home-view__header">
      <h1 class="green">MusicMind</h1>
      <p class="home-view__description">Share what's playing in your head</p>
    </div>
    <div class="home-view__content">
      <RouterLink class="home-view__link" :to="{ name: ROUTE_NAME.LOGIN }">Sign In</RouterLink>
      <RouterLink class="home-view__link" :to="{ name: ROUTE_NAME.REGISTER }">Sign Up</RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  &__header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  &__description {
    font-size: 1.2rem;
  }

  &__content {
    display: flex;
    justify-content: space-around;
    padding: 2rem;
  }

  &__link {
    font-size: 1.5rem;
    margin: 0.5rem;
  }
}
</style>
