import Snd from "snd-lib";
import { browser } from "$app/environment";
import { writable, get } from "svelte/store";

let snd: Snd;
let isSoundLoaded = false;
(async () => {
  if (!browser) return;
  snd = new Snd();
  await snd.load(Snd.KITS.SND01);
  isSoundLoaded = true;
})();

export const isSoundEnabledStore = writable(false);

export const playSound = (...[soundKey, options]: Parameters<Snd["play"]>) => {
  if (isSoundLoaded && get(isSoundEnabledStore)) {
    snd.play(soundKey, options);
  }
};
