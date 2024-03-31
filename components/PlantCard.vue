<template>
  <div class="h-fit">
    <Card :value="plant" :key="plant.id" :class="small ? 'w-40 m-4 h-72 overflow-hidden' : 'm-4 w-72 overflow-hidden'">
      <template #header>
        <div class="flex justify-center ">
          <img :alt="plant.commonName" :src="plant.defaultImageRegular" />
        </div>
      </template>
      <template #title>
        <h2 class="text-primary text-xl font-bold mb-5 text-center">
          <NuxtLink :to="`/plant/${plant.id}`">{{ plant.commonName }}</NuxtLink>
        </h2>

        <div v-if="isConnected" class="flex justify-end">

          <div v-if="userPlants && !isUserPlant(userPlants, plant.id)" class="flex justify-center">
            <Button @click="addPlantDialogVisible = true" :pt="{
                    root: { class: 'bg-primary border-tertiary w-full md:h-fit md:w-fit' }
                }">Add to my plants</Button>
          </div>

          <div v-else-if="isUserPlant(userPlants, plant.id) && hasAction(userActions, plant.id)" 
          :class="{'w-3 text-blue-500': !actionIsLate, 'w-3 text-red-500': actionIsLate}">
            <WateringIcon />
            </div>
        </div>

      </template>
      <template #content>
        <div v-if="!hideDescription" class="card flex justify-content-center">
          <ScrollPanel style="width: 275px; height: 150px">
            <p class=" justify-content-center">
              {{ plant.description }}
            </p>
            <ScrollTop target="parent" :threshold="100" icon="pi pi-arrow-up" :pt="{
              root: 'w-2rem h-2rem border-round-sm bg-primary',
              icon: {
                class: 'text-base'
              }
            }" />
          </ScrollPanel>
        </div>
      </template>
    </Card>
  </div>

  <Dialog :header="`Add ${plant?.commonName} to your plants`" v-model:visible="addPlantDialogVisible" modal>
            <FormAddPlantForm :plantId="plant?.id" :onPlantAdded="handlePlantAdded"/>
  </Dialog>

</template>

<script lang="ts" setup>
import Card from 'primevue/card';
import ScrollTop from 'primevue/scrolltop';
import 'primeicons/primeicons.css'
import { type Plant } from '~/types/Plant';
import type { UserPlant } from '~/types/UserPlant';
import type { Action } from '~/types/Action';
import WateringIcon from './icons/WateringIcon.vue';
const authStore = useAuthStore()
const isConnected = computed(() => authStore.isConnected)
const addPlantDialogVisible = ref(false);
const emit = defineEmits(['plantAdded']);
const actionIsLate = ref(false);

const props = defineProps<{
  plant: Plant;
  userPlants?: UserPlant[];
  userActions?: Action[];
  hideDescription?: boolean;
  small?: boolean;
}>();


const isUserPlant = (userPlantData: UserPlant[] | undefined | null, plantID: number) => {
  if (userPlantData && userPlantData.length > 0) {
    for (let i = 0; i < userPlantData.length; i++) {
      if (userPlantData[i].plantId === plantID) {
        return true
      }
    }
  }
  return false;
}

const hasAction = (userActionData: Action[] | undefined | null, plantId: number) => {
  if (userActionData && userActionData.length > 0) {
    for (let i = 0; i < userActionData.length; i++) {
      const action = userActionData[i];
      const currentDate = new Date();
      const actionDate = new Date(action.date);
      if (userActionData[i].userPlant.plantId === plantId && userActionData[i].done === false) {
        if (currentDate > actionDate) {
          actionIsLate.value = true;
        }
        return true
      }
    }
  }
  return false;
}




const handlePlantAdded = async () => {
    addPlantDialogVisible.value = false
    emit('plantAdded');
}


</script>

<style></style>

