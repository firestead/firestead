export function transformBoolean(value: boolean | string): 'true' | 'false' | undefined {
    if (typeof value === 'string' && ['true', 'false'].includes(value)) {
        return value as 'true' | 'false'
    }
    if (typeof value === 'boolean') {
        return value ? 'true' : 'false' as 'true' | 'false'
    }
    return value as any
}