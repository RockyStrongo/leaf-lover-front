<script setup lang="ts">
import { ref } from 'vue';

const runtimeConfig = useRuntimeConfig();

const startingPhone = function (node: { value: string[] }) {
  return node.value[0] !== '0';
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

const message = ref();
const linkToLoginVisible = ref(false);

const registerUser = async (fields: {
  register: {
    firstStep: {
      firstName: string;
      lastName: string;
      phone: string;
    },
    secondStep: {
      email: string;
      password: string;
      passwordConfirmation: string;
    }
  }
}) => {
  try {
    const { firstName, lastName } = fields.register.firstStep;
    const phoneInput: string | undefined = fields.register.firstStep.phone;
    let phone: string | null = null;
    // re-checking input validity cause this one is optionnal
    const onlyContainsNumbers = (str: string) => /^\d+$/.test(str);
    if (typeof phoneInput === "string" && phoneInput.length === 9 && onlyContainsNumbers(phoneInput) && phoneInput[0] !== '0') {
      phone = "+33".concat(phoneInput);
    }
    const { email, password } = fields.register.secondStep;
    const userBody = { firstName, lastName, email, password, phone };
    const user = await $fetch(`${runtimeConfig.public.apiBase}/users`, {
      method: 'POST',
      body: userBody
    });
    message.value = {
      severity: 'success',
      content: 'Your account has been successfully created.'
    };
    linkToLoginVisible.value = true;
  } catch (error: any) {
    if (error.data && typeof error.data === "string") {
      message.value = {
        severity: 'error',
        content: error.data
      };
    } else message.value = { severity: 'error', content: "An error occured." };
  }
}
</script>

<template>
  <div class="flex justify-center flex-col">
    <div class="card px-5">
      <transition-group name="p-message" tag="div">
        <Message v-if="message" :severity="message.severity" :closable="false">{{ message.content }} </Message>
        <NuxtLink v-if="linkToLoginVisible" class="underline" to="/login">Go to Login page</NuxtLink>
      </transition-group>
    </div>
    <div class="flex justify-center">
      <FormKit type="form" :actions="false" @submit="registerUser">
        <FormKit type="multi-step" name="register" tab-style="progress" next-label="next step"
          :hide-progress-labels="true" :config="{ validationVisibility: 'submit' }" :allow-incomplete="false">
          <FormKit type="step" name="firstStep" class="my-8">
            <FormKit type="text" name="firstName" label="First Name"
              :validation="[['required'], ['length', '3'], ['alpha_spaces', 'default']]" validation-visibility="dirty" />
            <FormKit type="text" name="lastName" label="Last Name"
              :validation="[['required'], ['length', '3'], ['alpha_spaces', 'default']]" validation-visibility="dirty" />
            <!-- <FormKit type="tel" name="phone" label="Phone's number"
              help="Optional: Receive reminders via SMS."
              :sections-schema="{
                prefix: {
                  $el: 'div',
                  attrs: {
                    style: { backgroundColor: 'lightgrey', padding: '5px', marginLeft: '3px', borderRadius: '4px' }
                  },
                  children: '+33'
                }
              }" :validation="[['startingPhone'], ['length', '9', '9'], ['number']]"
              :validation-rules="{ startingPhone }" :validation-messages="{
                startingPhone: 'Avoid the first 0 of your number.'
              }"
              validation-visibility="dirty"
            /> -->
          </FormKit>
          <FormKit type="step" name="secondStep" class="my-8">
            <FormKit name="email" type="email" label="Mail" v-model="mail" :errors="invalidMail"
              :validation="[['required'], ['length', '5', '50'], ['email']]" validation-visibility="dirty" />
            <FormKit type="password" name="password" label="Password" validation-visibility="dirty" :validation="[
              ['required'], ['length', '10', '80'], ['contains_alpha'],
              ['contains_alphanumeric'], ['contains_numeric'],
              ['contains_lowercase'], ['contains_uppercase'], ['contains_symbol']
            ]" :validation-messages="{
  length: 'Password must be at least 10 characters long.',
}" suffix-icon="eyeClosed" @suffix-icon-click="handleIconClick" :sections-schema="{
  suffixIcon: {
    attrs: {
      style: { padding: '0' }
    }
  }
}" />
            <FormKit type="password" label="Confirm password" name="password_confirm" validation-visibility="dirty"
              :validation="[['required'], ['confirm']]" suffix-icon="eyeClosed" @suffix-icon-click="handleIconClick"
              :sections-schema="{
                suffixIcon: {
                  attrs: {
                    style: { padding: '0' }
                  }
                }
              }" />
            <template #stepNext>
              <FormKit type="submit" />
            </template>
          </FormKit>
          <div class="mt-3 underline underline-offset-4 decoration-2">
            <NuxtLink href="/login">Login</NuxtLink>
          </div>
        </FormKit>
      </FormKit>
    </div>
  </div>
</template>