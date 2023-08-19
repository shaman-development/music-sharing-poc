<script setup lang="ts">
import { ref } from 'vue'
import supabase from '@/plugins/supabase'
import NotificationBanner from '@/components/NotificationBanner.vue'
import { ROUTE_NAME } from '@/constants/router'

const searchField = ref('')
const errorMessage = ref()
const results = ref()
const handleSearch = async () => {
  if (!searchField.value) return

  errorMessage.value = null
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .like('username', `%${searchField.value}%`)

  if (error) errorMessage.value = error.message
  results.value = data
}
</script>
<template>
  <div>
    <h1>Find your friend</h1>
    <NotificationBanner v-if="errorMessage" type="error">
      <p>{{ errorMessage }}</p>
    </NotificationBanner>
    <form class="form" @submit.prevent="handleSearch">
      <div class="field">
        <label for="searchField">Username</label>
        <input v-model="searchField" id="searchField" type="text" />
      </div>
      <button type="submit">Search</button>
    </form>
    <div v-if="results" class="results">
      <h2>Found users</h2>
      <ul>
        <li v-for="{ id, username } in results" :key="id">
          <RouterLink :to="{ name: ROUTE_NAME.PROFILE, params: { id } }">{{ username }}</RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.results {
  margin-top: 2rem;

  li {
    font-size: 1.3rem;
    font-weight: bold;
  }
}
</style>
