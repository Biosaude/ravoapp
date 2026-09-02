export type MissionStatus = 'locked'|'available'|'in_progress'|'completed'
export type MissionId = string
export type SeasonStatus = 'DRAFT'|'ACTIVE'|'FINISHED'|'RESULTS_PUBLISHED'
export interface MissionReward { xp:number; ravos:number; item?:string; medal?:string }
export interface MissionDefinition { id:MissionId; chapter:number; number:number; title:string; subtitle:string; location:string; duration:string; type:string; prompt:string; options:string[]; answer:string[]; hints:string[]; reward:MissionReward }
export interface MissionResult { missionId:string; score:number; attempts:number; hintsUsed:number; durationMs:number; completedAt:string }
export interface LedgerEntry { id:string; missionId:MissionId; amount:number; label:string }
export interface SeasonPrize { title:string; description:string; image:string; winnerId:string|null; status:'LOCKED'|'AVAILABLE'|'OPENED'; redeemCode:string|null; redeemedAt:string|null }
export interface GameState {
 version:2; started:boolean; activeMission:MissionId|null; completedMissions:MissionId[]; xp:number; ravos:number; fragments:number[]; keys:number; medals:string[]; items:string[]; score:number; results:MissionResult[]; hintsByMission:Record<string,number>; seasonStatus:SeasonStatus; finalRanking:RankingPlayer[]|null; prize:SeasonPrize; xpHistory:LedgerEntry[]; ravoTransactions:LedgerEntry[];
 player:{id:string;name:string;nickname:string;avatar:string|null;onboarded:boolean;isAdmin:boolean}; preferences:{music:boolean;sound:boolean;vibration:boolean;animations:boolean;profileVisible:boolean;rankingVisible:boolean;notifications:boolean;highContrast:boolean;largeText:boolean}
}
export interface RankingPlayer { id:string; nickname:string; avatar:string|null; level:number; score:number; missions:number; noHint:number; errors:number; durationMs:number; current?:boolean }
export type GameAction =
 |{type:'HYDRATE';state:GameState}|{type:'START_CHAPTER'}|{type:'START_MISSION';missionId:MissionId}
 |{type:'COMPLETE_MISSION';missionId:MissionId;attempts:number;hintsUsed:number;durationMs:number;optional?:boolean}
 |{type:'USE_HINT';missionId:MissionId;cost:number}|{type:'UPDATE_PLAYER';player:Partial<GameState['player']>}
 |{type:'UPDATE_PREFERENCE';key:keyof GameState['preferences'];value:boolean}|{type:'SET_SEASON_STATUS';status:SeasonStatus}
 |{type:'SET_PRIZE';prize:Partial<SeasonPrize>}|{type:'OPEN_PRIZE'}|{type:'RESET'}
