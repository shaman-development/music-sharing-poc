<script lang="ts" setup>
import { getSongIdFromUrl } from '@/utils/spotify'
import { computed } from 'vue'
import SpotifyPlayer from '@/components/SpotifyPlayer.vue'
import CardWrapper from '@/components/CardWrapper.vue'
import { ROUTE_NAME } from '@/constants/router'
import { formatDate, formatDateToIsoString } from '@/utils/date'

const props = defineProps<{
  authorId?: string
  authorName: string
  createdAt: string | number | Date
  content: string
}>()

const spotifySongId = computed(() => getSongIdFromUrl(props.content))
</script>

<template>
  <CardWrapper class="single-post">
    <div class="single-post__header">
      <time :datetime="formatDateToIsoString(createdAt)">{{ formatDate(createdAt) }}</time>
      <span class="single-post__author"
        >By:
        <component
          :is="authorId ? 'RouterLink' : 'span'"
          class="green"
          :to="{ name: ROUTE_NAME.PROFILE, params: { id: authorId } }"
          >{{ authorName }}</component
        ></span
      >
    </div>
    <div class="single-post__content">
      <SpotifyPlayer v-if="spotifySongId" :songId="spotifySongId" />
      <p>
        <a :href="content" target="_blank">Click to open in spotify</a>
      </p>
    </div>
  </CardWrapper>
</template>

<style lang="scss" scoped>
.single-post {
  &__header {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--color-border);
    padding: 0.25rem 0 0.5rem;
  }

  &__content {
    padding: 1rem 0 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
