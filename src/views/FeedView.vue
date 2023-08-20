<script lang="ts" setup>
import { useUser } from '@/stores/user'
import { onMounted, reactive, ref } from 'vue'
import supabase from '@/plugins/supabase'
import { storeToRefs } from 'pinia'
import NotificationBanner from '@/components/NotificationBanner.vue'
import SinglePost from '@/components/SinglePost.vue'
import type {DetailedPost} from '@/types/common.types'
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import LoadingAnimation from "@/components/LoadingAnimation.vue";

const userStore = useUser()
const { profile, followIds } = storeToRefs(userStore)

const PAGE_SIZE = 10

const feed = reactive<DetailedPost[]>([])

const errorMessage = ref();
const isEverythingLoaded = ref(false);

const isFeedLoading = ref(true);
const fetchFeedPage = async () => {
  isFeedLoading.value = true;
  const { data, error } = await supabase
    .from('detailed_posts')
    .select()
    .in('author_id', followIds.value)
    .not('post_id', 'in', `(${feed.map(post => post.post_id).join(',')})`)
    .order('created_at', { ascending: false })
    .range(0, PAGE_SIZE - 1)

    // TODO: Probably possible to optimize
    // .range(feed.length, feed.length + PAGE_SIZE - 1)

  if (error) {
    isFeedLoading.value = false
    return (errorMessage.value = error.message)
  }

  if(!data.length) {
    isFeedLoading.value = false
    return (isEverythingLoaded.value = true);
  }

  feed.push(...(data as DetailedPost[]))

  isFeedLoading.value = false
  if (data.length < PAGE_SIZE) return (isEverythingLoaded.value = true);
}

fetchFeedPage()
</script>

<template>
  <div>
    <NotificationBanner v-if="errorMessage" type="error"
      ><p>{{ errorMessage }}</p></NotificationBanner
    >
    <div>
      <p v-if="!feed?.length && !isFeedLoading" class="feed-view__empty">There is nothing on your feed yet.</p>
      <div v-else-if="feed.length">
        <SinglePost
          v-for="{ post_id, created_at, content, author_id, author_username } in feed"
          :key="post_id"
          :content="content"
          :author-name="author_username"
          :author-id="author_id"
          :created-at="created_at"
          class="feed-view__post"
        />
        <button v-if="!isEverythingLoaded" :disabled="isFeedLoading" @click="fetchFeedPage" class="feed-view__load-more">

          <LoadingAnimation v-if="isFeedLoading" />
          <span v-else>Load more posts</span>
        </button>
        <p v-else class="feed-view__done">That's all for now</p>
      </div>
      <div v-if="isFeedLoading">
        <SkeletonLoader class="feed-view__post" />
        <SkeletonLoader class="feed-view__post" />
        <SkeletonLoader class="feed-view__post" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.feed-view {
  &__load-more {
    width: 100%;
    margin-bottom: 1rem;
  }

  &__empty {
    font-size: 1.2rem;
  }

  &__post {
    margin-bottom: 1rem;
  }

  &__done {
    text-align: center;
  }
}
</style>
