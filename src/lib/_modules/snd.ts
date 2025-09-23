import Snd from "snd-lib";

let snd: Snd;
let isSoundLoaded = false;

// Svelte のstoreを移植したもの
// TODO: Jotaiとか作ったほうがシンプルな気がする
type Subscriber<T> = (value: T) => void;

class SimpleStore<T> {
  private value: T;
  private subscribers = new Set<Subscriber<T>>();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  subscribe(subscriber: Subscriber<T>) {
    this.subscribers.add(subscriber);
    subscriber(this.value); // immediately call with current value
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  update(updater: (value: T) => T) {
    this.value = updater(this.value);
    this.subscribers.forEach(subscriber => subscriber(this.value));
  }

  get() {
    return this.value;
  }
}

(async () => {
  if (typeof window !== 'undefined') {
    snd = new Snd();
    await snd.load(Snd.KITS.SND01);
    isSoundLoaded = true;
  }
})();

export const isSoundEnabledStore = new SimpleStore(false);

export const playSound = (...[soundKey, options]: Parameters<Snd["play"]>) => {
  if (isSoundLoaded && isSoundEnabledStore.get()) {
    snd.play(soundKey, options);
  }
};
