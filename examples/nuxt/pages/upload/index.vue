<template>
    <div class="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <div class="h-96 border-4 border-dashed border-gray-200 rounded-lg p-10">
            <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div class="px-4 py-5 sm:p-6">
                    <span>{{url}}</span>
                    <div>
                        <h3>Progress</h3>
                        <span>{{progress}}</span>
                    </div>
                </div>
                <div class="px-6 py-6 sm:px-6">
                    <form enctype="multipart/form-data">
                        <label>Choose image</label>
                        <div class="mt-6">
                            <input name="file" v-on:change="watchFile" type="file" size="50" accept="image/*"> 
                        </div>
                        <div class="mt-6">
                            <button type="button" v-on:click.prevent="clickUpload" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Upload
                            </button>
                            <button type="button" v-on:click.prevent="pause()" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Pause
                            </button>
                            <button type="button" v-on:click.prevent="resume()" class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Resume
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    const {url, progress, upload, pause, resume} = useStorage()

    let file = null

    const watchFile = async (e)=>{
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        file = files[0]
    }

    const clickUpload = async () => {
        if(file){
            const fileRef = await upload(file, {
                path: 'images'
            })
            console.log(fileRef)
        }
    }


</script>