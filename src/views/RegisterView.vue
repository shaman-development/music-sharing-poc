<script lang="ts" setup>
import {reactive, ref} from "vue";
import {ROUTE_NAME} from '@/constants/router';
import supabase from "@/plugins/supabase";
import NotificationBanner from "@/components/NotificationBanner.vue";

const registrationForm = reactive({
  username: '',
  email: '',
  password: '',
});

const errorMessage = ref();
const isSuccess = ref(false);

const handleSubmit = async () => {
  errorMessage.value = null;
  isSuccess.value = false;

  const { data, error } = await supabase.auth.signUp(
      {
        email: registrationForm.email,
        password: registrationForm.password,
        options: {
          data: {
            username: registrationForm.username,
          }
        }
      }
  )

  if (error) {
    return errorMessage.value= error.message;
  }

  isSuccess.value = true;
}
</script>

<template>
<div class="register-view">
  <form @submit.prevent="handleSubmit" class="register-view__form">
    <div class="register-view__field">
      <label class="register-view__label">Username</label>
      <input v-model="registrationForm.username" class="register-view__input" type="text" minlength="1" maxlength="20" required />
    </div>
    <div class="register-view__field">
      <label class="register-view__label">Email</label>
      <input v-model="registrationForm.email" class="register-view__input" type="email" required />
    </div>
    <div class="register-view__field">
      <label class="register-view__label">Password</label>
      <input v-model="registrationForm.password" class="register-view__input" type="password" minlength="6" required />
    </div>

    <button class="register-view__submit" type="submit">Sign Up</button>
  </form>

  <div class="register-view__hint">You already have an account? <RouterLink :to="{ name: ROUTE_NAME.LOGIN }">Sign in</RouterLink></div>

  <NotificationBanner v-if="errorMessage" type="error">
    <p>{{ errorMessage }}</p>
  </NotificationBanner>
  <NotificationBanner v-if="isSuccess" type="success">
    <p>You successfully created new account. <RouterLink :to="{ name: ROUTE_NAME.LOGIN }">Click here to sign in</RouterLink></p>
  </NotificationBanner>
</div>
</template>

<style lang="scss" scoped>
.register-view {
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

  &__submit, &__field {
    margin-top: 1rem;
    width: 100%;
  }

  &__submit {
    padding: 0.5rem;
  }

  &__notification{
    padding: 2rem;
    border: solid 2px;
    text-align: center;
    width: 100%;
    margin-top: 2rem;

    &--error {
      border-color: var(--color-red);
      color: var(--color-red);
    }

    &--success {
      border-color: var(--color-green);
      color: var(--color-text);
    }
  }
}
</style>