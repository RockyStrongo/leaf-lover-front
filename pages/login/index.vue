<template>
  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72">
    <div class="bg-primary text-center p-11">

      <FormKit type="form" submit-label="Login" id="login-form" @submit="login" :submit-attrs="{
        inputClass: 'w-4/5 bg-secondary text-center hover:bg-tertiary hover:text-secondary flex justify-center items-center font-medium text-primary text-current',
      }">

        <FormKit type="text" name="email" id="email" label="Email" help="Your email" validation="required|email"
          placeholder="“jon.doe@mail.com”" v-model="formData.email" label-class="mb-2 text-xl font-medium"
          help-class="text-white" input-class="bg-white" />

        <FormKit type="password" name="password" placeholder="********" label="Password" help="Your password"
          validation="required" label-class="mb-2 text-xl font-medium" help-class="text-white" input-class="bg-white"
          suffix-icon="eyeClosed" @suffix-icon-click="handleIconClick" suffix-icon-class="bg-white" :sections-schema="{
            suffixIcon: {
              attrs: {
                style: { padding: '0' }
              }
            }
          }" v-model="formData.password" />

      </FormKit>

      <div v-if="errorMessage" class="text-red-500 text-sm font-xl mt-2">{{ errorMessage }}</div>

      <div class="mt-4 flex justify-center flex-col">
        <NuxtLink to="/register" class="text-sm text-white hover:text-white hover:underline">Don't have an account yet?</NuxtLink>
        <NuxtLink to="/forgotPassword" class="text-sm text-white hover:text-white hover:underline mt-2">Forgot your password?</NuxtLink>
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

interface FormData {
  email: string;
  password: string;
}

const formData = ref<FormData>({
  email: '',
  password: '',
});

const errorMessage = ref('');

const handleIconClick = (node: {
  props: {
    suffixIcon: string;
    type: string
  },
}) => {
  node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye';
  node.props.type = node.props.type === 'password' ? 'text' : 'password';
};

const authStore = useAuthStore()

const login = async () => {
  const { email, password } = formData.value;

  try {
    const response = await authStore.login(email, password);

    if (response.ok) {
      return navigateTo('/');
    }

    if (!response.ok && response.status === 401) {
      errorMessage.value = 'Invalid credentials';
    }
  } catch (error) {
    errorMessage.value = 'An error happenned';
  }
};


</script>