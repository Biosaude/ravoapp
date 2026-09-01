import test from 'node:test'
import assert from 'node:assert/strict'
import rewardEngine from '../.test-dist/reward-engine.js'
import storageAdapter from '../.test-dist/storage-adapter.js'
import levelRules from '../.test-dist/level.js'

const { applyMissionReward } = rewardEngine
const { saveGame, loadGame, clearGame, STORAGE_KEY } = storageAdapter
const { calculateLevel } = levelRules

const initial = () => ({started:true,activeMission:'letter',completedMissions:[],xp:0,ravos:0,fragments:[],keys:0,medals:[],xpHistory:[],ravoTransactions:[]})
const letter = {id:'letter',title:'A Carta',reward:{xp:250,ravos:100,fragment:1}}

test('concluir missão concede XP e RAVOS e registra os históricos',()=>{const result=applyMissionReward(initial(),letter);assert.equal(result.xp,250);assert.equal(result.ravos,100);assert.equal(result.xpHistory.length,1);assert.equal(result.ravoTransactions.length,1)})
test('conclusão adiciona missão e colecionável',()=>{const result=applyMissionReward(initial(),letter);assert.deepEqual(result.completedMissions,['letter']);assert.deepEqual(result.fragments,[1]);assert.equal(result.activeMission,null)})
test('recompensa da mesma missão nunca é duplicada',()=>{const once=applyMissionReward(initial(),letter);assert.strictEqual(applyMissionReward(once,letter),once)})
test('recompensas negativas são impedidas',()=>{const result=applyMissionReward(initial(),{id:'letter',title:'Inválida',reward:{xp:-10,ravos:-20,keys:-1}});assert.equal(result.xp,0);assert.equal(result.ravos,0);assert.equal(result.keys,0)})
test('missões sequenciais produzem progressão determinística',()=>{const first=applyMissionReward(initial(),letter);const second=applyMissionReward(first,{id:'market',title:'Mensagem',reward:{xp:400,ravos:80}});assert.equal(second.xp,650);assert.equal(second.ravos,180);assert.deepEqual(second.completedMissions,['letter','market'])})
test('nível segue os marcos centrais',()=>{assert.equal(calculateLevel(999).level,1);assert.equal(calculateLevel(1000).level,2);assert.equal(calculateLevel(2500).level,3);assert.equal(calculateLevel(8000).level,5)})
test('estado persiste, recarrega e pode ser reiniciado',()=>{const values=new Map();const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};const state={...initial(),player:{name:'Ana',nickname:'AnaBelem',avatar:null,onboarded:true}};saveGame(storage,state);assert.equal(loadGame(storage).player.nickname,'AnaBelem');clearGame(storage);assert.equal(values.has(STORAGE_KEY),false);assert.equal(loadGame(storage),null)})
