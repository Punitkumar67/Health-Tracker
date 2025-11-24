// src/utils/storage.js
const KEY = 'pht_items_v1';

export function readItems() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('readItems err', e);
    return [];
  }
}

export function writeItems(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch (e) {
    console.error('writeItems err', e);
  }
}

// helpers
export function addItem(item) {
  const items = readItems();
  items.push(item);
  writeItems(items);
}

export function getLast7DaysItems() {
  const items = readItems();
  const now = new Date();
  const ms7 = 7 * 24 * 3600 * 1000;
  return items.filter(it => (new Date(it.time)).getTime() >= (now.getTime() - ms7));
}
