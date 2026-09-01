'use client'
import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from 'react'
import { gameReducer, initialGameState } from '@/lib/game-engine'
import type { GameAction, GameState } from '@/lib/game-types'
import { clearGame, loadGame, saveGame } from '@/lib/storage-adapter'

const GameContext = createContext<{state:GameState;dispatch:React.Dispatch<GameAction>;hydrated:boolean}|null>(null)

export function GameProvider({children}:{children:ReactNode}) {
  const [state,dispatch] = useReducer(gameReducer, initialGameState)
  const [hydrated,setHydrated] = useState(false)
  useEffect(() => {
    const saved = loadGame(localStorage)
    if (saved) dispatch({type:'HYDRATE',state:saved})
    setHydrated(true)
  }, [])
  useEffect(() => { if (hydrated) { if (state.started || state.player.onboarded) saveGame(localStorage,state); else clearGame(localStorage) } },[state,hydrated])
  return <GameContext.Provider value={{state,dispatch,hydrated}}>{children}</GameContext.Provider>
}
export function useGame(){const value=useContext(GameContext);if(!value)throw new Error('useGame must be used within GameProvider');return value}
