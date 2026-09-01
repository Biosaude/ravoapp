'use client'

import { useState } from 'react'
import {
  Anchor,
  Check,
  Compass,
  Droplets,
  Fish,
  Map as MapIcon,
  ShipWheel,
  Sparkles,
  Waves,
} from 'lucide-react'
import { culturalQuestions, missions } from '@/data/belem-content'
import type { MissionId } from '@/lib/game-types'
import { GameDialog, MissionComplete, PuzzleContainer } from './game-ui'

interface MissionExperienceProps {
  id: MissionId
  replay?: boolean
  onComplete: () => void
  onExit: () => void
  onNext: () => void
}

export function MissionExperience({
  id,
  replay = false,
  onComplete,
  onExit,
  onNext,
}: MissionExperienceProps) {
  const mission = missions.find((item) => item.id === id)!
  const [done, setDone] = useState(false)

  const finish = () => {
    onComplete()
    setDone(true)
  }

  if (done) {
    return (
      <main className="flex min-h-dvh items-center px-6">
        <MissionComplete chapter={id === 'secret'} reward={replay ? {...mission.reward, xp: 0, ravos: 0} : mission.reward} onContinue={onNext} />
      </main>
    )
  }

  return (
    <main className="mission-shell min-h-dvh pb-10 text-white">
      <header className="px-5 pb-5 pt-6">
        <button onClick={onExit} className="text-[10px] font-bold text-white/50">
          ← SAIR E SALVAR
        </button>
        <p className="eyebrow mt-7">Missão {mission.number} de 5 · {mission.duration}</p>
        <h1 className="display mt-2 text-3xl font-black">{mission.title}</h1>
        <p className="mt-2 text-xs text-white/45">{mission.location}</p>
      </header>
      {id === 'letter' && <LetterMission finish={finish} />}
      {id === 'market' && <MessageMission finish={finish} />}
      {id === 'code' && <FragmentMission finish={finish} />}
      {id === 'guardian' && <MarketMission finish={finish} />}
      {id === 'secret' && <GuardianMission finish={finish} />}
    </main>
  )
}

function MissionProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-5" aria-label={`Progresso: ${current} de ${total}`}>
      <div className="mb-2 flex justify-between text-[9px] font-bold text-white/40">
        <span>PROGRESSO DA MISSÃO</span><span>{current}/{total}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="progress-fill h-full bg-leaf" style={{ width: `${current / total * 100}%` }} />
      </div>
    </div>
  )
}

function LetterMission({ finish }: { finish: () => void }) {
  const [symbols, setSymbols] = useState<number[]>([])
  const [dialogue, setDialogue] = useState(false)
  const reveal = (symbol: number) => setSymbols((found) => found.includes(symbol) ? found : [...found, symbol])

  if (dialogue) {
    return (
      <PuzzleContainer eyebrow="Mensagem revelada" title="A cidade se lembra">
        <GameDialog
          speaker="Remetente desconhecida"
          choices={['Vou seguir o curso do rio.', 'Guardarei cada pista com cuidado.']}
          onChoose={finish}
        >
          Quando as três marcas se encontram, a tinta reaparece: “Comece pelo nome que pesa e pelo rio que conduz.”
        </GameDialog>
      </PuzzleContainer>
    )
  }

  return (
    <PuzzleContainer eyebrow="Objetivo · investigar" title="A carta molhada pela chuva">
      <MissionProgress current={symbols.length} total={3} />
      <p className="mb-5 text-xs leading-6 text-white/55">
        A água apagou quase tudo. Toque nas três áreas que ainda brilham sob o papel.
      </p>
      <div className="letter-paper relative h-80 overflow-hidden rounded-sm p-6 text-[#18241e] shadow-2xl">
        <Droplets className="absolute right-5 top-4 text-[#365d52]/25" size={70} />
        <p className="max-w-[80%] font-serif text-base leading-7">
          “Se esta carta chegou até você, o mapa ainda pode ser reconstruído...”
        </p>
        {([
          ['left-[18%] top-[58%]', Anchor],
          ['left-[66%] top-[43%]', Waves],
          ['left-[72%] top-[76%]', Compass],
        ] as const).map(([position, Icon], index) => (
          <button
            key={index}
            aria-label={`Símbolo escondido ${index + 1}`}
            onClick={() => reveal(index)}
            className={`clue absolute ${position} flex h-12 w-12 items-center justify-center rounded-full transition ${symbols.includes(index) ? 'bg-[#173d33] text-[#d8aa5b]' : 'bg-[#d8aa5b]/20 text-[#173d33]/35 ring-1 ring-[#173d33]/20'}`}
          >
            <Icon size={21} />
          </button>
        ))}
      </div>
      {symbols.length === 3 && (
        <button onClick={() => setDialogue(true)} className="btn btn-primary mt-5 w-full">
          REVELAR MENSAGEM <Sparkles size={16} />
        </button>
      )}
    </PuzzleContainer>
  )
}

