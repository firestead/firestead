export type FieldEmits = {
    (eventName: 'update:modelValue', value: any): void
    (eventName: 'change', value: any): void
    (eventName: 'blur', value: any): void
}

export type FielContext = {
    name: string
    value: Ref<any>
    valid: Ref<boolean>
    updateValue: (value: any) => void
}