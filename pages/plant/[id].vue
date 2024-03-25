<template>
    <div class="my-10 mx-10 md:mx-44">
        <div class="my-5 flex flex-col md:flex-row gap-5 items-center">
            <div>
                <h2 class="text-3xl font-bold text-primary">
                    {{ plant?.commonName }}
                </h2>
                <h3 class="text-gray-500">
                    {{ plant?.scientificName }}
                </h3>
            </div>


            <div v-if="isConnected && userPlantDataLoading">
                <ProgressSpinner />
            </div>
            <div v-else>
                <Button v-if="isConnected && !userPlantData" @click="addPlantDialogVisible = true" :pt="{
                    root: { class: 'bg-primary border-tertiary w-full md:h-fit md:w-fit' }
                }">Add to my plants</Button>
            </div>


        </div>

        <div class="my-5" v-if="isConnected && userPlantData">
            <YourPlant :userPlant="userPlantData" :onClickEdit="() => addPlantDialogVisible = true" />
        </div>

        <div v-if="isConnected && userPlantData && userPlantData.Action.length > 0">
            <h3 class="text-2xl font-bold text-primary w-fit">Your plant actions</h3>
            <h4 class="text-gray-500 text-sm">
                Last 5 actions are shown
            </h4>
            <div class="my-5 flex flex-col gap-2">
                <div v-for="action in userPlantData.Action">
                    <ActionCard :action="action" :onActionDone="refreshUserPlant" />
                </div>
            </div>
        </div>


        <div class="flex flex-col md:flex-row gap-5 items-start">
            <img class="rounded-lg shadow md:w-1/2 md:object-cover md:object-top	 md:h-72 bg-gray-300"
                :src="plant?.defaultImageRegular" :alt="`photo of ${plant?.commonName}`"
                @click="fullScreenImageVisible = true">
            <div class="md:order-first md:w-1/2 ">{{ plant?.description }}</div>
        </div>



        <div class="my-10 flex flex-col md:flex-row gap-5">
            <h3 class="text-2xl font-bold text-primary mb-5 w-72">
                General info
            </h3>
            <div class="flex flex-col md:flex-row gap-4 md:w-full md:justify-between">
                <PlantInfoItem header="SPECIES OF" :content="plant?.type" />
                <PlantInfoItem header="WATERING" :content="plant?.watering" />
                <PlantInfoItem header="FLOWERS" :content="plant?.flowers ? 'Yes' : 'No'" />
                <PlantInfoItem header="CARE LEVEL" :content="plant?.careLevel ?? ''"  />
                <PlantInfoItem header="CUISINE" :content="plant?.cuisine ? 'Yes' : 'No'" />
                <PlantInfoItem header="HUMANS" :content="plant?.poisonousToHumans ? 'Dangerous' : 'Safe'" />
                <PlantInfoItem header="PETS" :content="plant?.poisonousToPets ? 'Dangerous' : 'Safe'" />
            </div>

        </div>

        <CareGuideAccordion v-if="plant?.CareGuide" :careGuides="plant?.CareGuide" />

        <div v-if="plant?.Faq && plant?.Faq.length > 0">
            <h2 class="text-2xl	w-full text-primary font-bold my-5">FAQ</h2>
            <FaqAccordion v-if="plant?.Faq" :faqs="plant?.Faq" />
        </div>

        <Message v-if="error" severity="error">{{ error }}</Message>

        <Dialog v-model:visible="fullScreenImageVisible" modal>
            <img :src="plant?.defaultImageRegular" :alt="`photo of ${plant?.commonName}`" class="w-full h-full">
        </Dialog>


        <Dialog :header="`Add ${plant?.commonName} to your plants`" v-model:visible="addPlantDialogVisible" modal>
            <FormAddPlantForm :plantId="plant?.id" :onPlantAdded="handlePlantAdded" :userPlant="userPlantData" />
        </Dialog>



    </div>
</template>
  
<script lang="ts" setup>
import { useRoute } from 'vue-router';
import type { Plant } from '~/types/Plant';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useAuthStore } from '@/stores/auth'
import ProgressSpinner from 'primevue/progressspinner';
import type { UserPlant } from '~/types/UserPlant'

const authStore = useAuthStore()
const isConnected = computed(() => authStore.isConnected)

const fullScreenImageVisible = ref(false);
const addPlantDialogVisible = ref(false);
const userPlantDataLoading = ref(true)
const userPlantData = ref<UserPlant | null>(null);

const route = useRoute()
const plantId = route.params.id
const runtimeConfig = useRuntimeConfig();
const getuserPlant = async () => {

    if (!isConnected.value) return null

    try {
        const response = await fetch(`${runtimeConfig.public.apiBase}/users/plants/${plantId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json() as UserPlant
        return data
    } catch (error) {
        console.error(error)
    }
}

const handlePlantAdded = async () => {
    addPlantDialogVisible.value = false
    await refreshUserPlant()
}

const refreshUserPlant = async () => {
    const userPlant = await getuserPlant()
    //sort actions by date desc
    if (userPlant?.Action) userPlant.Action.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (userPlant) userPlantData.value = userPlant
    if (!userPlant) userPlantData.value = null
    userPlantDataLoading.value = false
}

const { data: plant, pending, error: error } = await useFetch<Plant>(`${runtimeConfig.public.apiBase}/plants/${plantId}`)


//once component is fully loaded, if user connected get the user plant
onMounted(async () => {
    userPlantDataLoading.value = true
    if (!isConnected.value) return
    await refreshUserPlant()
})
</script>