import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const storedToken = browser ? localStorage.getItem('jwt') : null;

export const token = writable(storedToken);

token.subscribe((value) => {
    if (browser) {
        if (value) {
            localStorage.setItem('jwt', value);
        } else {
            localStorage.removeItem('jwt');
        }
    }
});