import { REGEX_SONG_ID_FROM_URL } from '@/constants/regex'

export const getSongIdFromUrl = (url?: string) => (url ?? '').match(REGEX_SONG_ID_FROM_URL)?.[0]
export const isSpotifyUrl = (url?: string): boolean => REGEX_SONG_ID_FROM_URL.test(url ?? '')
