<template>
  <div class="my-10 mx-5 md:mx-72 flex flex-col items-center">
    <OurFeatures />
    <div class="w-1/2 m-5">
      <SearchPlantAutoComplete />
    </div>
    <div class="flex items-center justify-center">
      <div class="md:w-8/12 md:object-cover md:object-top w-full">
        <PlantCarousel :plants="only5Plants" />
      </div>
    </div>
    <div class="mx-10">
      <h2 class="text-2xl	text-center w-full text-primary font-bold m-5">FAQ</h2>
      <FaqAccordion :faqs="only4FAQs" />
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

const { data: plantResponse, pending: plantsPending, error: plantsError } = await useFetch<PlantApiResponse>(`${apiUri}/plants?pageSize=5`)
const { data: faqs, pending: faqsPending, error: faqsError } = await useFetch<FaqApiResponse>(`${apiUri}/faqs?pageSize=4`)
const only5Plants = plantResponse?.value?.plants || [];
const only4FAQs = faqs?.value?.faqs || [];

</script>
 