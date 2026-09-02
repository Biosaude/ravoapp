# Competição e publicação

O MVP persiste a jornada em `localStorage` (`ravo-game-v1`) e usa jogadores de demonstração. A migração em `supabase/migrations` prepara ranking coletivo; resultados só devem ser gravados por uma Edge Function com service role, nunca diretamente pelo cliente.

## Desempate

1. maior score; 2. mais missões sem dicas; 3. menos erros; 4. menor tempo agregado; 5. nickname (somente para ordenação estável). Não há aleatoriedade.

## Vercel

Execute `npm ci && npm run build`, importe o repositório na Vercel e use o preset Next.js. Para o modo coletivo, aplique a migração e configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` depois que a Edge Function de validação estiver publicada. Sem essas variáveis, o adaptador local continua funcional.
