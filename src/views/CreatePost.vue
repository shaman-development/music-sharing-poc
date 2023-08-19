<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getSongIdFromUrl, isSpotifyUrl } from '@/utils/spotify'
import SinglePost from '@/components/SinglePost.vue'
import { useUser } from '@/stores/user'
import supabase from '@/plugins/supabase'
import NotificationBanner from '@/components/NotificationBanner.vue'

const url = ref()

const errorMessage = ref()
const isSuccess = ref(false);
const handleSubmit = async () => {
  if (!hasSongId.value) return
  errorMessage.value = null
  isSuccess.value = true;

  const { error } = await supabase.from('posts').insert({ content: url.value })
  if (error) {
    errorMessage.value = error?.message
    isSuccess.value = false;
  }
}

const hasSongId = computed(() => !!getSongIdFromUrl(url.value))

const now = new Date();

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

      <button :disabled="!hasSongId" type="submit">Submit</button>
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