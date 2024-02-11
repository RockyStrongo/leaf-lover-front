<template>
    <div class="md:w-96 w-full">
        <FormKit type="form" id="addPlantForm" :value="{
            acquisitionDate: userPlant?.acquisitionDate && new Date(userPlant?.acquisitionDate).toISOString().split('T')[0],
            nickname: userPlant?.nickname,
            giftedBy: userPlant?.giftedBy,
            notes: userPlant?.notes
        }" @submit="(values: AddPlantForm) => handleSubmit(!userPlant, values, plantId, onPlantAdded)">
            <FormKit type="date" name="acquisitionDate" id="acquisitionDate" label="Acquisition date" overlay />
            <FormKit type="text" label="Nickname" name="nickname" id="nickname" />

            <FormKit type="text" label="Gift from" name="giftedBy" id="giftedBy" />

            <FormKit type="textarea" name="notes" id="notes" label="Notes" />
        </FormKit>

        <Button class="mt-3 bg-red-400 border-0" v-if="userPlant" type="button" @click="handleRemove">Remove this plant from
            your collection</Button>

        <Dialog v-if="userPlant" :header="`Are you sure ?`" v-model:visible="deleteConfirmationVisible" modal>This action is
            permanent.
            <div class="mt-3">
                <Button class="mr-2 bg-gray-300 text-black" @click="deleteConfirmationVisible = false">Cancel</Button>
                <Button class="bg-red-400 border-0" @click="removeFromCollection(userPlant.id, onPlantAdded)">I am
                    sure.</Button>
            </div>
        </Dialog>

    </div>
</template>

<script lang="ts" setup>
import type { UserPlant } from '~/types/UserPlant';

defineProps<{
    plantId: number
    userPlant?: UserPlant
    onPlantAdded: () => void
}>()

const runtimeConfig = useRuntimeConfig();
const deleteConfirmationVisible = ref(false)

type AddPlantForm = {
    acquisitionDate: string;
    nickname: string;
    giftedBy: string;
    notes: string;
}

const addPlantToUserPlants = async (values: AddPlantForm, plantId: number, onPlantAdded: () => void) => {

    const formattedValues = {
        ...values,
        acquisitionDate: new Date(values.acquisitionDate).toISOString()
    }

    try {
        const response = await fetch(`${runtimeConfig.public.apiBase}/users/plants/${plantId}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                formattedValues
            )
        })

        if (response.ok) {
            onPlantAdded()
        }

    } catch (error) {
        console.error(error)
    }
}

const updateUserPlant = async (values: AddPlantForm, plantId: number, onPlantAdded: () => void) => {

    const formattedValues = {
        ...values,
        acquisitionDate: new Date(values.acquisitionDate).toISOString()
    }

    try {
        const response = await fetch(`${runtimeConfig.public.apiBase}/users/plants/${plantId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                formattedValues
            )
        })

        if (response.ok) {
            onPlantAdded()
        }

    } catch (error) {
        console.error(error)
    }
}

const handleSubmit = (createMode: boolean, values: AddPlantForm, plantId: number, onPlantAdded: () => void) => {
    if (createMode) {
        addPlantToUserPlants(values, plantId, onPlantAdded)
    } else {
        updateUserPlant(values, plantId, onPlantAdded)
    }
}

const handleRemove = () => {
    deleteConfirmationVisible.value = true
}

const removeFromCollection = async (userPlantId: number, onPlantRemoved: () => void) => {
    try {
        const response = await fetch(`${runtimeConfig.public.apiBase}/users/plants/${userPlantId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            onPlantRemoved()
        }
    } catch (error) {
        console.error(error)
    }

}

</script>