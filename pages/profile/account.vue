<template>
    <div class="flex flex-col items-center">
        <Message v-if="isMailSended" severity="success">Mail sent.</Message>
        <Message v-if="isUserUpdated" severity="success">Profile updated.</Message>
        <Message v-if="isError" severity="error">Unexpected error : {{ errorMessage }}</Message>
        <h2 class="m-5 text-center text-2xl text-primary">{{ firstName }} {{ lastName }}</h2>
        <div class="text-tertiary flex flex-col">
            <FormKit type="form" submit-label="Modify" id="update-user" @submit="modifyUserInfo" outer-class=""
                :submit-attrs="{
                    inputClass: 'w-full justify-center bg-primary hover:bg-tertiary hover:text-secondary font-medium text-secondary text-current',
                }">
                <FormKit type="text" name="firstName" id="firstName" label="First name" help="Your first name"
                    validation="required" placeholder="" v-model="formData.firstName" label-class="mb-2 text-xl font-medium"
                    help-class="text-secondary" input-class="bg-white sm:w-96 md:w-full lg:w-full" />
                <FormKit type="text" name="lastName" id="lastName" label="Last name" help="Last Name" validation="required"
                    placeholder="“jon.doe@mail.com”" v-model="formData.lastName" label-class="mb-2 text-xl font-medium"
                    help-class="text-secondary" input-class="bg-white sm:w-96 md:w-full lg:w-full" />
                <div class="flex justify-center" :class="{ 'space-x-3': !isVerified }">
                    <div class="grow">
                        <FormKit type="email" name="email" id="email" label="Email" help="Your email"
                            validation="required|email" v-model="formData.email" label-class="mb-2 text-xl font-medium"
                            help-class="text-secondary" input-class="bg-white md:w-96" />
                    </div>
                    <div data-family="button" class="self-end mb-1 grow-0">
                        <Button v-if="!isVerified" @click="resendVerificationMail" :disabled="isMailSended"
                            class="w-full flex justify-center mb-8 border-primary bg-primary hover:bg-tertiary text-secondary text-sm">
                            Verify email
                        </Button>
                    </div>
                </div>
            </FormKit>
            <div>
                <FormUpdatePasswordForm />
            </div>
        </div>
    </div>
</template>
 
<script setup lang="ts">
definePageMeta({
    middleware: [
        'auth',
    ],
});
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth'

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
};

const isMailSended = ref(false);
const isUserUpdated = ref(false);
const isError = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();
// these returns ComputedRef<string | null>
const { firstName, lastName, email, isVerified } = storeToRefs(authStore);

// but we need 100% string type so
const strStoreData = {
    firstName: firstName.value === null ? '' : firstName.value.toString(),
    lastName: lastName.value === null ? '' : lastName.value.toString(),
    email: email.value === null ? '' : email.value.toString(),
}
const formData = ref<FormData>({
    firstName: strStoreData.firstName,
    lastName: strStoreData.lastName,
    email: strStoreData.email
});


const apiBase = getApiBase();

const resendVerificationMail = async () => {
    try {
        const resp = await fetch(`${apiBase}/users/resend-email-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (resp.status === 200) isMailSended.value = true;
    } catch (error) {
        isError.value = true;
        console.log(error);
    }
}

const modifyUserInfo = async () => {
    const { email, firstName, lastName } = formData.value;
    try {
        const respUpdate = await authStore.update({ firstName, lastName, email });
        if (!respUpdate) {
            isError.value = true;
            errorMessage.value = 'Unexpected error, please try again.';
            return;
        }
        if (respUpdate.status === 200) isUserUpdated.value = true;
    } catch (error) {
        isError.value = true;
        console.log(error);
    }
}

</script>