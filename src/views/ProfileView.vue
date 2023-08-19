<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import supabase from '@/plugins/supabase'
import NotificationBanner from '@/components/NotificationBanner.vue'
import SinglePost from '@/components/SinglePost.vue'
import { useUser } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { ROUTE_NAME } from '@/constants/router'

const route = useRoute()

const userStore = useUser()
const { profile, follows } = storeToRefs(userStore)
const { checkIfFollowing } = userStore

const userProfile = ref()
const userPosts = ref()
const errorMessage = ref()

const fetchUserProfile = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', route.params?.id)

  if (error) return (errorMessage.value = error.message)

  userProfile.value = data[0]

  const { data: postsData, error: postsError } = await supabase
    .from('posts')
    .select()
    .eq('author_id', route.params?.id)

  if (postsError) return (errorMessage.value = postsError.message)

  userPosts.value = postsData
}

fetchUserProfile()

watch(() => route.params?.id, fetchUserProfile)

const isMyProfile = computed(() => userProfile.value?.id === profile.value?.id)
const isFollowing = computed(() => typeof route.params?.id === 'string' && checkIfFollowing(route.params?.id))

const handleFollow = async () => {
  if (!profile.value || !userProfile.value || isMyProfile.value) return

  if (isFollowing.value) {
    //   unfollow
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', profile.value.id)
      .eq('following_id', userProfile.value.id)

    if (error) return (errorMessage.value = error.message)

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

    if (error) return (errorMessage.value = error.message)
    follows.value = [
      ...follows.value,
      {
        follower_id: profile.value.id,
        following_id: userProfile.value.id,
        username: userProfile.value.username
      }
    ]
  }
}

const isFollowsVisible = ref(false)

const toggleFollowsVisible = () => (isFollowsVisible.value = !isFollowsVisible.value)
</script>

<template>
  <div>
    <NotificationBanner v-if="errorMessage" type="error">
      <p>{{ errorMessage }}</p>
    </NotificationBanner>
    <div v-if="userProfile">
      <div class="profile-view__header">
        <h1 class="profile-view__heading">
          @<span class="green">{{ userProfile?.username }}</span>
        </h1>

        <button
          v-if="profile && userProfile && profile.id !== userProfile.id"
          @click="handleFollow"
        >
          {{ isFollowing ? 'Unfollow' : 'Follow' }}
        </button>
      </div>

      <div v-if="isMyProfile" class="profile-view__follows">
        <button @click="toggleFollowsVisible">People you follow</button>
        <div v-show="isFollowsVisible" class="profile-view__follows-content">
          <ul v-if="follows?.length">
            <li v-for="{ following_id, username } in follows" :key="following_id">
              <RouterLink :to="{ name: ROUTE_NAME.PROFILE, params: { id: following_id } }">{{
                username
              }}</RouterLink>
            </li>
          </ul>
          <p v-else class="profile-view__empty">You are not following anyone yet.</p>
        </div>
      </div>

      <div v-if="userPosts" class="profile-view__posts">
        <p v-if="!userPosts.length" class="profile-view__empty">
          <span v-if="!isMyProfile">This user has not shared anything yet :(</span>
          <span v-else
            >You haven't posted anything yet.
            <RouterLink :to="{ name: ROUTE_NAME.CREATE_POST }"
              >Share whats on your mind</RouterLink
            ></span
          >
        </p>
        <SinglePost
          v-else
          v-for="{ id, created_at, content } in userPosts"
          :key="id"
          :content="content"
          :author-name="userProfile.username"
          :author-id="userProfile.id"
          :created-at="created_at"
          class="profile-view__post"
        />
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
}
</style>
