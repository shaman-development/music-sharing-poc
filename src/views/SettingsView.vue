<script lang="ts" setup>
import {useUser} from "@/stores/user";
import {storeToRefs} from "pinia";
import {onMounted, ref, toValue} from "vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import supabase from "@/plugins/supabase";
import LoadingAnimation from "@/components/LoadingAnimation.vue";

const userStore = useUser();
const { profile } = storeToRefs(userStore);

const usernameValue = ref(toValue(profile.value?.username));
const errorMessage = ref();
const isSuccess = ref(false);
const isChangingUsername = ref(false);
const handleUsernameChange = async () => {
  if(!profile.value?.id || isChangingUsername.value) return;

  isChangingUsername.value = true;
  if (!usernameValue.value) return errorMessage.value = 'Username cannot be empty';

  errorMessage.value = null;
  isSuccess.value = false;

  const { error } = await supabase.from('profiles').update({ username: usernameValue.value }).eq('id', profile.value.id);

  if (error) {
    isChangingUsername.value = false;
    return errorMessage.value = error.message;
  }

  profile.value.username = usernameValue.value;
  isSuccess.value = true;
  isChangingUsername.value = false;
}


</script>

<template>
  <div>
    <h1 class="green">Settings</h1>

    <NotificationBanner v-if="errorMessage" type="error">
      <p>{{ errorMessage }}</p>
    </NotificationBanner>
    <NotificationBanner v-if="isSuccess" type="success">
      <p>Successfully changed username!</p>
    </NotificationBanner>
    <form class="form" @submit.prevent="handleUsernameChange" autocomplete="off">
      <div class="field">
        <label for="username">Username</label>
        <input v-model="usernameValue" id="username" type="text" required />
      </div>
      <button :disabled="isChangingUsername" type="submit">
        <LoadingAnimation v-if="isChangingUsername" />
        <span v-else>Change username</span>
      </button>
    </form>
  </div>
</template>