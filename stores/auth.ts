import { defineStore } from 'pinia'
import type { UserCookie } from '~/types/UserCookie'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const userCookie = useCookie('userInfo')

    if (userCookie.value) {
      const user = userCookie.value as unknown as UserCookie
      return {
        isConnected: true,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
      }
    }

    return {
      isConnected: false,
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      isVerified: false,
    }
  },
  actions: {
    resetState() {
      this.isConnected = false
      this.id = null
      this.firstName = null
      this.lastName = null
      this.email = null
    },
    logout: async function () {
      const apiBase = getApiBase()

      const response = await fetch(`${apiBase}/users/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      this.resetState()
    },
    login: async function (email: string, password: string) {
      const apiBase = getApiBase()

      const response = await fetch(`${apiBase}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      
      if (response.status === 200) {
        const jsonResponse = await response.json();
        const user = jsonResponse.user;
        this.isConnected = true
        this.id = user.id
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.email = user.email
        this.isVerified = user.isVerified
      }

      return response
    },
    update: async function (userPatch:{
      firstName: string | null, 
      lastName: string | null, 
      email: string | null}
    ) {
      if (!userPatch.firstName || !userPatch.lastName || !userPatch.email) return null;
      const userBody = { 
        firstName: userPatch.firstName, 
        lastName : userPatch.lastName,
        email: userPatch.email, 
      };
      try {
        const apiBase = getApiBase();
        const response =  await fetch(`${apiBase}/users`, {
          method: 'PATCH',
          body: JSON.stringify(userBody),
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.status === 200) {
          this.firstName = userPatch.firstName;
          this.lastName = userPatch.lastName;
          this.email = userPatch.email;
          return response;
        }
      } catch (error) {
        console.log(error)
      }
      return null;
    }
  },
})
