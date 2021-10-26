import {inject} from 'vue'

export const useFirestead = () => {
    const fs = inject('fs')
    return fs
}