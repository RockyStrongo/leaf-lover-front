<template>
  <div class="card flex justify-content-center">
    <button type="button" class="" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"> <svg
        class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    </button>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>
</template>



<script setup>
import { ref } from "vue";
const authStore = useAuthStore()

const menu = ref();
const items = ref([
  {
    items: [
      {
        label: 'All Plants',
        command: () => {
          return navigateTo('/plants');
        }
      },
      {
        label: 'Dashboard',
        command: () => {
          return navigateTo('/dashboard');
        },
        visible: () => {
          return authStore.isConnected;
        }
      },
      {
        label: 'My Plants',
        command: () => {
          return navigateTo('/profile/my-plants');
        },
        visible: () => {
          return authStore.isConnected;
        }
      },
      {
        label: 'Login',
        command: () => {
          return navigateTo('/login');
        },
        visible: () => {
          return !authStore.isConnected;
        }
      },

      {
        label: 'Logout',
        command: () => {
          return logout();
        },
        visible: () => {
          return authStore.isConnected;
        }
      }
    ]
  }
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

const logout = async () => {
  try {
    await authStore.logout()
    return navigateTo('/');
  } catch (error) {
    console.log(error)
  }
}

</script>