function MessageMission({ finish }: { finish: () => void }) {
  const answer = 'PESO'
  const letters = ['O', 'R', 'P', 'S', 'E', 'A']
  const [built, setBuilt] = useState('')
  const solved = built === answer
  const wrong = built.length === answer.length && !solved

  const addLetter = (letter: string) => {
    if (built.length < answer.length) setBuilt((current) => current + letter)
  }

  return (
    <PuzzleContainer eyebrow="Objetivo · decodificar" title="Construa a palavra oculta">
      <MissionProgress current={built.length} total={answer.length} />
      <p className="text-xs leading-6 text-white/55">
        A carta deixou uma pista: “o nome que mede mercadorias”. Toque nas letras na ordem correta.
      </p>
      <div className="my-6 grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={`flex h-16 items-center justify-center rounded-xl border text-xl font-black ${built[index] ? 'border-gold bg-gold/10 text-gold' : 'border-dashed border-white/20'}`}>
            {built[index] ?? '·'}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {letters.map((letter, index) => (
          <button key={`${letter}-${index}`} onClick={() => addLetter(letter)} className="rounded-xl border border-river/30 bg-river/10 p-4 text-lg font-black">
            {letter}
          </button>
        ))}
      </div>
      {wrong && <p className="mt-4 text-center text-xs text-red-200">A tinta não reage. Limpe a sequência e tente outra ordem.</p>}
      {!solved && built.length > 0 && <button onClick={() => setBuilt('')} className="mt-4 w-full text-[10px] font-bold text-white/45">LIMPAR SEQUÊNCIA</button>}
      {solved && <><p className="mt-5 text-center text-xs font-bold text-leaf"><Check className="mr-1 inline" size={16} /> Código decifrado: VER-O-PESO.</p><button onClick={finish} className="btn btn-primary mt-4 w-full">GUARDAR SEGUNDO FRAGMENTO</button></>}
    </PuzzleContainer>
  )
}

