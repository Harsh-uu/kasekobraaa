import { Metadata } from 'next'
import { Suspense, lazy } from 'react'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { CallToActionSection } from '@/components/sections/CallToActionSection'

// Lazy load the Reviews component to reduce initial bundle size
const Reviews = lazy(() => import('@/components/Reviews').then(module => ({
  default: module.Reviews
})))

export const metadata: Metadata = {
  title: 'CaseCobra - Custom Phone Cases with Your Images',
  description: 'Create your own custom phone case with your favorite images. High-quality materials, 5-year print warranty, and wireless charging compatible.',
  openGraph: {
    title: 'CaseCobra - Custom Phone Cases with Your Images',
    description: 'Create your own custom phone case with your favorite images. High-quality materials, 5-year print warranty, and wireless charging compatible.',
    images: [
      {
        url: '/thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'CaseCobra Custom Phone Cases'
      }
    ]
  }
}

export default function Home() {
  return (
    <div className='bg-slate-50 grainy-light'>
      <HeroSection />

      {/* value proposition section */}
      <TestimonialsSection />
      
      <Suspense fallback={
        <div className="h-[200px] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-zinc-800" />
        </div>
      }>
        <div className='pt-16'>
          <Reviews />
        </div>
      </Suspense>

      <CallToActionSection />
    </div>
  )
}