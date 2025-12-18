import { openDB, IDBPDatabase } from 'idb';
import { ProgressRecord } from '../types/cards';

type ProgressMap = Record<string, ProgressRecord>;

const DB_NAME = 'wortklar-db';
const DB_VERSION = 1;
const STORE_NAME = 'progress';

let dbPromise: Promise<IDBPDatabase | null> | null = null;
const memoryFallback: ProgressMap = {};
let storageUnavailable = false;

function initDb() {
  if (dbPromise) return dbPromise;

  dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    }
  }).catch(() => {
    storageUnavailable = true;
    return null;
  });

  return dbPromise;
}

export function isStorageUnavailable() {
  return storageUnavailable;
}

export async function getProgress(cardId: string): Promise<ProgressRecord | undefined> {
  const db = await initDb();
  if (!db) return memoryFallback[cardId];
  try {
    return (await db.get(STORE_NAME, cardId)) as ProgressRecord | undefined;
  } catch {
    storageUnavailable = true;
    return memoryFallback[cardId];
  }
}

export async function setProgress(cardId: string, progress: ProgressRecord): Promise<void> {
  const db = await initDb();
  if (!db) {
    memoryFallback[cardId] = progress;
    return;
  }
  try {
    await db.put(STORE_NAME, progress, cardId);
  } catch {
    storageUnavailable = true;
    memoryFallback[cardId] = progress;
  }
}

export async function bulkGetProgress(cardIds: string[]): Promise<ProgressMap> {
  const db = await initDb();
  if (!db) {
    return cardIds.reduce<ProgressMap>((acc, id) => {
      if (memoryFallback[id]) acc[id] = memoryFallback[id];
      return acc;
    }, {});
  }
  try {
    const entries: Array<[string, ProgressRecord | undefined]> = await Promise.all(
      cardIds.map(async (id) => [id, (await db.get(STORE_NAME, id)) as ProgressRecord | undefined])
    );
    return entries.reduce<ProgressMap>((acc, [id, val]) => {
      if (val) acc[id] = val;
      return acc;
    }, {});
  } catch {
    storageUnavailable = true;
    return cardIds.reduce<ProgressMap>((acc, id) => {
      if (memoryFallback[id]) acc[id] = memoryFallback[id];
      return acc;
    }, {});
  }
}

export async function resetAllProgress(): Promise<void> {
  const db = await initDb();
  Object.keys(memoryFallback).forEach((key) => delete memoryFallback[key]);
  if (!db) return;
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.clear();
    await tx.done;
  } catch {
    storageUnavailable = true;
  }
}
