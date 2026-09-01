'use client'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="flex min-h-dvh items-center justify-center bg-mist p-6 text-center text-ink"><section className="max-w-sm rounded-3xl bg-white p-7 shadow-xl"><p className="eyebrow">RAVO MVP</p><h1 className="display mt-2 text-2xl font-black">Algo deu errado.</h1><p className="mt-3 text-sm text-ink/60">Sua jornada continua salva neste aparelho.</p><button onClick={reset} className="btn btn-primary mt-6 w-full">TENTAR NOVAMENTE</button></section></main>
}
