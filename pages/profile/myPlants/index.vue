<template>
    <h1 class="text-3xl text-center my-5 w-full text-primary font-bold"> My plants </h1>

  <div class="flex flex-wrap flex-row justify-around py-3">
      <template v-if="plants !== null">
        <div v-for="plantInfo in plants" :key="plantInfo.id">
          <PlantCard :plant="plantInfo.plant" :userActions="userActionData" :userPlants="userPlantData"/>
        </div>
      </template>
      <div v-if="isLoading" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <ProgressSpinner v-if="isLoading"  />
      </div>
      <template v-if="plants.length === 0 && !isLoading">
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 flex flex-col justify-center items-center">
          <h2 class="mb-5 text-xl"><i class="pi pi-info-circle"></i> You don't have any plants yet</h2>
          <NuxtLink to="/plants" class="w-2/4 p-2 bg-primary text-center hover:bg-tertiary hover:text-secondary flex justify-center items-center font-medium text-secondary text-current">
            Add a plant
          </NuxtLink>
        </div>
      </template>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: [
        'auth',
    ],
});

import { ref, onMounted } from 'vue';
import type { Action } from '~/types/Action';
import type { PlantInfo } from '~/types/Plant';
import type { UserPlant } from '~/types/UserPlant';

const apiBase = getApiBase();
const plants = ref<PlantInfo[]>([]);
const isLoading = ref(true);
const userPlantData = ref<UserPlant[] | null>(null);
const userActionData = ref<Action[] | null>(null);

const fetchPlants = async () => {
  try {
    const response = await fetch(`${apiBase}/users/plants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      plants.value = data;       
      isLoading.value = false;
    } else {
      console.error('Failed to fetch plants:', response.statusText);
      isLoading.value = false; 
    }
  } catch (error) {
    console.error('Error fetching plants:', error);
    isLoading.value = false; 
  }
};

onMounted(fetchPlants);
</script>

