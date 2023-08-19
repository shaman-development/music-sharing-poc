import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { ROUTE_NAME } from '@/constants/router'
import supabase from "@/plugins/supabase";
import {useUser} from "@/stores/user";
import {storeToRefs} from "pinia";

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean,
    requiredParams?: string[],
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_NAME.HOME,
      component: HomeView
    },
    {
      path: '/login',
      name: ROUTE_NAME.LOGIN,
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/register',
      name: ROUTE_NAME.REGISTER,
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/feed',
      name: ROUTE_NAME.FEED,
      component: () => import('@/views/FeedView.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/user/:id',
      name: ROUTE_NAME.PROFILE,
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        requiredParams: ['id'],
        requiresAuth: true,
      }
    },
    {
      path: '/search',
      name: ROUTE_NAME.SEARCH,
      component: () => import('@/views/SearchView.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/settings',
      name: ROUTE_NAME.SETTINGS,
      component: () => import('@/views/SettingsView.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/create-post',
      name: ROUTE_NAME.CREATE_POST,
      component: () => import('@/views/CreatePost.vue'),
      meta: {
        requiresAuth: true,
      }
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession();


  if(to.meta.requiredParams?.length) {
    const paramKeys = Object.keys(to.params);
    const hasAllRequiredParams = to.meta.requiredParams.every(param => paramKeys.includes(param));
    if (!hasAllRequiredParams) {
      return next({name: ROUTE_NAME.HOME});
    }
  }

  console.log('beforeEach:: session user', session?.user);
  const userStore = useUser();
  const { user, profile } = storeToRefs(userStore);
  const { fetchUserProfile, fetchFollows } = userStore;

  if (to.matched.some((res) => res.meta.requiresAuth)) {
    if (session?.user) {
      user.value = session.user;
      if (user.value?.id !== profile.value?.id) {
        try {
          await Promise.allSettled([
            fetchUserProfile(),
            fetchFollows(),
          ]);
        } catch (e) {
          console.error(e);
        }
      }
      next();
      return;
    }
    next({ name: ROUTE_NAME.LOGIN });
    return;
  }

  if(session?.user) {
    return next({ name: ROUTE_NAME.FEED });
  }

  next();
});

export default router
