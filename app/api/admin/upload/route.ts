import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createServiceClient } from '@/lib/supabase/service'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  await requireAdmin()

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const path = formData.get('path') as string | null

  if (!file || !path) {
    return NextResponse.json({ error: 'file and path are required' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await supabase.storage
    .from('moveo-assets')
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: urlData } = supabase.storage
    .from('moveo-assets')
    .getPublicUrl(path)

  return NextResponse.json({ url: urlData.publicUrl })
}
