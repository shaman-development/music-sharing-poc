<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const intervalMS = 60 * 60 * 1000

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, intervalMS)
  }
})

const close = async () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div
      v-if="offlineReady || needRefresh"
      class="reload-prompt"
      role="alert"
  >
    <div class="reload-prompt__message">
      <span v-if="offlineReady">
        App ready to work offline
      </span>
      <span v-else>
        New version of the app is available, click on update button to get the nev version.
      </span>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker()">
      Update
    </button>
    <button @click="close">
      Close
    </button>
  </div>
</template>

<style lang="scss" scoped>
.reload-prompt {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  background: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  z-index: 1;
  text-align: left;
  box-shadow: 3px 4px 5px 0 var(--color-border);

  &__message {
    margin-bottom: 8px;
  }
}
</style>