<template>
    <header class="bg-gradient-to-r from-[#008b74] via-green-300 to-[#008b74] flex flex-wrap flex-row justify-between items-center p-3">
        <div v-if="isConnected && !isVerified" class="w-full">
            <Message severity="warn" :closable=false>Please verify your email address to access connected user features.</Message>
        </div>
        <ButtonsMenu />
        <NuxtLink to="/">
        <img src="/LeafLoverLogo.png"  class="w-12 rounded-sm lg:w-14 shadow-white-300/50" alt="leaflover logo"/>
        </NuxtLink>
        <div class="flex flex-row gap-2 mr-3">
            <ButtonsConnexion />
            <ButtonsLogout v-if="isConnected" @click="logout" />
        </div>
    </header>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isConnected = computed(() => authStore.isConnected)
const isVerified = computed(() => authStore.isVerified)

const logout = async () => {
    try {
        await authStore.logout()
        return navigateTo('/');
    } catch (error) {
        console.log(error)
    }
}

</script>
