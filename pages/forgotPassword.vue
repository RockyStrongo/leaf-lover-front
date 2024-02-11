<template>
  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72">
    <div class="bg-primary text-center p-11">

      <div v-if="!successMessage">
        <FormKit type="form"
         submit-label="Reset password"
          id="forgot-password-form"
          @submit="resetPassword"
          :submit-attrs="{
          inputClass: 'w-4/5 bg-secondary text-center hover:bg-tertiary hover:text-secondary flex justify-center items-center font-medium text-primary text-current',
        }">

          <FormKit type="text"
          name="email"
          id="email"
          label="Email"
          help="Your email"
          validation="required|email"
          v-model="formData.email" 
          placeholder="“jon.doe@mail.com”" 
          label-class="mb-2 text-xl font-medium" 
          help-class="text-white"
          input-class="bg-white" />

        </FormKit>

        <div v-if="errorMessage" class="text-red-500 text-sm font-xl mt-2">{{ errorMessage }}</div>

        <div class="mt-4 flex justify-center flex-col">
          <NuxtLink to="/login" class="text-sm text-white hover:text-white hover:underline">Back to login</NuxtLink>
        </div>

      </div>
      <div v-else>
          <div class="text-white text-sm mb-5">We have sent you an email with a link to reset your password.</div>
          <NuxtLink to="/login" class="text-sm text-primary hover:text-white hover:underline w-4/5 bg-secondary text-center hover:bg-tertiary p-2">Back to login</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const apiBase = getApiBase();

interface FormData {
  email: string;
}

const formData = ref<FormData>({
  email: '',
});

const errorMessage = ref('');
const successMessage = ref(false);


const resetPassword = async () => {

  const email = formData.value.email;

  try {
    await useFetch(`${apiBase}/users/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),

      onResponse: ({ request, response }) => {

        if (response.ok && response.status === 200) {
          successMessage.value = true;
        }

      },
      onResponseError: ({ request, response }) => {
        if (!response.ok && response.status === 401) {
          errorMessage.value = 'Invalid email';
        }
      }
    });
  } catch (error) {
    errorMessage.value = 'An error happenned';
  }
};

</script>
