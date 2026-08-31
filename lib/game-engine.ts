import { missions } from '@/data/belem-content'
import type { GameAction, GameState, MissionId, MissionStatus } from './game-types'
import { applyMissionReward } from './reward-engine'

export const initialGameState: GameState = {version:1,started:false,activeMission:null,completedMissions:[],xp:0,ravos:0,fragments:[],keys:0,medals:[],xpHistory:[],ravoTransactions:[]}

export function getLevel(xp: number) {
  const safe = Math.max(0, xp)
  const thresholds = [0, 500, 1250, 2250, 3500, 5000]
  let level = 1
  thresholds.forEach((value, index) => { if (safe >= value) level = index + 1 })
  const floor = thresholds[level - 1]
  const ceiling = thresholds[level] ?? floor + 2000
  return {level, title: level >= 5 ? 'Guardião' : level >= 3 ? 'Cartógrafo' : 'Explorador', current:safe-floor, needed:ceiling-floor, total:safe}
}

export function getMissionStatus(state: GameState, id: MissionId): MissionStatus {
  if (state.completedMissions.includes(id)) return 'completed'
  if (state.activeMission === id) return 'in_progress'
  const index = missions.findIndex(m => m.id === id)
  if (index === 0 ? state.started : state.completedMissions.includes(missions[index - 1].id)) return 'available'
  return 'locked'
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'HYDRATE') return {...initialGameState,...action.state,xp:Math.max(0,action.state.xp),ravos:Math.max(0,action.state.ravos)}
  if (action.type === 'RESET') return initialGameState
  if (action.type === 'START_CHAPTER') return {...state, started:true}
  if (action.type === 'START_MISSION') {
    const status = getMissionStatus(state, action.missionId)
    return status === 'available' || status === 'in_progress' ? {...state,activeMission:action.missionId} : state
  }
  if (state.completedMissions.includes(action.missionId) || getMissionStatus(state, action.missionId) === 'locked') return state
  const mission = missions.find(item => item.id === action.missionId)
  if (!mission) return state
  return applyMissionReward(state, mission)
}
