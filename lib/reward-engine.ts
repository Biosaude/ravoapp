import type { GameState, MissionDefinition } from './game-types'
import { calculateMissionScore } from './competition'
export function applyMissionReward(state:GameState,mission:MissionDefinition,metrics:{attempts:number;hintsUsed:number;durationMs:number;optional?:boolean}={attempts:1,hintsUsed:0,durationMs:0}):GameState{
 if(state.completedMissions.includes(mission.id)||state.seasonStatus==='FINISHED'||state.seasonStatus==='RESULTS_PUBLISHED')return state
 const reward=mission.reward,xp=Math.max(0,reward.xp),ravos=Math.max(0,reward.ravos),score=calculateMissionScore(mission,metrics)
 const result={missionId:mission.id,score,attempts:Math.max(1,metrics.attempts),hintsUsed:Math.max(0,metrics.hintsUsed),durationMs:Math.max(0,metrics.durationMs),completedAt:new Date().toISOString()}
 const legacy=reward as typeof reward&{fragment?:number;keys?:number}
 const items=state.items??[],results=state.results??[],medals=state.medals??[],fragments=state.fragments??[]
 return {...state,started:true,activeMission:null,completedMissions:[...state.completedMissions,mission.id],xp:state.xp+xp,ravos:state.ravos+ravos,score:(state.score??0)+score,results:[...results,result],items:reward.item&&!items.includes(reward.item)?[...items,reward.item]:items,fragments:legacy.fragment&&!fragments.includes(legacy.fragment)?[...fragments,legacy.fragment]:fragments,keys:(state.keys??0)+Math.max(0,legacy.keys??0),medals:reward.medal&&!medals.includes(reward.medal)?[...medals,reward.medal]:medals,xpHistory:[...state.xpHistory,{id:`xp-${mission.id}`,missionId:mission.id,amount:xp,label:mission.title}],ravoTransactions:[...state.ravoTransactions,{id:`ravos-${mission.id}`,missionId:mission.id,amount:ravos,label:mission.title}]}
}
