import { db } from '@/db'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import PreviewBody from './PreviewBody'

interface PageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const { id } = params;

  if (!id || typeof id !== 'string') {
    return notFound()
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  })

  if(!configuration) {
    return notFound()
  }

  return (
    <Suspense fallback={
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-zinc-800" />
          <p className="text-sm text-zinc-500">Loading preview...</p>
        </div>
      </div>
    }>
      <PreviewBody configuration={configuration} />
    </Suspense>
  )
}

export default Page