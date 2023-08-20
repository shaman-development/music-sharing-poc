<script setup lang="ts">
import {RouterView, useRouter} from 'vue-router'
import supabase from '@/plugins/supabase'
import {ROUTE_NAME} from '@/constants/router'
import {useUser} from '@/stores/user'
import {storeToRefs} from 'pinia'
import {onMounted, ref} from "vue";
import {isNotificationPermitted, requestPermission} from "@/utils/notifications";
import ReloadPrompt from '@/components/ReloadPrompt.vue'
import NotificationPermissionPrompt from "@/components/NotificationPermissionPrompt.vue";

const router = useRouter()
const userStore = useUser()
const {user, profile} = storeToRefs(userStore)
const {clearUser} = userStore
const handleLogout = async () => {
  const {error} = await supabase.auth.signOut()

  if (error) return console.error(error)

  clearUser()
  router.push({name: ROUTE_NAME.LOGIN})
}

const isNavigationOpen = ref(false);

onMounted(async () => {
  await requestPermission();
})
</script>

<template>
<!--  <ReloadPrompt />-->
  <NotificationPermissionPrompt />

  <header class="header">
    <RouterLink class="header__link" :to="{ name: ROUTE_NAME.FEED }">
      <img alt="Vue logo" class="header__logo" src="/logo.svg" width="125" height="125"/>
    </RouterLink>
  </header>

  <template v-if="user">
    <button @click="isNavigationOpen = !isNavigationOpen" class="navigation__toggle" :class="{ 'navigation__toggle--open': isNavigationOpen }">
      <span class="navigation__hamburger">
        <span class="navigation__hamburger-line"></span>
        <span class="navigation__hamburger-line"></span>
        <span class="navigation__hamburger-line"></span>
      </span>
    </button>
    <nav class="navigation" :class="{ 'navigation--open': isNavigationOpen }">
      <ul class="navigation__list">
        <li class="navigation__element">
          <RouterLink class="navigation__link" :to="{ name: ROUTE_NAME.CREATE_POST }"
          >Add post
          </RouterLink
          >
        </li>
        <li class="navigation__element">
          <RouterLink class="navigation__link" :to="{ name: ROUTE_NAME.FEED }">Feed</RouterLink>
        </li>
        <li class="navigation__element">
          <RouterLink
              class="navigation__link"
              :to="{ name: ROUTE_NAME.PROFILE, params: { id: user.id } }"
          >My profile
          </RouterLink>
        </li>
        <li class="navigation__element">
          <RouterLink class="navigation__link" :to="{ name: ROUTE_NAME.SEARCH }">Search</RouterLink>
        </li>
        <li class="navigation__element">
          <RouterLink class="navigation__link" :to="{ name: ROUTE_NAME.SETTINGS }"
          >Settings
          </RouterLink
          >
        </li>
        <li class="navigation__element">
          <button class="navigation__logout" @click="handleLogout">Logout</button>
        </li>
      </ul>
    </nav>


    <div v-if="profile" class="greeting">
      <h1 class="greeting__heading">
        Hello <span class="greeting__username">{{ profile?.username }}</span> 👋
      </h1>
    </div>
  </template>

  <main class="main">
    <RouterView/>
  </main>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;

  &__link {
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__logo {
    display: inline-block;
  }
}

.navigation {
  border-bottom: 1px solid var(--color-border);
  padding: 100px 0.5rem 0.5rem;

  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100vh;
  width: 300px;
  background: var(--color-background-soft);
  border-left: 1px solid var(--color-border);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 10;

  &__hamburger {
    position: relative;
  }

  &__hamburger-line {
    width: 35px;
    height: 4px;
    background-color: var(--color-text);
    display: block;
    margin: 6px auto;
    transition: all 0.3s ease-in-out;
  }

  &__toggle {
    z-index: 11;
    display: block;
    position: fixed;
    top: 25px;
    right: 25px;
    margin: 0;
    padding: 0;
    border-radius: 0.5rem;
    width: 50px;
    height: 50px;
    border: none;
    background: var(--color-background-soft);
    cursor: pointer;

    &--open .navigation__hamburger-line:nth-child(2){
      opacity: 0;
    }

    &--open .navigation__hamburger-line:nth-child(1){
      transform: translateY(10px) rotate(45deg);
    }

    &--open .navigation__hamburger-line:nth-child(3){
      transform: translateY(-10px) rotate(-45deg);
    }
  }

  &__list {
    padding: 0;
    list-style: none;
  }

  &__element {
    &:not(:last-child) .navigation__link {
      margin-bottom: 0.25rem;
    }
  }

  &__link {
    display: block;
    padding: 0.25rem;
  }

  &__logout {
    display: block;
    padding: 0.5rem 1rem;
    background: none;
    border: 1px solid var(--color-green);
    color: var(--color-green);
    margin-top: 1.5rem;
    cursor: pointer;
    transition: background-color 0.4s ease;

    &:hover {
      background-color: var(--color-green-hover);
    }
  }

  &--open {
    transform: translateX(0);
  }
}

.greeting {
  text-align: center;
  margin-bottom: 1.5rem;

  &__username {
    color: var(--color-green);
  }
}
</style>
