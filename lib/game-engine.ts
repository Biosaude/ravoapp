import { missions } from '@/data/belem-content'
import type { GameAction,GameState,MissionId,MissionStatus } from './game-types'
import { applyMissionReward } from './reward-engine'
import { calculateLevel } from './level'
export const initialGameState:GameState={version:2,started:false,activeMission:null,completedMissions:[],xp:0,ravos:0,fragments:[],keys:0,medals:[],items:[],score:0,results:[],hintsByMission:{},seasonStatus:'ACTIVE',finalRanking:null,prize:{title:'Presente do campeão',description:'Prêmio surpresa da Temporada 01',image:'🎁',winnerId:null,status:'LOCKED',redeemCode:null,redeemedAt:null},xpHistory:[],ravoTransactions:[],player:{id:'local-player',name:'',nickname:'',avatar:null,onboarded:false,isAdmin:false},preferences:{music:false,sound:false,vibration:true,animations:true,profileVisible:true,rankingVisible:true,notifications:false,highContrast:false,largeText:false}}
export const getLevel=(xp:number)=>calculateLevel(xp)
export function getMissionStatus(state:GameState,id:MissionId):MissionStatus{if(state.completedMissions.includes(id))return'completed';if(state.activeMission===id)return'in_progress';const i=missions.findIndex(m=>m.id===id);if(i<0)return'locked';return(i===0?state.started:state.completedMissions.includes(missions[i-1].id))?'available':'locked'}
export const isChapterUnlocked=(state:GameState,chapter:number)=>chapter===1||state.completedMissions.includes(`c${chapter-1}m5`)
export function gameReducer(state:GameState,action:GameAction):GameState{
 if(action.type==='HYDRATE'){const s=action.state as GameState;return{...initialGameState,...s,version:2,items:s.items??[],results:s.results??[],score:s.score??0,hintsByMission:s.hintsByMission??{},player:{...initialGameState.player,...s.player},preferences:{...initialGameState.preferences,...s.preferences}}}
 if(action.type==='RESET')return initialGameState;if(action.type==='UPDATE_PLAYER')return{...state,player:{...state.player,...action.player}};if(action.type==='UPDATE_PREFERENCE')return{...state,preferences:{...state.preferences,[action.key]:action.value}};if(action.type==='START_CHAPTER')return{...state,started:true}
 if(action.type==='START_MISSION'){const status=getMissionStatus(state,action.missionId);return status==='available'||status==='in_progress'?{...state,activeMission:action.missionId}:state}
 if(action.type==='USE_HINT'){const used=state.hintsByMission[action.missionId]??0;if(used>=3)return state;const payable=state.ravos>=action.cost?action.cost:0;return{...state,ravos:state.ravos-payable,hintsByMission:{...state.hintsByMission,[action.missionId]:used+1}}}
 if(action.type==='SET_SEASON_STATUS'){if(!state.player.isAdmin)return state;return{...state,seasonStatus:action.status}}
 if(action.type==='SET_PRIZE'){if(!state.player.isAdmin)return state;return{...state,prize:{...state.prize,...action.prize}}}
 if(action.type==='OPEN_PRIZE'){if(state.prize.winnerId!==state.player.id||state.prize.status!=='AVAILABLE')return state;return{...state,prize:{...state.prize,status:'OPENED',redeemedAt:new Date().toISOString()}}}
 if(action.type==='COMPLETE_MISSION'){const mission=missions.find(m=>m.id===action.missionId);if(!mission||getMissionStatus(state,mission.id)==='locked')return state;return applyMissionReward(state,mission,action)}return state
}
