'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs'
import { ReactNode } from 'react'

const client = new QueryClient()

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <KindeProvider>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </KindeProvider>
  )
}

export default Providers