<template>
    <div class="pb-10">
        <fs-modal-form ref="envVarsModal" v-model="envVar" @submit="saveEnvVar" :title="envVar?.name ? 'Update EnvVariable': 'Create new EnvVariable'">
            <fs-input 
                label="Name" 
                name="name" 
                :required="true"
                :rules="[{
                    validator: (envName) => envName.match(/^[A-Z]+(?:_[A-Z]+)*$/) ? true : false,
                    error: {
                        message: 'Name can contain only uppercase letters and underscores'
                    }
                }]"></fs-input>
            <fs-input label="Value" name="value" :required="true" class="mt-2"></fs-input>
            <div class="mt-2">
                <label class="block text-sm font-medium mb-1 text-gray-700">Runtime</label>
                <div class="flex flex-row">
                    <fs-checkbox-button name="runtime.public">
                        <NuxtLogo class="h-6 w-6"></NuxtLogo>
                        <span class="ml-1">Public</span>
                    </fs-checkbox-button>
                    <fs-checkbox-button name="runtime.private" class="ml-2">
                        <NuxtLogo class="h-6 w-6"></NuxtLogo>
                        <span class="ml-1">Private</span>
                    </fs-checkbox-button>
                    <fs-checkbox-button name="runtime.firebase" class="ml-2">
                        <FirebaseLogo class="h-6 w-6"></FirebaseLogo>
                        <span class="ml-1">Firebase</span>
                    </fs-checkbox-button>
                </div>
            </div>
        </fs-modal-form>
        <fs-modal-confirm ref="confirmModal" @confirm="deleteEnvVar"></fs-modal-confirm>
        <div class="border-b pb-4 border-gray-200">
            <router-link :to="`/operations/environments`" class="hidden md:flex items-center text-sm font-medium text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                <span class="leading-6">Environments</span>
            </router-link>
            <div class="flex items-center pt-3 pb-1">
                <FirebaseLogo class="h-8 w-8"></FirebaseLogo>
                <span class="ml-2">{{envName}}</span>
            </div>
        </div>
        <div class="bg-white mt-10 shadow sm:rounded-lg">
            <div class="flex justify-between px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Env Variables</h3>      
                <button @click="showEnvVarModal" type="button" class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-orange-400 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="pl-2">Add</span>
                </button>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl class="divide-y divide-gray-200">
                    <div 
                        v-for="(envVar, key) in envVariables"
                        v-bind:key="key"
                        class="py-3 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">{{ key }}</dt>
                        <dd class="relative mt-1 flex flex-col sm:flex-row text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <span class="flex-grow">{{envVar.value}}</span>
                            <div class="flex flex-row mt-4 sm:mr-4 sm:mt-0 flex-shrink-0">
                                <button
                                    @click.prevent="editRuntimeEnvVar(key,'public')"
                                    class="flex items-center border p-1 rounded-lg text-xs"
                                    :class="envVar.runtime.public ? 'font-light border-orange-300' : 'font-thin opacity-50'"
                                    >
                                    <NuxtLogo class="h-3 w-3"></NuxtLogo>
                                    <span class="ml-1">Public</span>
                                </button>
                                <button
                                    @click.prevent="editRuntimeEnvVar(key,'private')" 
                                    class="flex items-center ml-2 border p-1 rounded-lg text-xs"
                                    :class="envVar.runtime.private ? 'font-light border-orange-300' : 'font-thin opacity-50'">
                                    <NuxtLogo class="h-3 w-3"></NuxtLogo>
                                    <span class="ml-1">Private</span>
                                </button>
                                <button
                                    @click.prevent="editRuntimeEnvVar(key,'firebase')" 
                                    class="flex items-center ml-2 border p-1 rounded-lg text-xs"
                                    :class="envVar.runtime.firebase ? 'font-light border-orange-300' : 'font-thin opacity-50'">
                                    <FirebaseLogo class="h-3 w-3"></FirebaseLogo>
                                    <span class="ml-1">Firebase</span>
                                </button>
                            </div>
                            <!--Edit/Delete Menu-->
                            <div class="absolute right-0 sm:relative ml-4">
                                <fs-dropdown
                                    :menuItems="[
                                        {
                                            text: 'Edit',
                                            data: {
                                                name: key,
                                                value: envVar.value,
                                                runtime: envVar.runtime
                                            },
                                            action: showEnvVarModal
                                        },
                                        {
                                            text: 'Delete',
                                            data: key,
                                            action: showConfirmModal
                                        }
                                    ]"
                                    ></fs-dropdown>
                            </div>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
        <div class="bg-white mt-8 shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Firebase Config</h3>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl class="sm:divide-y sm:divide-gray-200">
                    <div 
                        v-for="(value, key) in config"
                        v-bind:key="key"
                        class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">{{ key }}</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{value}}</dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>
</template>
<script setup>
    import FirebaseLogo from '#assets/firebase/logo-logomark.svg'
    import NuxtLogo from '#assets/frameworks/nuxt-logo.svg'
    
    const { subscribe, pick, post } = useFirestead('getEnviroments')

    const { params } = useRoute()

    const confirmModal = ref(null)
    const envVarsModal = ref(null)
    const envVar = ref({})

    const envName = pick((data) => {
        return data.envs[params.id]?.name
    })

    const config = pick((data) => {
        return data.envs[params.id]?.config
    })

    const envVariables = pick((data) => {
        return data.envs[params.id]?.envVariables
    })

    const showConfirmModal = (key) => {
        confirmModal.value.show(key)
    }

    const showEnvVarModal = (data={}) => {
        envVar.value = data
        envVarsModal.value.show(data?.name)
    }

    const saveEnvVar = (formData, oldKey) => {
        if(formData.name.updated && oldKey){
            //DELETE old data
            post(`environments`, '__DELETE__',{
                createObject: `envs.${params.id}.envVariables.${oldKey}`
            })
        }
        //overwrite or create envVar
        post(`environments`, { 
            value: envVar.value.value,
            runtime: envVar.value.runtime
         },{
            createObject: `envs.${params.id}.envVariables.${envVar.value.name}`
        })
        envVarsModal.value.close()
    }

    const editRuntimeEnvVar = (key, runtime) => {
        envVariables.value[key].runtime[runtime] = !envVariables.value[key].runtime[runtime]
        post(`environments`, { ...envVariables.value[key] },{
            createObject: `envs.${params.id}.envVariables.${key}`
        })
    }

    const deleteEnvVar = (key) => {
        post(`environments`, '__DELETE__',{
            createObject: `envs.${params.id}.envVariables.${key}`
        })
    }

    subscribe('environments')
</script>