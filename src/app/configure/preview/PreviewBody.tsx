'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Suspense } from 'react'
import DesignPreview from './DesignPreview'
import { Configuration } from '@prisma/client'

const PreviewBody = ({ configuration }: { configuration: Configuration }) => {
  return (
    <MaxWidthWrapper>
      <Suspense fallback={null}>
        <DesignPreview configuration={configuration} />
      </Suspense>
    </MaxWidthWrapper>
  )
}

export default PreviewBody
