'use client'
import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from 'react'
import { gameReducer, initialGameState } from '@/lib/game-engine'
import type { GameAction, GameState } from '@/lib/game-types'

const STORAGE_KEY = 'ravo-game-v1'
const GameContext = createContext<{state:GameState;dispatch:React.Dispatch<GameAction>;hydrated:boolean}|null>(null)

export function GameProvider({children}:{children:ReactNode}) {
  const [state,dispatch] = useReducer(gameReducer, initialGameState)
  const [hydrated,setHydrated] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) { try { dispatch({type:'HYDRATE',state:JSON.parse(saved) as GameState}) } catch { localStorage.removeItem(STORAGE_KEY) } }
    setHydrated(true)
  }, [])
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE_KEY,JSON.stringify(state)) },[state,hydrated])
  return <GameContext.Provider value={{state,dispatch,hydrated}}>{children}</GameContext.Provider>
}
export function useGame(){const value=useContext(GameContext);if(!value)throw new Error('useGame must be used within GameProvider');return value}
