<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, reactive, ref, watch } from 'vue'
import supabase from '@/plugins/supabase'
import NotificationBanner from '@/components/NotificationBanner.vue'
import SinglePost from '@/components/SinglePost.vue'
import { useUser } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { ROUTE_NAME } from '@/constants/router'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import type { Post } from '@/types/common.types'

const PAGE_SIZE = 10

const route = useRoute()

const userStore = useUser()
const { profile, follows } = storeToRefs(userStore)
const { checkIfFollowing } = userStore

const userProfile = ref()
const userPosts = reactive<Post[]>([])
const errorMessage = ref()
const isFetchingProfile = ref(false)
const isFetchingPosts = ref(false)
const isAllPostsLoaded = ref(false)

const fetchUserProfile = async () => {
  isFetchingProfile.value = true
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', route.params?.id)

  if (error) {
    isFetchingProfile.value = false
    return (errorMessage.value = error.message)
  }

  userProfile.value = data[0]
  isFetchingProfile.value = false

  await fetchUserPosts()
}

const fetchUserPosts = async () => {
  isFetchingPosts.value = true
  const { data, error } = await supabase
    .from('posts')
    .select()
    .order('created_at', { ascending: false })
    .eq('author_id', route.params?.id)
    .not('id', 'in', `(${userPosts.map((post) => post.id).join(',')})`)
    .range(0, PAGE_SIZE - 1)

  if (error) {
    isFetchingPosts.value = false
    return (errorMessage.value = error.message)
  }

  if (!data.length) {
    isFetchingPosts.value = false
    return (isAllPostsLoaded.value = true)
  }

  userPosts.push(...(data as Post[]))

  isFetchingPosts.value = false;
  if (data.length < PAGE_SIZE) return (isAllPostsLoaded.value = true)
}

fetchUserProfile()

watch(() => route.params?.id, fetchUserProfile)

const isMyProfile = computed(() => userProfile.value?.id === profile.value?.id)
const isFollowing = computed(
  () => typeof route.params?.id === 'string' && checkIfFollowing(route.params?.id)
)
const isChangingFollowingState = ref(false)
const handleFollow = async () => {
  if (!profile.value || !userProfile.value || isMyProfile.value || isChangingFollowingState.value)
    return
  isChangingFollowingState.value = true
  if (isFollowing.value) {
    //   unfollow
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', profile.value.id)
      .eq('following_id', userProfile.value.id)

    if (error) {
      isChangingFollowingState.value = false
      return (errorMessage.value = error.message)
    }

    follows.value = follows.value.filter(
      (follow) =>
        follow.follower_id !== profile.value!.id &&
        follow.following_id !== userProfile.value.username
    )
  } else {
    // follow
    const { error } = await supabase
      .from('followers')
      .insert({ following_id: userProfile.value.id })

    if (error) {
      isChangingFollowingState.value = false
      return (errorMessage.value = error.message)
    }
    follows.value = [
      ...follows.value,
      {
        follower_id: profile.value.id,
        following_id: userProfile.value.id,
        username: userProfile.value.username
      }
    ]
  }
  isChangingFollowingState.value = false
}

const isFollowsVisible = ref(false)

const toggleFollowsVisible = () => (isFollowsVisible.value = !isFollowsVisible.value)
</script>

<template>
  <div>
    <NotificationBanner v-if="errorMessage" type="error">
      <p>{{ errorMessage }}</p>
    </NotificationBanner>
    <div v-if="isFetchingProfile" class="profile-view__fetching-profile">
      <LoadingAnimation />
    </div>
    <div v-else-if="userProfile">
      <div class="profile-view__header">
        <h1 class="profile-view__heading">
          @<span class="green">{{ userProfile?.username }}</span>
        </h1>

        <button
          v-if="profile && userProfile && profile.id !== userProfile.id"
          :disabled="isChangingFollowingState"
          @click="handleFollow"
          class="profile-view__follow-button"
        >
          <LoadingAnimation v-if="isChangingFollowingState" />
          <span v-else>{{ isFollowing ? 'Unfollow' : 'Follow' }}</span>
        </button>
      </div>

      <div v-if="isMyProfile" class="profile-view__follows">
        <button @click="toggleFollowsVisible">People you follow</button>
        <div v-show="isFollowsVisible" class="profile-view__follows-content">
          <ul v-if="follows?.length">
            <li v-for="{ following_id, username } in follows" :key="following_id">
              <RouterLink :to="{ name: ROUTE_NAME.PROFILE, params: { id: following_id } }"
                >{{ username }}
              </RouterLink>
            </li>
          </ul>
          <p v-else class="profile-view__empty">You are not following anyone yet.</p>
        </div>
      </div>

      <div v-if="userPosts" class="profile-view__posts">
        <p v-if="!userPosts.length && !isFetchingPosts" class="profile-view__empty">
          <span v-if="!isMyProfile">This user has not shared anything yet :(</span>
          <span v-else
            >You haven't posted anything yet.
            <RouterLink :to="{ name: ROUTE_NAME.CREATE_POST }"
              >Share whats on your mind</RouterLink
            ></span
          >
        </p>
        <div v-else-if="userPosts.length">
          <SinglePost
            v-for="{ id, created_at, content } in userPosts"
            :key="id"
            :content="content"
            :author-name="userProfile.username"
            :author-id="userProfile.id"
            :created-at="created_at"
            class="profile-view__post"
          />
          <button v-if="!isAllPostsLoaded" :disabled="isFetchingPosts" @click="fetchUserPosts" class="profile-view__load-more">

            <LoadingAnimation v-if="isFetchingPosts" />
            <span v-else>
              Load more posts
            </span>
          </button>
          <p v-else class="profile-view__done">That's all for now</p>
        </div>
      </div>

      <div v-if="isFetchingPosts">
        <SkeletonLoader class="profile-view__post" />
        <SkeletonLoader class="profile-view__post" />
        <SkeletonLoader class="profile-view__post" />
      </div>
    </div>
    <div v-else class="profile-view__not-exist">This user does not exist</div>
  </div>
</template>

<style lang="scss" scoped>
.profile-view {
  &__heading {
    font-size: 1.5rem;
    margin: 0;
  }

  &__empty {
    font-size: 1.2rem;
  }

  &__not-exist {
    font-size: 1.5rem;
    text-align: center;
  }

  &__post {
    margin-bottom: 1rem;
  }

  &__header,
  &__follows,
  &__posts {
    padding: 1rem 0;

    &:not(:first-child) {
      border-top: 1px solid var(--color-border);
    }
  }

  &__follows-content {
    padding: 1rem 0;
  }

  &__follow-button {
    width: 120px;
  }

  &__done {
    text-align: center;
  }

  &__load-more {
    width: 100%;
    margin-bottom: 1rem;
  }

  &__fetching-profile {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }
}
</style>
