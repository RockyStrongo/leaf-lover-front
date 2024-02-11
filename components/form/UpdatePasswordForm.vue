<template>
  <FormKit type="form" submit-label="Update Password" id="update-password-form" 
    @submit="updatePassword" 
    outer-class=""
    :submit-attrs="{
      inputClass: 'w-full justify-center bg-primary hover:bg-tertiary hover:text-secondary font-medium text-secondary text-current',
    }"
  >
    <Message v-if="successMessage" severity="success">Password updated.</Message>
    <Message v-else-if="submitErrorMessage" severity="error">{{ submitErrorMessage }}</Message>
    <FormKit type="password" name="password" placeholder="********"
      label="New password" help="Your password" 
      v-model="formData.password"
      :validation="[
        ['required'], ['length', '10', '80'], ['contains_alpha'],
        ['contains_alphanumeric'], ['contains_numeric'],
        ['contains_lowercase'], ['contains_uppercase'], ['contains_symbol']
      ]"
      :validation-messages="{
        length: 'Password must be at least 10 characters long.',
      }"
      label-class="mb-2 text-xl font-medium" help-class="text-secondary"
      input-class="bg-white" suffix-icon="eyeClosed"
      @suffix-icon-click="handleIconClick"
      suffix-icon-class="bg-white"
      :sections-schema="{
        suffixIcon: {
          attrs: {
            style: { padding: '0' }
          }
        }
      }"
    />

    <FormKit 
      type="password" name="ConfirmPassword" placeholder="********" 
      label="Confirm password" help="Confirm your password"
      v-model="formData.confirmPassword"
      validation="required"
      label-class="mb-2 text-xl font-medium" help-class="text-secondary"
      :input-class="{
        'bg-white': true,
        'border-red-500 focus:border-red-500 bg-white': errorMessage,
        'border-green-500 focus:border-green-500 bg-white': passwordMatches
      }"
      suffix-icon="eyeClosed" @suffix-icon-click="handleIconClick"
      suffix-icon-class="bg-white"
      :sections-schema="{
        suffixIcon: {
          attrs: {
            style: { padding: '0' },
          },
        },
      }"
      @input="updatePasswordMatch" 
    />

    <div v-if="errorMessage" class="text-red-500 text-sm font-xl mt-2 my-1">
      {{ errorMessage }}
    </div>
  </FormKit>
</template>

<script lang="ts" setup>
  const apiBase = getApiBase();

  const formData = ref<PasswordFormDataI>({
    password: '',
    confirmPassword: '',
  });

  const errorMessage = ref('');
  const submitErrorMessage = ref('');
  const successMessage = ref('');

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

  const handleIconClick = (node: {
  props: {
    suffixIcon: string;
    type: string
  },
}) => {
  node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye';
  node.props.type = node.props.type === 'password' ? 'text' : 'password';
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

    const response = await fetch(`${apiBase}/users/update-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        password,
      }),
    });

    if (response.status === 200) {
      successMessage.value = 'Your password has been updated successfully.';
    } else {
      submitErrorMessage.value = 'Something went wrong';
    }
  } catch (error) {
    submitErrorMessage.value = 'Something went wrong';
  }
};

</script>

<style>

</style>