<script lang="ts" setup>
defineProps<{
  type: 'error' | 'success'
}>()
</script>

<template>
  <div class="notification" :class="{ 'notification--error': type === 'error', 'notification--success': type === 'success'}">
    <div class="notification__content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notification {
  padding: 2rem;
  border: solid 2px;
  text-align: center;
  width: 100%;
  margin-top: 2rem;

  &--error {
    border-color: var(--color-red);
    color: var(--color-red);
  }

  &--success {
    border-color: var(--color-green);
    color: var(--color-text);
  }
}
</style>