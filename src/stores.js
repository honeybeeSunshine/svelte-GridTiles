import { writable } from 'svelte/store';

export let unlockTiles = writable(false);
export let showDrops = writable(false);
export let activeTile = writable(null);
export let dropTarget = writable(null);
export let dragOrigin = writable(null);

export let currentLayout = writable([]);
