<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getSongIdFromUrl } from '@/utils/spotify'

const props = defineProps<{
  url?: string
  songId?: string
}>()

const songId = computed(() => props.songId ?? getSongIdFromUrl(props.url))
</script>

<template>
  <iframe
    style="border-radius: 12px"
    :src="`https://open.spotify.com/embed/track/${songId}?utm_source=generator&theme=0`"
    width="100%"
    height="152"
    frameBorder="0"
    :allowfullscreen="undefined"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
  ></iframe>
</template>

<style lang="scss" scoped>
.spotify-player{
  &__before-preview {
    border-radius: 12px;
    height: 152px;
    width: 100%;
    background: var(--color-background-soft);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>