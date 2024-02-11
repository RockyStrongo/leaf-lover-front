<template>
  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72">
    <div class="bg-primary text-center p-11">

      <div v-if="!successMessage && !errorTokenMessage">
        <FormKit type="form" submit-label="Confirm" id="reset-password-form" @submit="updatePassword" :submit-attrs="{
          inputClass: 'w-4/5 bg-secondary text-center hover:bg-tertiary hover:text-secondary flex justify-center items-center font-medium text-primary text-current',
        }">

          <FormKit type="password" name="password" placeholder="********" label="New password" help="Your password"
            :validation="[
                ['required'], ['length', '10', '80'], ['contains_alpha'],
                ['contains_alphanumeric'], ['contains_numeric'],
                ['contains_lowercase'], ['contains_uppercase'], ['contains_symbol']
              ]" :validation-messages="{
    length: 'Password must be at least 10 characters long.',
  }" label-class="mb-2 text-xl font-medium" help-class="text-white" input-class="bg-white"
            suffix-icon="eyeClosed" @suffix-icon-click="handleIconClick" suffix-icon-class="bg-white" :sections-schema="{
              suffixIcon: {
                attrs: {
                  style: { padding: '0' }
                }
              }
            }" v-model="formData.password" />

          <FormKit type="password" name="ConfirmPassword" placeholder="********" label="Confirm password"
            help="Confirm your password" validation="required" label-class="mb-2 text-xl font-medium"
            help-class="text-white" suffix-icon="eyeClosed" @suffix-icon-click="handleIconClick"
            suffix-icon-class="bg-white" :sections-schema="{
              suffixIcon: {
                attrs: {
                  style: { padding: '0' },
                },
              },
            }" v-model="formData.confirmPassword"
            :input-class="{ 'border-red-500 focus:border-red-500 bg-white': errorMessage, 'border-green-500 focus:border-green-500 bg-white': passwordMatches }"
            @input="updatePasswordMatch" />

        </FormKit>

        <div v-if="errorMessage" class="text-red-500 text-sm font-xl mt-2">{{ errorMessage }}</div>

        <div class="mt-4 flex justify-center flex-col">
          <NuxtLink to="/login" class="text-sm text-white hover:text-white hover:underline">Back to login</NuxtLink>
        </div>

      </div>
      <div v-else>
        <div v-if="errorMessage">
          <div class="text-white-500 text-sm font-xl mt-2">{{ errorMessage }}</div>
        </div>
        <div v-else-if="errorTokenMessage">
          <div class="text-white-500 text-sm font-xl mt-2">{{ errorTokenMessage }}</div>
        </div>
        <div v-else-if="successMessage">
          <div class="text-white text-sm mb-5">{{ successMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const apiBase = getApiBase();
const route = useRoute()

const formData = ref<PasswordFormDataI>({
  password: '',
  confirmPassword: '',
});

const errorMessage = ref('');
const errorTokenMessage = ref('');
const successMessage = ref('');

const token = route.query.token as string;

if (token === undefined) {
  errorTokenMessage.value = 'Oops! It looks like there was an issue. Please make sure you have a valid link to reset your password.';
}

const handleIconClick = (node: {
  props: {
    suffixIcon: string;
    type: string
  },
}) => {
  node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye';
  node.props.type = node.props.type === 'password' ? 'text' : 'password';
};

const passwordMatches = ref(false);

const updatePasswordMatch = () => {
  if (formData.value.password === formData.value.confirmPassword) {

    errorMessage.value = ''; 
    passwordMatches.value = true;
  } else {
    errorMessage.value = 'Passwords do not match';
    passwordMatches.value = false;
  }
};

watch(() => [formData.value.password, formData.value.confirmPassword], () => {
  updatePasswordMatch();
});


const updatePassword = async () => {

  const { password, confirmPassword } = formData.value;

  try {
    if (password !== confirmPassword) {
      errorMessage.value = 'Passwords do not match';
      return;
    }

    const response = await fetch(`${apiBase}/users/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });

    if (response.status === 200) {
      successMessage.value = 'Your password has been updated successfully.';
    } else {
      errorMessage.value = 'Something went wrong';
    }
  } catch (error) {
    errorMessage.value = 'Something went wrong';
  }
};

</script>
