<template>
  <div class="card">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.card {
  border-radius: 8px;
  background: var(--color-background-mute);
  padding: 0.5rem;
}
</style>