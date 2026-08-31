export type MissionStatus = 'locked' | 'available' | 'in_progress' | 'completed'
export type MissionId = 'letter' | 'market' | 'code' | 'guardian' | 'secret'

export interface MissionReward { xp: number; ravos: number; fragment?: number; keys?: number; medal?: string }
export interface MissionDefinition { id: MissionId; number: number; title: string; subtitle: string; location: string; duration: string; reward: MissionReward }
export interface LedgerEntry { id: string; missionId: MissionId; amount: number; label: string }
export interface GameState {
  version: 1
  started: boolean
  activeMission: MissionId | null
  completedMissions: MissionId[]
  xp: number
  ravos: number
  fragments: number[]
  keys: number
  medals: string[]
  xpHistory: LedgerEntry[]
  ravoTransactions: LedgerEntry[]
}

export type GameAction =
  | { type: 'HYDRATE'; state: GameState }
  | { type: 'START_CHAPTER' }
  | { type: 'START_MISSION'; missionId: MissionId }
  | { type: 'COMPLETE_MISSION'; missionId: MissionId }
  | { type: 'RESET' }
