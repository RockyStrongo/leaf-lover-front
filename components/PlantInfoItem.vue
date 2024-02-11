
<template>
    <div class="flex flex-row md:flex-col gap-3 md:gap-0">
        <div class="text-gray-500 w-1/2 md:w-fit">
            {{ header }}
        </div>
        <div class="font-bold">
            {{ content }}
        </div>
    </div>
</template>
  
<script lang="ts" setup>

defineProps<{
    header: string,
    content: string
}>()
</script>
  
<style></style>