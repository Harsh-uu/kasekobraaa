'use client'

import { Check, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import MaxWidthWrapper from '../MaxWidthWrapper'
import Phone from '../Phone'
import { buttonVariants } from '../ui/button'
import Link from 'next/link'

export function CallToActionSection() {
  const features = [
    'High-quality silicone material',
    'Scratch- and fingerprint resistant coating',
    'Wireless charging compatible',
    '5 year print warranty'
  ]

  return (
    <section>
      <MaxWidthWrapper className='py-24'>
        <div className='mb-12 px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl sm:text-center'>
            <h2 className='order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900'>
              Upload your photo and get{' '}
              <span className='relative px-2 bg-green-600 text-white'>
                your own case
              </span>{' '}
              now
            </h2>
          </div>
        </div>

        <div className='mx-auto max-w-6xl px-6 lg:px-8'>
          <div className='relative flex flex-col items-center md:grid grid-cols-2 gap-40'>
            <Image
              src='/arrow.png'
              alt='directional arrow'
              width={96}
              height={96}
              className='absolute top-[25rem] md:top-1/2 -translate-y-1/2 z-10 left-1/2 -translate-x-1/2 rotate-90 md:rotate-0'
            />

            <div className='relative h-80 md:h-full w-full md:justify-self-end max-w-sm rounded-xl bg-gray-900/5 ring-inset ring-gray-900/10 lg:rounded-2xl'>
              <Image
                src='/horse.jpg'
                alt='sample image of a horse'
                width={400}
                height={320}
                className='rounded-md object-cover bg-white shadow-2xl ring-1 ring-gray-900/10 h-full w-full'
              />
            </div>

            <Phone className='w-60' imgSrc='/horse_phone.jpg' />
          </div>
        </div>

        <ul className='mx-auto mt-12 max-w-prose sm:text-lg space-y-2 w-fit'>
          {features.map((feature) => (
            <li key={feature} className='w-fit'>
              <Check className='h-5 w-5 text-green-600 inline mr-1.5' />
              {feature}
            </li>
          ))}

          <div className='flex justify-center'>
            <Link
              className={buttonVariants({
                size: 'lg',
                className: 'mx-auto mt-8',
              })}
              href='/configure/upload'>
              Create your case now <ArrowRight className='h-4 w-4 ml-1.5' />
            </Link>
          </div>
        </ul>
      </MaxWidthWrapper>
    </section>
  )
}
