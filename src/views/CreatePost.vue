<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getSongIdFromUrl, isSpotifyUrl } from '@/utils/spotify'
import SinglePost from '@/components/SinglePost.vue'
import { useUser } from '@/stores/user'
import supabase from '@/plugins/supabase'
import NotificationBanner from '@/components/NotificationBanner.vue'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const sharedUrl =
  (typeof route.query?.url === 'string' && route.query?.url) ||
  (window.location.search && new URLSearchParams(window.location.search).get('url')) ||
  ''
const url = ref(sharedUrl)

const errorMessage = ref()
const isSuccess = ref(false)
const isSubmittingPost = ref(false)
const handleSubmit = async () => {
  if (!hasSongId.value) return
  isSubmittingPost.value = true
  errorMessage.value = null
  isSuccess.value = false

  const { error } = await supabase.from('posts').insert({ content: url.value })
  if (error) {
    errorMessage.value = error?.message
    isSuccess.value = false
  }

  isSuccess.value = true
  isSubmittingPost.value = false
  url.value = ''
}

const hasSongId = computed(() => !!getSongIdFromUrl(url.value))

const now = new Date()

const { username } = useUser()
</script>

<template>
  <div class="create-post">
    <NotificationBanner v-if="errorMessage" type="error">
      <p>{{ errorMessage }}</p>
    </NotificationBanner>
    <NotificationBanner v-if="isSuccess" type="success">
      <p>You've successfully shared whats on your mind</p>
    </NotificationBanner>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="field">
        <label for="content">Spotify song url</label>
        <input v-model="url" type="text" required />
      </div>

      <button :disabled="!hasSongId || isSubmittingPost" type="submit">
        <LoadingAnimation v-if="isSubmittingPost" />
        <span v-else>Submit</span>
      </button>
    </form>
    <SinglePost
      v-if="hasSongId && username"
      class="create-post__preview"
      :content="url"
      :author-name="username"
      :created-at="now"
    />
  </div>
</template>

<style lang="scss" scoped>
.create-post {
  &__preview {
    margin-top: 2rem;
  }
}
</style>
