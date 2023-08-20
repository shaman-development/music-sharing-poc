export const isNotificationSupported = () => !!window && 'Notification' in window;

export const isNotificationPermitted = () => 'permission' in Notification && Notification.permission === 'granted';
export const isNotificationDenied = () => 'permission' in Notification && Notification.permission === 'denied';

export const requestPermission = async () => {
    if (!isNotificationSupported())
        return

    if ('permission' in Notification && Notification.permission !== 'denied')
        return await Notification.requestPermission()
}