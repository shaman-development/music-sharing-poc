<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ROUTE_NAME } from '@/constants/router'
import supabase from '@/plugins/supabase'
import { useRouter } from 'vue-router'
import NotificationBanner from "@/components/NotificationBanner.vue";

const router = useRouter()

const loginForm = reactive({
  email: '',
  password: ''
})

const errorMessage = ref()

const handleSubmit = async (e: Event) => {
  errorMessage.value = null

  const { error } = await supabase.auth.signInWithPassword({
    email: loginForm.email,
    password: loginForm.password
  })

  if (error) {
    return (errorMessage.value = error.message)
  }

  router.push({ name: ROUTE_NAME.FEED })
}
</script>

<template>
  <div class="login-view">
    <NotificationBanner
        v-if="errorMessage" type="error">
      <p>{{ errorMessage }}</p>
    </NotificationBanner>
    <form @submit.prevent="handleSubmit" class="login-view__form">
      <div class="login-view__field">
        <label class="login-view__label">Email</label>
        <input v-model="loginForm.email" class="login-view__input" type="email" required />
      </div>
      <div class="login-view__field">
        <label class="login-view__label">Password</label>
        <input v-model="loginForm.password" class="login-view__input" type="password" required />
      </div>

      <button class="login-view__submit" type="submit">Sign In</button>
    </form>

    <div class="login-view__hint">
      You don't have an account?
      <RouterLink :to="{ name: ROUTE_NAME.REGISTER }">Sign Up</RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  &__hint {
    margin-top: 1rem;
  }

  &__form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
  }

  &__field {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    font-size: 1.2rem;
  }

  &__input {
    width: 100%;
  }

  &__submit,
  &__field {
    margin-top: 1rem;
    width: 100%;
  }

  &__submit {
    padding: 0.5rem;
  }
}
</style>