function FragmentMission({ finish }: { finish: () => void }) {
  const target = [1, 2, 3, 4]
  const [pieces, setPieces] = useState([3, 1, 4, 2])
  const [selected, setSelected] = useState<number | null>(null)
  const solved = pieces.every((piece, index) => piece === target[index])

  const swap = (index: number) => {
    if (selected === null) return setSelected(index)
    const next = [...pieces]
    ;[next[selected], next[index]] = [next[index], next[selected]]
    setPieces(next)
    setSelected(null)
  }

  return (
    <PuzzleContainer eyebrow="Objetivo · reconstruir" title="Monte o mapa rasgado">
      <MissionProgress current={pieces.filter((piece, index) => piece === target[index]).length} total={4} />
      <p className="text-xs leading-6 text-white/55">Toque em dois fragmentos para trocar suas posições. Una o rio, o mercado, as casas e o forte.</p>
      <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-[#09231d] p-3 topo">
        {pieces.map((piece, index) => (
          <button
            key={piece}
            onClick={() => swap(index)}
            className={`map-piece relative aspect-[1.15] overflow-hidden rounded-xl border ${selected === index ? 'border-gold scale-[.96]' : piece === target[index] ? 'border-leaf/60' : 'border-white/10'}`}
          >
            <span className={`absolute inset-0 map-art map-art-${piece}`} />
            <span className="absolute bottom-2 left-2 rounded-full bg-ink/75 px-2 py-1 text-[8px] font-bold">{['RIO', 'MERCADO', 'CASAS', 'FORTE'][piece - 1]}</span>
          </button>
        ))}
      </div>
      {solved && <><p className="mt-5 text-center text-xs font-bold text-leaf"><MapIcon className="mr-1 inline" size={16} /> As margens agora formam uma única rota.</p><button onClick={finish} className="btn btn-primary mt-4 w-full">RECOLHER MAPA MONTADO</button></>}
    </PuzzleContainer>
  )
}

function MarketMission({ finish }: { finish: () => void }) {
  const [clues, setClues] = useState<number[]>([])
  const [pick, setPick] = useState<number | null>(null)
  const question = culturalQuestions[0]
  const reveal = (clue: number) => setClues((found) => found.includes(clue) ? found : [...found, clue])

  return (
    <PuzzleContainer eyebrow="Objetivo · explorar" title={clues.length < 3 ? 'Investigue o mercado' : 'A memória do peso'}>
      <MissionProgress current={clues.length < 3 ? clues.length : pick === question.correctAnswer ? 4 : 3} total={4} />
      {clues.length < 3 ? <>
        <p className="mb-4 text-xs leading-6 text-white/55">Entre o Mercado de Ferro, os barcos e a baía, encontre peixe, âncora e leme.</p>
        <div className="market-scene regional-scene relative h-80 overflow-hidden rounded-2xl border border-white/10">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a5662] to-[#176a72]" />
          <div className="absolute bottom-16 left-5 h-14 w-36 -rotate-3 rounded-[50%] bg-[#9b5f35]" />
          <div className="absolute inset-x-0 top-10 text-center display text-2xl font-black text-white/10">VER-O-PESO</div>
          {([[22, 65, Fish], [70, 37, Anchor], [76, 75, ShipWheel]] as const).map(([left, top, Icon], index) => (
            <button
              aria-label={`Elemento do mercado ${index + 1}`}
              key={index}
              onClick={() => reveal(index)}
              style={{ left: `${left}%`, top: `${top}%` }}
              className={`clue absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${clues.includes(index) ? 'bg-leaf text-ink' : 'bg-gold/20 text-gold ring-1 ring-gold'}`}
            >
              <Icon size={21} />
            </button>
          ))}
        </div>
      </> : <>
        <p className="text-sm font-bold leading-6">{question.question}</p>
        <div className="mt-5 space-y-2">
          {question.options.map((option, index) => (
            <button key={option} onClick={() => setPick(index)} className={`w-full rounded-xl border p-3 text-left text-xs ${pick === index ? index === question.correctAnswer ? 'border-leaf bg-leaf/10' : 'border-red-400 bg-red-400/10' : 'border-white/10'}`}>
              {option}
            </button>
          ))}
        </div>
        {pick !== null && <div className={`mt-4 rounded-xl p-3 text-[11px] leading-5 ${pick === question.correctAnswer ? 'bg-leaf/10 text-leaf' : 'bg-red-400/10 text-red-200'}`}>{pick === question.correctAnswer ? question.explanation : 'A pista não corresponde. Observe a relação entre fiscalização e pesagem.'}</div>}
        {pick === question.correctAnswer && <button onClick={finish} className="btn btn-primary mt-5 w-full">REGISTRAR PISTA DO MERCADO</button>}
      </>}
    </PuzzleContainer>
  )
}

function GuardianMission({ finish }: { finish: () => void }) {
  const answer = ['ÂNCORA', 'PESO', 'RIO', 'FORTE']
  const choices = ['RIO', 'FORTE', 'PESO', 'MANGUEIRA', 'ÂNCORA', 'ESTRELA']
  const [code, setCode] = useState<string[]>([])
  const solved = code.join('|') === answer.join('|')
  const wrong = code.length === answer.length && !solved

  return (
    <PuzzleContainer eyebrow="Puzzle final" title="Desperte o Guardião">
      <MissionProgress current={code.length} total={answer.length} />
      <p className="text-xs leading-6 text-white/55">Combine as quatro pistas: o símbolo da carta, a palavra decodificada, a margem do mapa e o destino da rota.</p>
      <div className="my-5 grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }, (_, index) => <div key={index} className="flex h-14 items-center justify-center rounded-xl border border-dashed border-gold/30 px-1 text-center text-[9px] font-bold text-gold">{code[index] ?? '?'}</div>)}
      </div>
      <div className="flex flex-wrap gap-2">
        {choices.map((word) => <button key={word} disabled={code.includes(word)} onClick={() => code.length < 4 && setCode((current) => [...current, word])} className="rounded-full border border-white/10 px-3 py-2 text-[10px] font-bold disabled:opacity-25">{word}</button>)}
      </div>
      {wrong && <p className="mt-4 text-center text-xs text-red-200">O Guardião permanece imóvel. Consulte os quatro fragmentos.</p>}
      {!solved && code.length > 0 && <button onClick={() => setCode([])} className="mt-4 w-full text-[10px] font-bold text-white/45">RECOMEÇAR COMBINAÇÃO</button>}
      {solved && <><div className="mt-5 rounded-2xl border border-leaf/30 bg-leaf/10 p-4 text-center"><Sparkles className="mx-auto text-gold" /><p className="eyebrow mt-3">Expedição desbloqueada</p><b className="display mt-1 block">ROTA DA BAÍA</b></div><button onClick={finish} className="btn btn-primary mt-5 w-full">CONCLUIR CAPÍTULO</button></>}
    </PuzzleContainer>
  )
}
