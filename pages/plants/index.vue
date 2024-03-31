<template>
  <div>
    <h1 class="text-2xl text-center  text-primary font-bold"> All our plants </h1>
    <div class="flex justify-center p-4">
      <span class="p-input-icon-right text-primary border-primary">
        <i class="pi pi-search text-primary" />
        <input
          class="placeholder:italic placeholder:text-primary border border-primary rounded-md pl-9 focus:outline-none focus:border-primary "
          type="text" v-model="search" @input="handleSearchChange" placeholder="Search plant(s)" />
      </span>
    </div>
    <div class="w-full flex justify-center">
      <ProgressSpinner v-if="searchInProgress" />
    </div>
    <div class="card flex justify-end mr-12 mb-4 flex-wrap">
      <Toast />
      <SplitButton label="Sort by" :model="items" icon="pi pi-sort" rounded severity="success">
      </SplitButton>
    </div>
    <div v-if="search" class="text-primary bg-white border border-primary text-center"> search result(s) : {{ search }}

    </div>
    <Message v-if="plantsError" severity="error">{{ plantsError }}</Message>
    <div class="flex flex-wrap  justify-around ">
      <template v-if="plantData?.plants !== null">
          <aside
            class=" lg:block lg:w-1/4 lg:fixed lg:left-4 lg:top-1/2  lg:-translate-y-1/2 lg:transition-transform">
            <div class="bg-secondary rounded-lg flex flex-col justify-center">
              <h2 class="bg-tertiary text-white text-center rounded-lg">filter(s)</h2>
              <div class="flex align-items-center justify-between my-1">
                <label for="flowers">Flowers: </label>
                <input class="m-1" type="checkbox" v-model="filterFlowers" @change="applyFilter" />
              </div>
              <div class="flex align-items-center justify-between my-1">
                <label for="cuisine">Cuisine: </label>
                <input class="m-1" type="checkbox" v-model="filterCuisine" @change="applyFilter" />
              </div>
              <div class="flex align-items-center justify-between my-1">
                <label for="humanPoison">Poison for humans: </label>
                <input class="m-1" type="checkbox" v-model="poisonHumans" @change="applyFilter" />
              </div>
              <div class="flex align-items-center justify-between my-1">
                <label for="petPoison">Poison for pets: </label>
                <input class="m-1" type="checkbox" v-model="poisonPets" @change="applyFilter" />
              </div>
              <div class="card flex flex-col justify-content-center my-1">
                <label for="types">Type: </label>
                <Dropdown v-model="selectedType" :options="types" placeholder="Select a type of plants"
                  @change="applyFilter" class="w-full md:w-14rem">{{ selectedType }}</Dropdown>
              </div>
              <div class="card flex flex-col justify-content-center my-1">
                <label for="watering">Watering: </label>
                <Dropdown v-model="selectedWatering" :options="watering" placeholder="select watering"
                  @change="applyFilter" class="w-full md:w-14rem">
                  {{ selectedWatering }}
                </Dropdown>
              </div>
              <div class="card flex flex-col justify-content-center my-1">
                <label for="carelevel">Care level: </label>
                <Dropdown v-model="selectedCareLevel" :options="careLevel" placeholder="select care level"
                  @change="applyFilter" class="w-full md:w-14rem">
                  {{ selectedCareLevel }}
                </Dropdown>
              </div>
              <div class="card flex flex-col justify-content-center my-1">
                <button class="bg-tertiary text-white text-center rounded-lg my-3" @click="resetFilters">Reset Filters
                  <i class="pi pi-refresh"></i>
                </button>
              </div>
            </div>
          </aside>
          <div class="md:w-3/4 ml-auto flex flex-wrap  justify-around">
            <div v-for=" plant  in  plantData?.plants " :key="plant.id">
          <PlantCard :plant="plant" :userActions="userActionData ?? []" :userPlants="userPlantData ?? []" @plantAdded="refreshAll"/>
          </div>
          </div>
        
      </template>
      <template v-if="plantData?.totalPlants === 0">
        <Message severity="error">This plant is not yet in our database or doesn't exist</Message>
      </template>
    </div>
    <Paginator :rows="pageSize" :totalRecords="plantData?.totalPlants" :rowsPerPageOptions="[10, 20, 30]"
      @page="(event) => optionPage(event, search)" :pt="{
        pageButton: ({ context }) => ({
          class: context.active ? 'bg-primary text-secondary border-primary' : 'text-primary',
        }),
        lastPageIcon: () => ({
          class: 'text-primary'
        }),
        firstPageIcon: () => ({
          class: 'text-primary'
        }),
        previousPageIcon: () => ({
          class: 'text-primary'
        }),
        nextPageIcon: () => ({
          class: 'text-primary'
        }),
        rowPerPageDropdown: ({ props } : any ) => ({
          class: props.optionValue ? 'bg-primary text-secondary border-primary' : 'text-primary',
        }),
      }
        ">
      {{ search }}
    </Paginator>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { PlantApiResponse, Plant } from '~/types/Plant';
import Message from 'primevue/message';
import Paginator from 'primevue/paginator';
import ProgressSpinner from 'primevue/progressspinner';
import { useAuthStore } from '@/stores/auth'
import { useToast } from "primevue/usetoast";
import type { Action } from '~/types/Action';
import type { UserPlant } from '~/types/UserPlant';
const userPlantData = ref<UserPlant[] | null>(null);
const userActionData = ref<Action[] | null>(null);

