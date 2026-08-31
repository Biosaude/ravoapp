import type { MissionDefinition } from '@/lib/game-types'

export interface CulturalQuestion {
  id: string; theme: string; question: string; options: string[]; correctAnswer: number; explanation: string; reference: string
}

export const culturalQuestions: CulturalQuestion[] = [{
  id: 'ver-o-peso-origem',
  theme: 'Ver-o-Peso',
  question: 'O símbolo encontrado parece ligado à origem do mercado. Qual elemento está relacionado à história do complexo?',
  options: ['Um posto de fiscalização e pesagem', 'Uma estação ferroviária', 'Um engenho de açúcar', 'Um observatório astronômico'],
  correctAnswer: 0,
  explanation: 'O nome remete à antiga Casa de Haver-o-Peso, onde mercadorias eram fiscalizadas e pesadas para cobrança de tributos.',
  reference: 'Referência editorial: IPHAN / Complexo do Ver-o-Peso — revisar antes da publicação final.'
}]

export const missions: MissionDefinition[] = [
  {id:'letter',number:1,title:'A Carta',subtitle:'Uma mensagem atravessou a chuva',location:'CAMPINA · NARRATIVA',duration:'3 min',reward:{xp:250,ravos:100,fragment:1}},
  {id:'market',number:2,title:'Os Segredos do Ver-o-Peso',subtitle:'Siga as marcas entre o ferro e o rio',location:'VER-O-PESO · INVESTIGAÇÃO',duration:'5 min',reward:{xp:400,ravos:120}},
  {id:'code',number:3,title:'O Código da Cidade Velha',subtitle:'Azulejos guardam uma sequência',location:'CIDADE VELHA · PUZZLE',duration:'4 min',reward:{xp:500,ravos:150,fragment:2}},
  {id:'guardian',number:4,title:'O Guardião',subtitle:'Um sinal espera no Forte',location:'FORTE DO PRESÉPIO · PRESENCIAL',duration:'4 min',reward:{xp:750,ravos:200,keys:1}},
  {id:'secret',number:5,title:'O Primeiro Segredo',subtitle:'Reúna as memórias recuperadas',location:'BAÍA DO GUAJARÁ · FINAL',duration:'5 min',reward:{xp:1000,ravos:300,medal:'Guardião do Primeiro Fragmento'}},
]

export const chapterTitle = 'O Mapa Desaparecido'

