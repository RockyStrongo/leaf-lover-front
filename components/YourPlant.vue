
<template>
    <div>
        <div class="flex flex-col md:flex-row gap-4 md:w-full md:justify-between">
            <div class="flex flex-row items-center mb-5 gap-3">
                <h3 class="text-2xl font-bold text-primary w-fit">Your plant</h3>
                <svg @click="onClickEdit" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary cursor-pointer"
                    viewBox="0 0 512 512">
                    <path fill="CurrentColor"
                        d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                </svg>
            </div>
            <PlantInfoItem header="ACQUISITION DATE"
                :content="localizeDateFromIso8601(userPlant.acquisitionDate, 'en', false)" />
            <PlantInfoItem header="NICKNAME" :content="userPlant.nickname" />
            <PlantInfoItem header="NOTES" :content="userPlant.notes" />
            <PlantInfoItem header="GIFT FROM" :content="userPlant.giftedBy" />

        </div>

    </div>
</template>
  
<script lang="ts" setup>
import type { UserPlant } from '~/types/UserPlant';


defineProps<{
    userPlant: UserPlant
    onClickEdit: () => void
}>()
</script>
  
<style></style>