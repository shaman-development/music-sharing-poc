<script lang="ts" setup>
import {useUser} from "@/stores/user";
import {storeToRefs} from "pinia";
import {onMounted, ref, toValue} from "vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import supabase from "@/plugins/supabase";

const userStore = useUser();
const { profile } = storeToRefs(userStore);

const usernameValue = ref(toValue(profile.value?.username));
const errorMessage = ref();
const isSuccess = ref(false);

const handleUsernameChange = async () => {
  if(!profile.value?.id) return;
  if (!usernameValue.value) return errorMessage.value = 'Username cannot be empty';

  errorMessage.value = null;
  isSuccess.value = false;

  const { error } = await supabase.from('profiles').update({ username: usernameValue.value }).eq('id', profile.value.id);

  if (error) return errorMessage.value = error.message;

  profile.value.username = usernameValue.value;
  isSuccess.value = true;
}


</script>

<template>
  <div>
    <h1 class="green">Settings</h1>

    <h2>Change username</h2>
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
      <button type="submit">Change username</button>
    </form>
  </div>
</template>