import type { Metadata } from 'next'
import { EmBreveClient } from './EmBreveClient'

export const metadata: Metadata = {
  title: { absolute: 'Moveo Filmes' },
  description:
    'Produtora boutique de filmes independentes — Brasília, desde 2018. Novo site em breve.',
  openGraph: {
    title: 'Moveo Filmes',
    description:
      'Produtora boutique de filmes independentes — Brasília, desde 2018. Novo site em breve.',
  },
}

export default function EmBrevePage() {
  return <EmBreveClient />
}
