import { REGEX_SONG_ID_FROM_URL } from '@/constants/regex'

export const getSongIdFromUrl = (url?: string) => {
    console.log((url ?? '').match(REGEX_SONG_ID_FROM_URL))
    return (url ?? '').match(REGEX_SONG_ID_FROM_URL)?.[1]
}
export const isSpotifyUrl = (url?: string): boolean => REGEX_SONG_ID_FROM_URL.test(url ?? '')
