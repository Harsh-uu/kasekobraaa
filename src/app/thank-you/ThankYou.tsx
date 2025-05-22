'use client'

import { useQuery } from '@tanstack/react-query'
import { getPaymentStatus } from './actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import PhonePreview from '@/components/PhonePreview'
import { Suspense, useCallback } from 'react'
import Loading from './loading'
import { Button } from '@/components/ui/button'

const ThankYou = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  // Validate orderId
  if (!orderId) {
    throw new Error('Order ID is required')
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['get-payment-status', orderId],
    queryFn: async () => await getPaymentStatus({ orderId }),
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false, // Disable refetching on window focus
  })
  
  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])
  
  const handleBack = useCallback(() => {
    router.push('/')
  }, [router])
  if (error) {
    return (
      <div className='w-full mt-24 flex justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <h3 className='font-semibold text-xl text-red-600'>Unable to load order details</h3>
            <p className='text-zinc-600 max-w-sm'>{error instanceof Error ? error.message : 'Please check your connection and try again.'}</p>
          </div>
          <div className='flex gap-4 mt-4'>
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return Home
            </Button>
            <Button onClick={handleRetry}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || data === undefined) {
    return (
      <div className='w-full mt-24 flex justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-zinc-500' />
          <h3 className='font-semibold text-xl'>Loading your order...</h3>
          <p className='text-zinc-600'>This won't take long.</p>
        </div>
      </div>
    )
  }

  if (data === false) {
    return (
      <div className='w-full mt-24 flex justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-zinc-500' />
          <h3 className='font-semibold text-xl'>Verifying your payment...</h3>
          <p className='text-zinc-600'>This might take a moment.</p>
          <p className='text-sm text-zinc-500 mt-2'>If this takes longer than expected, please contact support.</p>
        </div>
      </div>
    )
  }

  const { configuration, billingAddress, shippingAddress, amount } = data
  const { color } = configuration
  return (
    <div className='min-h-[80vh] bg-white'>
      <div className='mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='max-w-xl'>
          <Button 
            variant="ghost" 
            className="mb-8 -ml-4 text-zinc-500 hover:text-zinc-900"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
          
          <div className="space-y-2">
            <p className='text-base font-medium text-primary'>Thank you!</p>
            <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
              Your case is on the way!
            </h1>
            <p className='text-base text-zinc-500'>
              We've received your order and are now processing it.
            </p>
          </div>

          <div className='mt-12 text-sm font-medium'>
            <p className='text-zinc-900'>Order number</p>
            <p className='mt-2 text-zinc-500 font-mono'>{orderId}</p>
          </div>
        </div>

        <div className='mt-10 border-t border-zinc-200'>
          <div className='mt-10 flex flex-auto flex-col'>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-8">
              <h4 className='font-semibold text-green-900'>
                You made a great choice!
              </h4>
              <p className='mt-2 text-sm text-green-800'>
                We at CaseCobra believe that a phone case doesn't only need to
                look good, but also last you for the years to come. We offer a
                5-year print guarantee: If your case isn't of the highest quality,
                we'll replace it for free.
              </p>
            </div>
          </div>
        </div>

        <div className='overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl p-4'>
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
          }>
            <PhonePreview
              croppedImageUrl={configuration.croppedImageUrl!}
              color={color!}
            />
          </Suspense>
        </div>        <div className="mt-16">
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 bg-gray-50 rounded-lg px-6'>
            <div className='space-y-6'>
              <div>
                <p className='font-medium text-gray-900 mb-3 flex items-center'>
                  Shipping Address
                </p>
                <div className='text-zinc-700 bg-white p-4 rounded border border-gray-200'>
                  <address className='not-italic space-y-1'>
                    <p className='font-medium'>{shippingAddress?.name}</p>
                    <p>{shippingAddress?.street}</p>
                    <p>
                      {shippingAddress?.postalCode} {shippingAddress?.city}
                    </p>
                  </address>
                </div>
              </div>
              
              <div>
                <p className='font-medium text-gray-900 mb-3'>Billing Address</p>
                <div className='text-zinc-700 bg-white p-4 rounded border border-gray-200'>
                  <address className='not-italic space-y-1'>
                    <p className='font-medium'>{billingAddress?.name}</p>
                    <p>{billingAddress?.street}</p>
                    <p>
                      {billingAddress?.postalCode} {billingAddress?.city}
                    </p>
                  </address>
                </div>
              </div>
            </div>

            <div className='space-y-6'>
              <div>
                <p className='font-medium text-gray-900 mb-3'>Order Status</p>
                <div className='bg-white p-4 rounded border border-gray-200 space-y-4'>
                  <div>
                    <p className='text-sm text-zinc-600'>Payment Status</p>
                    <p className='font-medium text-green-600'>Paid</p>
                  </div>
                  <div>
                    <p className='text-sm text-zinc-600'>Shipping Method</p>
                    <p className='font-medium'>DHL Express</p>
                    <p className='text-sm text-zinc-500'>Delivery in 2-3 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>        <div className='mt-8 rounded-lg bg-white border border-gray-200'>
          <div className='p-6 space-y-4'>
            <div className='flex justify-between text-sm'>
              <p className='text-zinc-600'>Subtotal</p>
              <p className='text-zinc-900 font-medium'>{formatPrice(amount)}</p>
            </div>
            <div className='flex justify-between text-sm'>
              <p className='text-zinc-600'>Shipping</p>
              <p className='text-zinc-900 font-medium'>{formatPrice(0)}</p>
            </div>
            <div className='h-px bg-gray-200' />
            <div className='flex justify-between'>
              <p className='font-medium text-zinc-900'>Total</p>
              <div className='text-right'>
                <p className='text-lg font-semibold text-zinc-900'>{formatPrice(amount)}</p>
                <p className='text-xs text-zinc-500 mt-0.5'>Tax included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThankYou