
<template>
    <div :class="(action.done ? ' bg-gray-500 ' : 'bg-primary ') + ` w-full text-secondary shadow-lg rounded-lg
        px-3 py-3 h-fit flex flex-row justify-between text-sm md:text-base`">
        <div class="flex gap-4 w-full">
            <div class="flex gap-4 md:w-2/12 w-5/12">
                <div>
                    {{ localizeDateFromIso8601(action.date, locale, false) }}
                </div>
                <div v-if="actionIsLate(action)" class="w-5 h-5 text-red-700">
                    <IconsExclamationIcon />
                </div>
            </div>

            <div class="flex flex-row gap-3 md:w-8/12">
                <div class="w-5 h-5">
                    <IconsWateringIcon />
                </div>
                <div class="flex flex-row w-full">
                    <span v-if="showPlantName" class="w-1/2 font-bold">
                        {{ action.userPlant.plant.commonName }}
                    </span>
                    <span class="hidden md:flex w-1/2">
                        {{ action.type.label }}
                    </span>
                </div>


            </div>
        </div>

        <div class="md:w-2/12 flex justify-end">
            <div v-if="!action.done" class="w-fit h-full cursor-pointer flex flex-row gap-2"
                @click="handleClickDone(action, onActionDone)">
                <span class="underline">Mark as done</span>
            </div>
            <div v-else class="w-fit h-full flex flex-row gap-2">
                <div class="h-5 w-5">
                    <IconsCheckIcon />
                </div>
            </div>
        </div>

    </div>

    <Dialog v-model:visible="errorMsg" modal>
        {{ errorMsg }}

    </Dialog>
</template>
  
<script lang="ts" setup>
import dayjs from 'dayjs';
import type { Action } from '~/types/Action';
const errorMsg = ref<string | null>(null)

const actionIsLate = (action: Action) => {
    return action.done === false && dayjs(action.date).isBefore(dayjs())
}

const handleClickDone = (action: Action, onActionDone: () => void) => {
    if (dayjs(action.date).isBefore(dayjs())) {
        markActionAsDone(action.id, onActionDone)
    } else {
        errorMsg.value = "You can't mark future actions as done."
    }
}

const markActionAsDone = async (actionId: number, onActionDone: () => void) => {
    try {
        const apiBase = getApiBase()
        const response = await fetch(`${apiBase}/users/actions/${actionId}/done`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                done: true
            })
        });

        if (response.ok) {
            onActionDone()
        }
    } catch (error) {
        errorMsg.value = `Error : ${error}`
    }
}

defineProps<{
    action: Action
    onActionDone: () => void
    showPlantName?: boolean
}>()
</script>
  
<style></style>