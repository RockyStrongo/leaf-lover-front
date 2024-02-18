
import type headerVue from '~/components/Header.vue';
<template>
  <div class="flex flex-col min-h-screen">
    <div class='sticky top-0 z-40'>
      <!-- <Header /> -->
    </div>
    <div class='overflow-y-auto flex-grow bg-secondary'>
      <slot />
    </div>
    <div class='bottom-0 z-40'>
      <Footer />
    </div>
  </div>
</template>

