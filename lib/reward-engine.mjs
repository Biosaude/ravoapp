export function applyMissionReward(state, mission) {
  if (state.completedMissions.includes(mission.id)) return state
  const reward = mission.reward
  const suffix = `${mission.id}-${state.completedMissions.length + 1}`
  return {
    ...state,
    started: true,
    activeMission: null,
    completedMissions: [...state.completedMissions, mission.id],
    xp: Math.max(0, state.xp + Math.max(0, reward.xp)),
    ravos: Math.max(0, state.ravos + Math.max(0, reward.ravos)),
    fragments: reward.fragment && !state.fragments.includes(reward.fragment) ? [...state.fragments, reward.fragment] : state.fragments,
    keys: state.keys + Math.max(0, reward.keys ?? 0),
    medals: reward.medal && !state.medals.includes(reward.medal) ? [...state.medals, reward.medal] : state.medals,
    xpHistory: [...state.xpHistory, {id:`xp-${suffix}`,missionId:mission.id,amount:Math.max(0,reward.xp),label:mission.title}],
    ravoTransactions: [...state.ravoTransactions, {id:`ravos-${suffix}`,missionId:mission.id,amount:Math.max(0,reward.ravos),label:mission.title}],
  }
}
