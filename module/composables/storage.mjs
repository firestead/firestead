import { useNuxtApp, useState } from '#app'
import { ref } from 'vue'

let storage = null

export const useStorage = async (bucket=null, $fs = null) => {
    let fsStorageRef = null
    if(process.client){
        if(!$fs) $fs = useNuxtApp().$fs
        if(!storage) storage = await import('@firebase/storage').then(storage => storage.default || storage)
        fsStorageRef = (storagePath) => storage.ref($fs.storage(bucket), storagePath)
    }
    return {
        storageRef: fsStorageRef,
        uploadBytes: storage?.uploadBytes || null,
        uploadString: storage?.uploadString || null,
        uploadBytesResumable: storage?.uploadBytesResumable || null,
        getDownloadURL: storage?.getDownloadURL || null
    }
}

export const useStorageUpload = (key='default') => {
    const { $fs } = useNuxtApp()

    const url = ref(null)
    const state = useState(`${key}StorageUploadState`)
    const uploadDetails = useState(`${key}StorageUploadDetails`)
    const progress = useState(`${key}StorageUploadProgress`)
    const error = useState(`FiresteadError`)
    let fsStorageRef = null

    //reset states
    state.value = false
    uploadDetails.value = {}
    progress.value = 0

    const createRef = async (path, bucket = null) => {
        const { storageRef } = await useStorage(bucket, $fs)
        fsStorageRef = storageRef(path)
    }

    const upload = async (file = null, metadata = {}) => {
        let task = null
        if(fsStorageRef && file){
            const { uploadBytesResumable, getDownloadURL } = await useStorage(null, $fs)
            task = uploadBytesResumable(fsStorageRef, file, metadata)
            // Listen for state changes, errors, and completion of the upload.
            task.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                progress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                uploadDetails.value.bytesTransferred = snapshot.bytesTransferred
                uploadDetails.value.totalBytes = snapshot.totalBytes
                switch (snapshot.state) {
                    case 'paused':
                        state.value = 'paused'
                        break
                    case 'running':
                        state.value = 'running'
                        break
                    default:
                        console.log('Unknown state', snapshot.state)
                        break
                }
            }, 
            (storageError) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                error.value = storageError
                console.log(storageError)
            }, 
            async () => {
                // Upload completed successfully, now we can get the download URL
                state.value = 'complete'
                try {
                    url.value = await getDownloadURL(task.snapshot.ref)
                } catch (storageError) {
                    error.value = storageError
                    console.log(storageError)
                }
            })
        }

        return task
    }

    return {
        url,
        state,
        uploadDetails,
        progress,
        error,
        createRef,
        upload
    }
}