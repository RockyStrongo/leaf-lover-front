<template>
  <AutoComplete class="w-full flex justify-center" v-model="searchKeyWord" placeholder="Search for a plant"
    :suggestions="searchResults" @item-select="onItemSelect" @complete="searchPlants" :pt="{
      input: { class: 'w-full' },
    }">
    <template #option="slotProps">
      <div class="flex flex-row gap-4 items-center">
        <img class="w-10 h-10 rounded" :src="slotProps.option.defaultImageThumbnail" />
        <div class="flex flex-col">
          <span>{{ slotProps.option.commonName }}</span>
          <span class="text-sm text-gray-400">{{ slotProps.option.scientificName }}</span>
        </div>
      </div>
    </template>
  </AutoComplete>
  <Message v-if="searchError" severity="error">{{ searchError }}</Message>
</template>

<script lang="ts" setup>
import type { Plant } from '~/types/Plant';
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete';

const router = useRouter()
const searchKeyWord = ref('');
const searchResults = ref<Plant[]>([]);
const searchError = ref('');
const apiUri = getApiBase();

const searchPlants = async () => {
  try {
    const results = await fetch(`${apiUri}/plants?query=${searchKeyWord.value}`, {
      credentials: 'include',
    })
    const data = await results.json();
    searchResults.value = data.plants;
  } catch (error) {
    searchError.value = `error: ${error}`;
  }
}

const onItemSelect = (event: { value: Plant }) => {
  searchKeyWord.value = event.value.commonName;
  //redirect to plant page
  router.push(`/plant/${event.value.id}`)
}
</script>