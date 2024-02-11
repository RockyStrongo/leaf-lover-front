
<template>
    <div>
            <Accordion :pt="{
                root: () => ({
                    class: [
                        'flex flex-wrap'
                    ]
                })
            }">
                <AccordionTab v-for="faq in   faqs  " :key="faq.id" :header="faq.question" :pt="{
                    root: () => ({
                        class: [
                            'md:w-1/2 w-full'
                        ]
                    }),
                    headerAction: () => ({
                        class: [
                            'bg-primary text-secondary m-1 rounded-lg shadow-lg',
                        ]
                    }),
                }">
                    <p class="m-0">{{ faq.answer }}</p>
                </AccordionTab>
            </Accordion>
    </div>
</template>

<script lang="ts" setup>
import { type FAQ } from '../types/FAQ'
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

defineProps<{
    faqs: FAQ[]
}>()

</script>
