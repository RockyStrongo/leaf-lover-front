<template>
    <div class="my-10 mx-5 md:mx-72">
        <h2 class="text-4xl font-bold text-primary text-center">
            Hello {{ firstName }} {{ lastName }}!
        </h2>
        <div class="my-5">
            <SearchPlantAutoComplete />
        </div>

        <DashBoardYourPlants :userPlants="userPlants" :loading="userPlantsLoading" />

        <h3 class="text-3xl font-bold text-primary my-5 flex flex-row gap-2 items-center">
            Next Actions
        </h3>
        <div class="flex flex-col gap-3">
            <div v-for="action in nextActions">
                <ActionCard :action="action" :onActionDone="refreshActions" showPlantName />
            </div>
        </div>

        <div v-if="apiErrors" v-for="error in apiErrors">
            <Message severity="error">{{ error }}</Message>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import type { Action } from '~/types/Action';
import type { UserPlant } from '~/types/UserPlant';
definePageMeta({
    middleware: [
        'auth',
    ],
});

const apiUri = getApiBase();

const userPlants = ref<UserPlant[] | null>(null);
const userPlantsLoading = ref<boolean>(false);

const nextActions = ref<Action[] | null>(null);
const nextActionsLoading = ref<boolean>(false);

const apiErrors = ref<string[] | null>(null);

const authStore = useAuthStore()
const firstName = computed(() => authStore.firstName);
const lastName = computed(() => authStore.lastName);

const getUserPlants = async () => {
    try {
        const response = await fetch(`${apiUri}/users/plants`, {
            credentials: 'include',
        })
        const userPlantsResponse = await response.json() as UserPlant[]
        return userPlantsResponse
    } catch (error) {
        const err = `error: ${error}`
        apiErrors.value?.push(err)
    }
}

const getNextActions = async () => {
    try {
        const response = await fetch(`${apiUri}/users/actions`, {
            credentials: 'include',
        })
        const nextActions = await response.json() as Action[]
        return nextActions
    } catch (error) {
        const err = `error: ${error}`
        apiErrors.value?.push(err)
    }
}

const refreshActions = async () => {
    nextActionsLoading.value = true
    const nextActionsResponse = await getNextActions()
    if (nextActionsResponse) {
        nextActions.value = nextActionsResponse
    }
    nextActionsLoading.value = false
}

onMounted(async () => {
    //get user plants
    userPlantsLoading.value = true
    const userPlantsResponse = await getUserPlants()
    if (userPlantsResponse) {
        userPlants.value = userPlantsResponse
    }
    userPlantsLoading.value = false

    //get next actions
    await refreshActions()
})


</script>