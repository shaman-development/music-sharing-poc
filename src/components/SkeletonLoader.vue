<script lang="ts" setup>

</script>

<template>
  <div class="skeleton-loader"></div>
</template>

<style lang="scss" scoped>
@keyframes loading {
  to {
    background-position-x: -20%;
  }
}
.skeleton-loader {
  position: relative;
  border-radius: 8px;
  height: 269px;
  background: linear-gradient(100deg, rgba(40, 40, 40, 0) 40%, rgba(40, 40, 40, .5) 50%, rgba(40, 40, 40, 0) 60% ) var(--color-background-soft);
  background-size: 200% 100%;
  background-position-x: 180%;
  animation: 1s loading ease-in-out infinite;

}
</style>