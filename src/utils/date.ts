export const formatDate = (date: Date | number | string): string => {
    if (date instanceof Date) return date.toLocaleString();

    return new Date(date).toLocaleString()
}

export const formatDateToIsoString = (date: Date | number | string): string => {
    if (date instanceof Date) return date.toISOString();

    return new Date(date).toISOString()
}