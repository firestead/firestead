<template>
    <div class="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <div class="border-4 border-dashed border-gray-200 rounded-lg p-10">
            <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div v-if="isAuthenticated">
                    <div class="sm:mx-auto sm:w-full sm:max-w-md py-4">
                        User logged in {{user.email}}
                        <button @click.prevent="logout" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Logout
                        </button>
                    </div>
                </div>
                <div v-if="!isAuthenticated">
                    <div class="sm:mx-auto sm:w-full sm:max-w-md py-4">
                        <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            {{ signupForm? 'Create a new account' : 'Sign in to your account' }} 
                        </h2>
                        <p class="mt-2 text-center text-sm text-gray-600">
                            Or
                            {{ ' ' }}
                            <a @click="toggleSignup()" class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                                {{ signupForm? 'Sign in' : 'Sign up' }} 
                            </a>
                        </p>
                    </div>
                    <div class="bg-white py-8 px-4 sm:px-10">
                        <form
                            class="space-y-6"
                            @submit.prevent="signupForm? signUp() : login()">
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div class="mt-1">
                                    <input name="email" type="email" v-model="email" autocomplete="email" required="" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                            </div>
                            <div>
                                <label for="password" class="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div class="mt-1">
                                    <input name="password" type="password" v-model="password" autocomplete="current-password" required="" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                            </div>
                            <div>
                                <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    {{ signupForm? 'Sign up' : 'Login' }} 
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, isAuthenticated, user } = useAuth()

    const email = ref('')
    const password = ref('')
    const signupForm = ref(false)

    const toggleSignup = () => {
        signupForm.value = !signupForm.value 
    }
     const login = async() => {
        await signInWithEmailAndPassword(email.value, password.value)
     }
     const signUp = async () => {
        await createUserWithEmailAndPassword(email.value, password.value)
     }
     const logout = async () => {
        await signOut()
     }
     watch(isAuthenticated,(authenticated)=>{
         console.log(authenticated)
     })
</script>