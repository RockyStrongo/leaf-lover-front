<template>
    <div class="m-5">
        Hello World
    </div>
</template>
   
<script lang="ts" setup>
definePageMeta({
    middleware: [
        'auth',
    ],
});

</script>
   
<style></style>
   