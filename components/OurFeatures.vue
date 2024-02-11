<template >
  <div class="m-5">
    <h2 class="text-2xl	text-center w-full text-primary font-bold">Our Features</h2>
    <div class="flex flex-col md:flex-row justify-between mt-5 md:mt-0">
      <div v-for="feature in features" class="bg-primary md:p-5 p-2 rounded-lg m-1 md:m-5 text-secondary shadow text-center">
        {{ feature }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const features = ["Watering notifications", "Photos history", "Personalized guides for your plants", "Frequently Asked Questions about your plants"]
</script>

<style></style>