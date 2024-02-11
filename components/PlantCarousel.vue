
<template>
  <div class="w-full">
    <Carousel :value="plants" :numVisible="1" :numScroll="1" circular :showIndicators="false">
      <template #item="slotProps">

        <div class="bg-white shadow-2xl	rounded-lg overflow-hidden h-fit">
          <img :src="slotProps.data.defaultImageRegular" :alt="slotProps.data.commonName"
            class="w-full shadow-lg h-40 md:h-72  object-cover" />
          <div class="flex flex-col items-center m-5">
            <h4 class="mb-1 text-primary text-2xl font-bold mb-5">
              <NuxtLink :to="`/plant/${slotProps.data.id}`">{{ slotProps.data.commonName }}</NuxtLink>
            </h4>
            <ScrollPanel class="h-20">
            <p class=" justify-content-center">
              {{ slotProps.data.description }}
            </p>
            <ScrollTop target="parent" :threshold="100" icon="pi pi-arrow-up" :pt="{
              root: 'w-2rem h-2rem border-round-sm bg-primary',
              icon: {
                class: 'text-base'
              }
            }" />
          </ScrollPanel>
            <!-- <p class="h-20 overflow-hidden my-2">{{ slotProps.data.description }}</p> -->
          </div>
        </div>

      </template>
    </Carousel>

  </div>
</template>

<script lang="ts" setup>
import { type Plant } from '../types/Plant'
import Carousel from 'primevue/carousel';

defineProps<{
  plants: Plant[]
}>()
</script>

<style></style>