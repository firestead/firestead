import { useNuxtApp } from '#app'
import { ref, reactive} from 'vue'

let storage = null

export const useStorage = async (bucket=null) => {
    let fsStorageRef = null
    if(process.client){
        const { $fs } = useNuxtApp()
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

export const useStorageUpload = () => {
    const url = ref(null)
    const status = reactive({
        progress: 0,
        bytesTransferred: 0,
        totalBytes: 0,
        state: null
    })
    const error = ref(null)

    const upload = (fsStorageRef, file = null, metadata = {}) => {
        const task = storage.uploadBytesResumable(fsStorageRef, file, metadata)
        // Listen for state changes, errors, and completion of the upload.
        task.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            status.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            status.bytesTransferred = snapshot.bytesTransferred
            status.totalBytes = snapshot.totalBytes
            switch (snapshot.state) {
            case 'paused':
                status.state = 'paused'
                break
            case 'running':
                status.state = 'running'
                break
            }
        }, 
        (storageError) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            error.value = storageError
        }, 
        async () => {
            // Upload completed successfully, now we can get the download URL
            url.value = await storage.getDownloadURL(task.snapshot.ref)
        })

        return task
    }

    return {
        url,
        status,
        error,
        upload
    }
}