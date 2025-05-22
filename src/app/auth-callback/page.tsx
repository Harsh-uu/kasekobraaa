'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getAuthStatus } from './actions'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { logger } from '@/lib/logger'

const Page = () => {  const [configId, setConfigId] = useState<string | null>(null)
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useKindeBrowserClient()
  const [debugInfo, setDebugInfo] = useState<string>('')
  
  useEffect(() => {
    const configurationId = localStorage.getItem('configurationId')
    if (configurationId) setConfigId(configurationId)
    
    // Debug info
    setDebugInfo(JSON.stringify({
      user: user ? { id: user.id, email: user.email } : null,
      isAuthLoading,
      configId: configurationId || null,
      time: new Date().toISOString(),
    }, null, 2))
    
    // Log auth events for diagnostics
    logger.info('Auth callback mounted', {
      source: 'auth-callback',
      meta: {
        hasUser: !!user,
        isLoading: isAuthLoading,
        hasConfigId: !!configurationId
      }
    });
    
    // If we already have user info from Kinde client and a configId, redirect immediately
    if (user && !isAuthLoading && configurationId) {
      logger.info('User already authenticated via Kinde client, redirecting to preview', {
        source: 'auth-callback',
        meta: { userId: user.id, configId: configurationId }
      });
      localStorage.removeItem('configurationId')
      router.push(`/configure/preview?id=${configurationId}`)
      return
    }
  }, [user, isAuthLoading, router])

  const { data, error, isLoading } = useQuery({
    queryKey: ['auth-callback'],
    queryFn: async () => await getAuthStatus(),
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false
      if (error?.message?.includes('Invalid user data')) return true
      return false
    },
    retryDelay: 500,
    refetchOnWindowFocus: false,
    enabled: !user, // Only run query if we don't already have user from Kinde client
  })
  useEffect(() => {
    if (data?.success) {
      if (configId) {
        localStorage.removeItem('configurationId')
        console.log('Redirecting to preview with configId:', configId)
        router.push(`/configure/preview?id=${configId}`)
      } else {
        console.log('No configId found, redirecting to home')
        router.push('/')
      }
    }
  }, [data, configId, router])

  if (error) {
    console.error('Auth callback error:', error)
    // Optionally redirect to login page or show error
    // router.push('/api/auth/login')
  }

  return (
    <div className='w-full mt-24 flex justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-zinc-500' />
        <h3 className='font-semibold text-xl'>Logging you in...</h3>
        <p>You will be redirected automatically.</p>
        
        {process.env.NODE_ENV === 'development' && (
          <div className='mt-8 p-4 bg-gray-100 rounded text-xs max-w-md overflow-auto'>
            <pre>{debugInfo}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page