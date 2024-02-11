<template>
  <div>
    <NuxtLink :to="authStore.isConnected ? '/profile/account' : '/login'">
      <Button
          :label="authStore.isConnected ? 'Profile' : 'Login'"
          icon="pi pi-user"
          iconPos="right"
          p-button-sm
          severity="success"
      />
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import 'primeicons/primeicons.css'
const authStore = useAuthStore()
</script>
