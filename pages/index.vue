<template>
  <div class="mb-10">
    <div class="w-full h-screen">
      <div class="w-full h-5/6 relative ">
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col  items-center">
          <h1 class="text-6xl text-white py-5">Leaf lover</h1>
          <div class="w-96 px-5">
            <SearchPlantAutoComplete />

          </div>
        </div>
        <img class="h-full w-full object-cover" src="/hero_img.avif" alt="leaf-lover-hero-image" srcset="">
      </div>
      <div class="absolute top-5 right-10">
        <ButtonsConnexion />
      </div>


      <div class="mx-10">
        <h2 class="text-3xl	w-full text-primary font-bold m-5 flex flex-row gap-2 items-center">
          <span>
            Plants
          </span>

          <NuxtLink class="text-sm font-normal text-gray-700 flex flex-row items-center gap-1" to="/plants">
            View all
            <div class="w-3 h-3">
              <IconsArrowRight />
            </div>
          </NuxtLink>

        </h2>

        <ScrollPanel :pt="{
          root: {
            class: 'h-80'
          },
          barX: 'bg-primary',
          barY: 'hidden'
        }">
          <div class="flex flex-row w-full h-full">
            <div v-if="plants && plants.length > 0" v-for="plant in plants">
              <PlantCard :plant="plant" :key="plant.id" :hideDescription="true" small />
            </div>
          </div>
        </ScrollPanel>
      </div>
    </div>

    <div class="mx-10 mb-10">
      <h2 class="text-3xl	w-full text-primary font-bold m-5">FAQ</h2>
      <FaqAccordion :faqs="faqs" />
    </div>

    <div class="m-10">
      <OurFeatures />
    </div>
    <Message v-if="faqsError" severity="error">{{ faqsError }}</Message>
    <Message v-if="plantsError" severity="error">{{ plantsError }}</Message>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import type { FaqApiResponse } from '~/types/FAQ';
import type { PlantApiResponse } from '~/types/Plant';
import Message from 'primevue/message';

//redirect to dashboard if user is connected
definePageMeta({
  layout: 'home',
  middleware: [
    function (to, from) {
      // Custom inline middleware
      const authStore = useAuthStore()

      if (authStore.isConnected) {
        return navigateTo('/dashboard')
      }
    },],
});

const runtimeConfig = useRuntimeConfig();
const apiUri = getApiBase();

const NUMBER_OF_PLANTS = 10
const NUMBER_OF_FAQS = 4

const { data: plantResponse, pending: plantsPending, error: plantsError } = await useFetch<PlantApiResponse>(`${apiUri}/plants?pageSize=${NUMBER_OF_PLANTS}`)
const { data: faqsResponse, pending: faqsPending, error: faqsError } = await useFetch<FaqApiResponse>(`${apiUri}/faqs?pageSize=${NUMBER_OF_FAQS}`)
const plants = plantResponse?.value?.plants || [];
const faqs = faqsResponse?.value?.faqs || [];

</script>