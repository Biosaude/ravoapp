import type { MissionDefinition, MissionResult, RankingPlayer } from './game-types'

export function calculateMissionScore(mission:MissionDefinition, metrics:{attempts:number;hintsUsed:number;durationMs:number;optional?:boolean}){
 const baseScore=mission.reward.xp*2
 const bonusPrecisao=Math.max(0,300-(Math.max(1,metrics.attempts)-1)*75)
 const bonusSemDicas=metrics.hintsUsed===0?250:Math.max(0,150-metrics.hintsUsed*75)
 const bonusDesafio=metrics.optional?150:0
 const bonusCapitulo=mission.number===5?mission.chapter*100:0
 return Math.max(100,baseScore+bonusPrecisao+bonusSemDicas+bonusDesafio+bonusCapitulo)
}
export function compareRanking(a:RankingPlayer,b:RankingPlayer){return b.score-a.score||b.noHint-a.noHint||a.errors-b.errors||a.durationMs-b.durationMs||a.nickname.localeCompare(b.nickname)}
export function rankPlayers(players:RankingPlayer[]){return [...players].sort(compareRanking)}
export function seasonTitle(position:number,total:number){if(position===1)return 'CAMPEÃO';if(position<=3)return 'LENDA DE BELÉM';if(position<=10)return 'GUARDIÃO';if(position<=Math.ceil(total*.25))return 'NAVEGADOR';return 'EXPLORADOR'}
export function resultToRanking(id:string,nickname:string,avatar:string|null,xp:number,results:MissionResult[]):RankingPlayer{return{id,nickname,avatar,level:Math.floor(xp/1000)+1,score:results.reduce((n,r)=>n+r.score,0),missions:results.length,noHint:results.filter(r=>r.hintsUsed===0).length,errors:results.reduce((n,r)=>n+Math.max(0,r.attempts-1),0),durationMs:results.reduce((n,r)=>n+r.durationMs,0)}}
