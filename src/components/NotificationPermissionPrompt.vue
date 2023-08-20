<script setup lang="ts">

import {
  isNotificationDenied,
  isNotificationPermitted,
  isNotificationSupported,
  requestPermission
} from "@/utils/notifications";
import {onMounted, ref} from "vue";

const isSupported = ref(isNotificationSupported());
const isPermitted = ref(isNotificationPermitted());
const isDenied = ref(isNotificationDenied());

onMounted(() => {
  isSupported.value = isNotificationSupported();
  isPermitted.value = isNotificationPermitted();
  isDenied.value = isNotificationDenied();
})

const responded = ref(false);

const handleRequestPermission = async () => {
  const response = await requestPermission();
  console.log('notification permission', response);
  responded.value = true;
}
</script>

<template>
  <div
      v-if="!responded && isSupported && !isPermitted && !isDenied"
      class="reload-prompt"
      role="alert"
  >
    <div class="reload-prompt__message">
      For best experience please enable notifications.
    </div>
    <button @click="handleRequestPermission()">
      Enable notifications
    </button>
  </div>
</template>

<style lang="scss" scoped>
.reload-prompt {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 12px;
  background: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  z-index: 1;
  text-align: left;
  box-shadow: 3px 4px 5px 0 var(--color-border);
  max-width: 600px;
  width: calc(100% - 3rem);

  &__message {
    margin-bottom: 8px;
  }
}
</style>