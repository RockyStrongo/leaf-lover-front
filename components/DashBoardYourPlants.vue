<template>
    <h3 class="text-3xl font-bold text-primary my-5 flex flex-row gap-2 items-center">
        <span>
            Your Plants
        </span>

        <NuxtLink class="text-sm font-normal text-gray-700 flex flex-row items-center gap-1" to="/profile/MyPlants">
            View all
            <div class="w-3 h-3">
                <IconsArrowRight />
            </div>
        </NuxtLink>

    </h3>
    <div v-if="!loading">
        <ScrollPanel :pt="{
            root: {
                class: 'h-80'
            },
            barX: 'bg-primary',
            barY: 'hidden'
        }">
            <div class="flex flex-row w-full h-full">
                <div v-if="userPlants && userPlants.length > 0" v-for="userPlant in userPlants">
                    <PlantCard :plant="userPlant.plant" :key="userPlant.id" :hideDescription="true" small />
                </div>
            </div>
        </ScrollPanel>

        <div v-if="userPlants && userPlants.length === 0" class="flex flex-col md:flex-row gap-3">
            You don't have any plant in your collection yet.
            <NuxtLink class="flex w-fit bg-primary text-secondary px-3 py-1 rounded" to="/plants">Browse plants
            </NuxtLink>
        </div>
    </div>
    <div v-if="loading" class="flex flex-col md:flex-row gap-3">
        <ProgressSpinner />
    </div>
</template>


<script lang="ts" setup>
import type { UserPlant } from '~/types/UserPlant';


const props = defineProps<{
    userPlants: UserPlant[] | null;
    loading: boolean;
}>();

</script>