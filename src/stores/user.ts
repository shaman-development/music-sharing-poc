import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import supabase from '@/plugins/supabase'
import type { Profile, Follow } from '@/types/common.types'
import type { User } from '@supabase/supabase-js'

export const useUser = defineStore('user', () => {
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const follows = ref<Follow[]>([])

  const username = computed(() => profile.value?.username)

  const clearUser = () => {
    user.value = null
    profile.value = null
    follows.value = []
  }

  const fetchUserProfile = async () => {
    if (!user.value) return

    const { data, error } = await supabase.from('profiles').select().eq('id', user.value.id)

    if (error) throw new Error(error.message)

    profile.value = data[0]
    console.log('fetchUserpRofile', data, profile.value)
  }
  const fetchFollows = async () => {
    if (!user.value) return

    const { data, error } = await supabase
      .from('detailed_follows')
      .select()
      .eq('follower_id', user.value.id)

    console.log('fetchFollows', data, error)
    console.log('fetchFollows', user.value.id)
    if (error) throw new Error(error.message)

    follows.value = data as Follow[]
  }

  const checkIfFollowing = (id?: string) => {
    if (!id) return false
    return follows.value.some((follow) => follow.following_id === id)
  }

  const followIds = computed(() => follows.value.map((follow) => follow.following_id))

  return {
    user,
    profile,
    follows,
    followIds,
    username,
    clearUser,
    fetchUserProfile,
    fetchFollows,
    checkIfFollowing
  }
})
