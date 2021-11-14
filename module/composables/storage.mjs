import { useNuxtApp, useState } from '#app'
import { ref } from 'vue'

export const useStorage = (key='default', options= {}) => {
    const { $fs } = useNuxtApp()
    // init states
    const url = ref(null)
    const state = useState(`${key}StorageUploadState`)
    const uploadDetails = useState(`${key}StorageUploadDetails`)
    const progress = useState(`${key}StorageUploadProgress`)
    const error = useState(`FiresteadError`)
    //reset state defaults
    state.value = false
    uploadDetails.value = {}
    progress.value = 0

    const createRef = async (path, bucket = null) => {
        const storageRef = (await import('@firebase/storage')).ref
        return storageRef($fs.storage(bucket), path)
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