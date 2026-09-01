import type { GameState } from './game-types'

export const STORAGE_KEY = 'ravo-game-v1'

export interface StoragePort {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function loadGame(storage: StoragePort): GameState | null {
  const value = storage.getItem(STORAGE_KEY)
  if (!value) return null
  try { return JSON.parse(value) as GameState } catch { storage.removeItem(STORAGE_KEY); return null }
}

export function saveGame(storage: StoragePort, state: GameState) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearGame(storage: StoragePort) { storage.removeItem(STORAGE_KEY) }
