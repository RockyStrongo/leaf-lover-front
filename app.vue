<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'LeafLover',
  meta: [
    { name: 'LeafLover', content: 'LeafLover, the app for plants lovers.' }
  ],
})
</script>
