
type StatusMessage = {
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
}

type NotificationsMessage = {
    type: 'status' | Omit<string, 'status'>
    timer: ReturnType<typeof setTimeout>
    data: StatusMessage | Record<string, any>
}

type Notifications = {
    timeout: number
    messages: NotificationsMessage[]
}

type NotificationOptions = {
    timeout?: number
}

const notificationsState = () => useState<Notifications>('notifications', () => ({
    timeout: 5000,
    messages: []
}))

export function useNotifications(options: NotificationOptions = {}){
    const {timeout = 5000} = options
    const notifications = notificationsState()

    const clearNotification = (index: number) => {
        notifications.value.messages.shift()
    }

    const addNotification = (type: NotificationsMessage['type'], data: NotificationsMessage['data']) => {
        const timer = setTimeout(clearNotification, timeout)
        notifications.value.messages.push({
            type, 
            timer, 
            data
        })
    }
}