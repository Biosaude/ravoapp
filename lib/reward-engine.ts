import type { GameState, MissionDefinition } from './game-types'

export function applyMissionReward(
  state: GameState,
  mission: MissionDefinition,
): GameState {
  if (state.completedMissions.includes(mission.id)) return state

  const reward = mission.reward
  const xpReward = Math.max(0, reward.xp)
  const ravosReward = Math.max(0, reward.ravos)
  const keysReward = Math.max(0, reward.keys ?? 0)
  const suffix = `${mission.id}-${state.completedMissions.length + 1}`

  return {
    ...state,
    started: true,
    activeMission: null,
    completedMissions: [...state.completedMissions, mission.id],
    xp: Math.max(0, state.xp + xpReward),
    ravos: Math.max(0, state.ravos + ravosReward),
    fragments:
      reward.fragment && !state.fragments.includes(reward.fragment)
        ? [...state.fragments, reward.fragment]
        : state.fragments,
    keys: state.keys + keysReward,
    medals:
      reward.medal && !state.medals.includes(reward.medal)
        ? [...state.medals, reward.medal]
        : state.medals,
    xpHistory: [
      ...state.xpHistory,
      {
        id: `xp-${suffix}`,
        missionId: mission.id,
        amount: xpReward,
        label: mission.title,
      },
    ],
    ravoTransactions: [
      ...state.ravoTransactions,
      {
        id: `ravos-${suffix}`,
        missionId: mission.id,
        amount: ravosReward,
        label: mission.title,
      },
    ],
  }
}
