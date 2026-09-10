import { Suspense } from 'react'
import LoginForm from '@/app/components/LoginForm'

/**
 * O Suspense é exigência do `useSearchParams` dentro de página estática: sem
 * ele o build falha. O fallback é vazio de propósito — o formulário monta no
 * mesmo tick.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
