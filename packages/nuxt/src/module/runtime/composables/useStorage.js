import { useNuxtApp } from '#app'
import { toRefs } from 'vue'

export const useStorage = (key='default', options= {}) => {
    const { $fs, payload } = useNuxtApp()
    // init state
    if (!(`${key}FirebaseStorage` in payload.state)) {
        payload.state[`${key}FirebaseStorage`] = {
            url: null,
            state: false,
            progress: 0,
            bytesTransferred: 0,
            totalBytes: 0,
            error: false
        }
    }
    const storageData = payload.state[`${key}FirebaseStorage`]

    let uploadTask = null

    const resetStorageData = (error=false) => {
        storageData.url = null
        storageData.state = false
        storageData.progress = 0
        storageData.bytesTransferred = 0
        storageData.totalBytes = 0
        storageData.error = error
        if(error) console.log(error)
    }

    const pause = () => {
        if(uploadTask) uploadTask.pause()
    }

    const resume = () => {
        if(uploadTask) uploadTask.resume()
    }

    const cancel = () => {
        if(uploadTask) uploadTask.cancel()
    }

    const upload = async (file = null, opts = {}) => {
        const options = Object.assign({
            name: false,
            path: '',
            url: true,
            bucket: 'default',
            metadata: {}
        }, opts)
        if(!file)  throw new Error('No file to upload')
        const promise = new Promise(async (resolve, reject) => {
            const { ref: storageRef, uploadBytesResumable, getDownloadURL } = await $fs.storage.lib()
            const fileRef = {
                name: options.name? options.name : file.name,
                path: options.path,
                fullPath: null,
                bucket: options.bucket
            }
            if(options.path === '') {
                fileRef.fullPath = fileRef.name
            }else{
                fileRef.fullPath = `${fileRef.path}/${fileRef.name}`
            }
            const fsStorageRef = storageRef(await $fs.storage.connection(), fileRef.fullPath)
            uploadTask = uploadBytesResumable(fsStorageRef, file, options.metadata)
            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
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
                reject(storageError)
            }, 
            async () => {
                try {
                    // Upload completed successfully, now we can get the download URL
                    if(options.url){
                        storageData.url = await getDownloadURL(uploadTask.snapshot.ref)
                        fileRef.url = storageData.url
                    }
                    storageData.state = 'complete'
                    resolve(fileRef)
                } catch (storageError) {
                    resetStorageData(storageError)
                    reject(storageError)
                }
            })
        })
        return promise
    }

    /*
    * TODO: define file object format
    */
    const fsDeleteObject = async (fileObject) => {
        const { ref: storageRef, deleteObject } = await $fs.storage.lib()
        const objectRef = storageRef(await $fs.storage.connection(),fileObject.fullPath)
        try {
            await deleteObject(objectRef)
        } catch (storageError) {
            resetStorageData(storageError)
        }
    }

    return {
        ...toRefs(storageData),
        deleteObject: fsDeleteObject,
        upload,
        pause,
        resume,
        cancel
    }
}