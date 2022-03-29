<template>
    <div class="px-6 py-4">
        <!-- 
            form modal
            edit firebase config
        -->
        <fs-modal-form
            ref="environmentModal"
            v-model="currentEnv"
            @submit="createEnvironment" 
            title="Create New Environment"
            submitButtonText="Create"
        >
            <fs-input label="Name" name="name" :required="true" class="mt-2"></fs-input>
            <fs-input label="Project Id" name="projectId" class="mt-2"></fs-input>
        </fs-modal-form>
        <!--
            delete confirm modal
        -->
        <fs-modal-confirm ref="confirmModal" @confirm="deleteEnvironment"></fs-modal-confirm>

        <div class="flex justify-between pb-4 border-b border-gray-200">
            <h3 class="text-lg self-center leading-6 font-medium text-gray-900">Environments</h3> 
            <fs-button @click="showCreateEnvModal" icon="add">Add</fs-button>
        </div>
        <div class="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" class="divide-y divide-gray-200">
                <li 
                    v-for="(env, id) in result.envs"
                    v-bind:key="id"
                    >
                    <router-link :to="`/operations/environments/${id}`" class="block hover:bg-gray-50">
                        <div class="relative px-4 py-4 sm:px-6">
                            <div class="flex items-center justify-between">
                                <p class="text-sm font-medium text-gray-600 truncate">{{env.name}}</p>
                                <div v-if="result.current === id" class="mr-8 flex-shrink-0 flex">
                                    <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</p>
                                </div>
                            </div>
                            <div class="mt-2 sm:flex sm:justify-between">
                                <div class="text-xs ">
                                    <span class="text-gray-500">Project: </span>
                                    <span class="font-thin">{{env?.config?.projectId}}</span>
                                </div>
                            </div>
                            <div v-if="['dev','prod'].indexOf(id) === -1" class="absolute z-10 right-2 top-3">
                                <fs-button @click.prevent="showDeleteEnvModal(id)" icon="trash"></fs-button>
                            </div>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
    const { result, subscribe, post } = useFirestead('getEnviroments')

    const environmentModal = ref(null)
    const confirmModal = ref(null)
    const currentEnv = ref({})

    const showCreateEnvModal = () => {
        currentEnv.value = {}
        environmentModal.value.show()
    }

    const createEnvironment = (formData) => {
        const envKey = formData.name.value.replace(/[^\w\s]/gi, '').toLowerCase()
        currentEnv.value = {
            name: formData.name.value,
            config: {
                projectId: formData.projectId.value || `demo-${envKey}`
            }
        }
        post(`environments`, {...currentEnv.value},{
            createObject: `envs.${envKey}`
        })
        environmentModal.value.close()
    }

    const showDeleteEnvModal = (envKey) =>{
        confirmModal.value.show(envKey)
    }

    const deleteEnvironment = (envKey) => {
        post(`environments`, '__DELETE__', {
            createObject: `envs.${envKey}`
        })
    }

    subscribe('environments')
</script>