const toast = useToast();
const previousSortBy = ref<string | null>(null);
const items = [
  {
    label: 'alphabetical order asc',
    icon: ' pi pi-sort-alpha-down',
    command: async () => {
      const currentSortBy = 'asc';
      if (previousSortBy.value !== currentSortBy) {
        previousSortBy.value = currentSortBy;
        toast.add({ severity: 'success', summary: 'Updated', detail: 'sort asc succeded', life: 3000 });
        await getPlants(search.value, 1, pageSize.value, 'asc',);
      } else {
        toast.add({ severity: 'info', summary: 'Already updated', detail: ' Already sort asc', life: 3000 });

      }
    }
  },
  {
    label: 'alphabetical order desc',
    icon: 'pi pi-sort-alpha-up',
    command: async () => {
      const currentSortBy = 'desc';
      if (previousSortBy.value !== currentSortBy) {
        previousSortBy.value = currentSortBy;
        await getPlants(search.value, 1, pageSize.value, 'desc');
        toast.add({ severity: 'success', summary: 'Updated', detail: 'sort desc succeded', life: 3000 });
      } else {
        toast.add({ severity: 'info', summary: 'Already updated', detail: ' Already sort desc', life: 3000 });

      }
    }
  },
];
const PAGE_SIZE = 20
const runtimeConfig = useRuntimeConfig();
const plantData = ref<PlantApiResponse | null>(null);
const plantsError = ref('');
const pageSize = ref(PAGE_SIZE);
const search = ref('');
const searchInProgress = ref(false);
const filterFlowers = ref(false);
const filterCuisine = ref(false);
const poisonHumans = ref(false);
const poisonPets = ref(false);
const types = ref<Array<string>>([]);
const selectedType = ref<string | null>(null);
const watering = ref<Array<string>>([]);
const selectedWatering = ref<string | null>(null);
const careLevel = ref<Array<string>>([]);
const selectedCareLevel = ref<string | null>(null);

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const handleSearchChange = async () => {
  searchInProgress.value = true;
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(async () => {
    await getPlants(search.value, 1, pageSize.value);
    searchInProgress.value = false;
  }, 1000); // Délai de 1000 ms avant d'effectuer la recherche

};

const optionPage = async (event: any, search: string) => {
  const pageIndex = event.page + 1;
  pageSize.value = event.rows;
  await getPlants(search, pageIndex, pageSize.value, previousSortBy.value, {
    flowers: filterFlowers.value ? true : null,
    cuisine: filterCuisine.value ? true : null,
    poisonousToHumans: poisonHumans.value ? true : null,
    poisonousToPets: poisonPets.value ? true : null,
    type: selectedType.value ? selectedType.value : null,
    watering: selectedWatering.value ? selectedWatering.value : null,
    careLevel: selectedCareLevel.value ? selectedCareLevel.value : null
  });
};
const applyFilter = async () => {
  searchInProgress.value = true;

  const filters: { [key: string]: boolean | string | null } = {
    flowers: filterFlowers.value ? true : null,
    cuisine: filterCuisine.value ? true : null,
    poisonousToHumans: poisonHumans.value ? true : null,
    poisonousToPets: poisonPets.value ? true : null,
    type: selectedType.value,
    watering: selectedWatering.value,
    careLevel: selectedCareLevel.value
  };

  await getPlants(search.value, 0, pageSize.value, previousSortBy.value, filters);

  searchInProgress.value = false;
};
const resetFilters = () => {
  filterFlowers.value = false;
  filterCuisine.value = false;
  poisonHumans.value = false;
  poisonPets.value = false;
  selectedType.value = null;
  selectedWatering.value = null;
  selectedCareLevel.value = null;

  // Appeler la méthode applyFilter pour mettre à jour les résultats
  applyFilter();
};

const getPlants = async (
  searchValue: string | null = null,
  page: number,
  pageSize: number,
  sortBy: string | null = null,
  filters: { [key: string]: boolean | string | null } = {},) => {
  try {

    let apiUrl = `${runtimeConfig.public.apiBase}/plants?page=${page}&pageSize=${pageSize}`;
    if (searchValue !== null && searchValue !== '') {
      apiUrl += `&query=${searchValue}`;
    }
    if (sortBy !== null) {
      apiUrl += `&orderBy=${sortBy}`;
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null) {
        apiUrl += `&${key}=${value}`;
      }
    });
    const { data: plantsResponseSearch } = await useFetch<PlantApiResponse>(apiUrl);
    plantData.value = plantsResponseSearch.value || null;
    const fetchedTypes = (plantData?.value || {}).types || [];
    types.value = fetchedTypes as unknown as string[];
    const fetchedWatering = (plantData?.value || {}).watering || [];
    watering.value = fetchedWatering as unknown as string[];
    const fetchedCareLevel = (plantData?.value || {}).careLevel || [];
    careLevel.value = fetchedCareLevel.map(item => item.careLevel) as string[];



  } catch (error) {
    plantsError.value = 'Error fetching paginated plants';
    console.error('Error fetching paginated plants:', error);
  }
};

getPlants(undefined, 1, pageSize.value);



const getUserPlants = async () => {
  try {
    const response = await fetch(`${runtimeConfig.public.apiBase}/users/plants`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json() as UserPlant[];
    userPlantData.value = data;
  } catch (error) {
    console.error(error);
    return null
  }
};


const getUserActions = async () => {
  try {
    const response = await fetch(`${runtimeConfig.public.apiBase}/users/actions`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    userActionData.value = data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

getUserPlants()
getUserActions()

const refreshAll = async () => {
  // Refresh user plants and actions here
  await getUserPlants();
  await getUserActions();
  // Optionally, refresh the paginated plants as well
  await getPlants(search.value, 0, pageSize.value);
};

</script>