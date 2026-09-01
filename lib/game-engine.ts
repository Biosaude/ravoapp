import { missions } from '@/data/belem-content'
import type { GameAction, GameState, MissionId, MissionStatus } from './game-types'
import { applyMissionReward } from './reward-engine'
import { calculateLevel } from './level'

export const initialGameState: GameState = {version:1,started:false,activeMission:null,completedMissions:[],xp:0,ravos:0,fragments:[],keys:0,medals:[],xpHistory:[],ravoTransactions:[],player:{name:'',nickname:'',avatar:null,onboarded:false},preferences:{music:false,sound:false,vibration:true,animations:true,profileVisible:true,rankingVisible:true,notifications:false,highContrast:false,largeText:false}}

export function getLevel(xp: number) {
  return calculateLevel(xp)
}

export function getMissionStatus(state: GameState, id: MissionId): MissionStatus {
  if (state.completedMissions.includes(id)) return 'completed'
  if (state.activeMission === id) return 'in_progress'
  const index = missions.findIndex(m => m.id === id)
  if (index === 0 ? state.started : state.completedMissions.includes(missions[index - 1].id)) return 'available'
  return 'locked'
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'HYDRATE') return {...initialGameState,...action.state,player:{...initialGameState.player,...action.state.player},preferences:{...initialGameState.preferences,...action.state.preferences},xp:Math.max(0,action.state.xp),ravos:Math.max(0,action.state.ravos)}
  if (action.type === 'RESET') return initialGameState
  if (action.type === 'UPDATE_PLAYER') return {...state,player:{...state.player,...action.player}}
  if (action.type === 'UPDATE_PREFERENCE') return {...state,preferences:{...state.preferences,[action.key]:action.value}}
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
