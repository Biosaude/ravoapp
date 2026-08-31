import test from 'node:test'
import assert from 'node:assert/strict'
import rewardEngine from '../.test-dist/reward-engine.js'

const { applyMissionReward } = rewardEngine

const initial = () => ({started:true,activeMission:'letter',completedMissions:[],xp:0,ravos:0,fragments:[],keys:0,medals:[],xpHistory:[],ravoTransactions:[]})
const letter = {id:'letter',title:'A Carta',reward:{xp:250,ravos:100,fragment:1}}

test('concluir missão concede XP e RAVOS e registra os históricos',()=>{const result=applyMissionReward(initial(),letter);assert.equal(result.xp,250);assert.equal(result.ravos,100);assert.equal(result.xpHistory.length,1);assert.equal(result.ravoTransactions.length,1)})
test('conclusão adiciona missão e colecionável',()=>{const result=applyMissionReward(initial(),letter);assert.deepEqual(result.completedMissions,['letter']);assert.deepEqual(result.fragments,[1]);assert.equal(result.activeMission,null)})
test('recompensa da mesma missão nunca é duplicada',()=>{const once=applyMissionReward(initial(),letter);assert.strictEqual(applyMissionReward(once,letter),once)})
test('recompensas negativas são impedidas',()=>{const result=applyMissionReward(initial(),{id:'letter',title:'Inválida',reward:{xp:-10,ravos:-20,keys:-1}});assert.equal(result.xp,0);assert.equal(result.ravos,0);assert.equal(result.keys,0)})
test('missões sequenciais produzem progressão determinística',()=>{const first=applyMissionReward(initial(),letter);const second=applyMissionReward(first,{id:'market',title:'Mercado',reward:{xp:400,ravos:120}});assert.equal(second.xp,650);assert.equal(second.ravos,220);assert.deepEqual(second.completedMissions,['letter','market'])})
