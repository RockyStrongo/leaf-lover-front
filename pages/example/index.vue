<script lang="ts" setup>

const toto = UseToto();

</script>

<template>
  <div>
    <h1 class="text-center my-10 ">Welcome to the example homepage {{ toto }}</h1>
    <NuxtLink :to="{name: 'login'}">LOGIN</NuxtLink>
    <div class="w-3/6 m-auto py-20">
      <ExampleAccordion />
    </div>
    <div class="flex justify-center">
      <ExampleFormMultiStep />
    </div>
  </div>
</template>



<style>

</style>