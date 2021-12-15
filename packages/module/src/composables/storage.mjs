import { useNuxtApp } from '#app'
import { toRefs, set } from '@vue/composition-api'

export const useStorage = (key='default', options= {}) => {
    const { $fs, payload } = useNuxtApp()
    // init state
    if (!(`${key}FirebaseStorage` in payload.state)) {
        set(payload.state, `${key}FirebaseStorage`, {
            url: null,
            state: false,
            progress: 0,
            bytesTransferred: 0,
            totalBytes: 0,
            error: false
        })
    }
    const storageData = payload.state[`${key}FirebaseStorage`]

    let fsStorageRef = null

    const resetStorageData = (error=false) => {
        storageData.url = null
        storageData.state = false
        storageData.progress = 0
        storageData.bytesTransferred = 0
        storageData.totalBytes = 0
        storageData.error = error
        if(error) console.log(error)
    }

    const createRef = async (path, bucket = null) => {
        const { ref } = await $fs.storage.lib()
        try {
            fsStorageRef = ref($fs.storage.connection, path)
            resetStorageData()
        } catch (refError) {
            resetStorageData(refError)
        }
        return true
    }

    const upload = async (file = null, metadata = {}) => {
        let task = null
        if(fsStorageRef && file){
            const { uploadBytesResumable, getDownloadURL } = await $fs.storage.lib()
            task = uploadBytesResumable(fsStorageRef, file, metadata)
            // Listen for state changes, errors, and completion of the upload.
            task.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                storageData.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                storageData.bytesTransferred = snapshot.bytesTransferred
                storageData.totalBytes = snapshot.totalBytes
                switch (snapshot.state) {
                    case 'paused':
                        storageData.state = 'paused'
                        break
                    case 'running':
                        storageData.state = 'running'
                        break
                    default:
                        console.log('Unknown state', snapshot.state)
                        break
                }
            }, 
            (storageError) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                resetStorageData(storageError)
            }, 
            async () => {
                // Upload completed successfully, now we can get the download URL
                storageData.state = 'complete'
                try {
                    storageData.url = await getDownloadURL(task.snapshot.ref)
                } catch (storageError) {
                    resetStorageData(storageError)
                }
            })
        }

        return task
    }

    return {
        ...toRefs(storageData),
        createRef,
        upload
    }
}