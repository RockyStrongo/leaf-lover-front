
<template>
    <div class="">
        <h2 class="text-2xl	w-full text-primary font-bold my-5">Care Guide</h2>
        <Accordion >
            <AccordionTab v-for="careGuide in careGuides" :key="careGuide.id" :header="careGuide.careGuideType.label" :pt="{
                headerAction: () => ({
                    class: [
                        'bg-primary text-secondary m-1 rounded-lg shadow-lg',
                    ]
                }),
            }">
                <p class="m-0">{{ careGuide.description }}</p>
            </AccordionTab>
        </Accordion>
    </div>
</template>

<script lang="ts" setup>
import { type CareGuideWithDetails } from '../types/CareGuide'
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

defineProps<{
    careGuides: CareGuideWithDetails[]
}>()
</script>
