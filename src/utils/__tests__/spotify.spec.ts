import {describe, it, expect} from "vitest";
import {getSongIdFromUrl, isSpotifyUrl} from "../spotify";

describe('getSongIdFromUrl', () => {
    it.each([
        ['https://open.spotify.com/track/7s8VgA8OjvwBUuigKzEGBx?si=a5c2012c6d764559', '7s8VgA8OjvwBUuigKzEGBx'],
        ['https://open.spotify.com/track/12oi3joi123j1n3n4i2n23?si=1123143243234fwf', '12oi3joi123j1n3n4i2n23'],
        ['https://open.spotify.com/track/7s8VgA8OjvwBUuigKzEGBx', '7s8VgA8OjvwBUuigKzEGBx'],
        ['http://open.spotify.com/track/7s8VgA8OjvwBUuigKzEGBx', '7s8VgA8OjvwBUuigKzEGBx'],
        ['https://open.spotify.com/embed/track/7s8VgA8OjvwBUuigKzEGBx', '7s8VgA8OjvwBUuigKzEGBx'],
        ['https://open.spotify.com/embed/track/7s8VgA8OjvwBUuigKzEGBx?utm_source=generator&theme=0', '7s8VgA8OjvwBUuigKzEGBx'],
        ['http://open.spotify.com/embed/track/7s8VgA8OjvwBUuigKzEGBx?utm_source=generator&theme=0', '7s8VgA8OjvwBUuigKzEGBx'],
        ['https://google.com/', undefined],
        [undefined, undefined],
    ])('for %s should return %s', (url, result) => {
        expect(getSongIdFromUrl(url)).toBe(result);
    })
})
describe('isSpotifyUrl', () => {
    it.each([
        ['https://open.spotify.com/track/7s8VgA8OjvwBUuigKzEGBx?si=a5c2012c6d764559', true],
        ['https://open.spotify.com/track/12oi3joi123j1n3n4i2n23?si=1123143243234fwf', true],
        ['https://open.spotify.com/track/7s8VgA8OjvwBUuigKzEGBx', true],
        ['http://open.spotify.com/track/7s8VgA8OjvwBUuigKzEGBx', true],
        ['https://open.spotify.com/embed/track/7s8VgA8OjvwBUuigKzEGBx', true],
        ['https://open.spotify.com/embed/track/7s8VgA8OjvwBUuigKzEGBx?utm_source=generator&theme=0', true],
        ['http://open.spotify.com/embed/track/7s8VgA8OjvwBUuigKzEGBx?utm_source=generator&theme=0', true],
        ['https://google.com/', false],
        [undefined, false],
        ['lorem ipsum', false],
    ])('for %s should return %s', (url, result) => {
        expect(isSpotifyUrl(url)).toBe(result);
    })
})