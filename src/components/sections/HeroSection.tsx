'use client'

import { Check, Star } from 'lucide-react'
import Image from 'next/image'
import Phone from '../Phone'
import MaxWidthWrapper from '../MaxWidthWrapper'

export function HeroSection() {
  return (
    <section>
      <MaxWidthWrapper className='pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52'>
        <div className='col-span-2 px-6 lg:px-0 lg:pt-4'>
          <div className='relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start'>
            <div className='absolute w-28 left-0 -top-20 hidden lg:block'>
              <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t via-slate-50/50 from-slate-50 h-28' />
              <Image
                src='/snake-1.png'
                alt='decorative snake'
                width={112}
                height={112}
                className='w-full'
                priority
              />
            </div>
            <h1 className='relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl'>
              Your Image on a{' '}
              <span className='bg-green-600 px-2 text-white'>Custom</span>{' '}
              Phone Case
            </h1>
            <p className='mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap'>
              Capture your favorite memories with your own,{' '}
              <span className='font-semibold'>one-of-one</span> phone case.
              CaseCobra allows you to protect your memories, not just your
              phone case.
            </p>

            <div className='mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start'>
              <div className='space-y-2'>
                <FeatureItem text="High-quality, durable material" />
                <FeatureItem text="5 year print guarantee" />
                <FeatureItem text="Modern iPhone models supported" />
              </div>
            </div>

            <SocialProof />
          </div>
        </div>

        <div className='col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit'>
          <div className='relative md:max-w-xl'>
            <Image
              src='/your-image.png'
              alt='decorative image indicator'
              width={208}
              height={80}
              className='absolute w-40 lg:w-52 left-56 -top-20 select-none hidden sm:block lg:hidden xl:block'
            />
            <Image
              src='/line.png'
              alt='decorative line'
              width={80}
              height={80}
              className='absolute w-20 -left-6 -bottom-6 select-none'
            />
            <Phone className='w-64' imgSrc='/testimonials/1.jpg' />
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className='flex gap-1.5 items-center text-left'>
      <Check className='h-5 w-5 shrink-0 text-green-600' />
      {text}
    </li>
  )
}

function SocialProof() {
  const avatars = [
    { src: '/users/user-1.png', alt: 'User 1' },
    { src: '/users/user-2.png', alt: 'User 2' },
    { src: '/users/user-3.png', alt: 'User 3' },
    { src: '/users/user-4.jpg', alt: 'User 4' },
    { src: '/users/user-5.jpg', alt: 'User 5' },
  ]

  return (
    <div className='mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5'>
      <div className='flex -space-x-4'>
        {avatars.map((avatar, i) => (
          <Image
            key={avatar.src}
            className='inline-block h-10 w-10 rounded-full ring-2 ring-slate-100'
            src={avatar.src}
            alt={avatar.alt}
            width={40}
            height={40}
          />
        ))}
      </div>

      <div className='flex flex-col justify-between items-center sm:items-start'>
        <div className='flex gap-0.5'>
          {[...Array(5)].map((_, i) => (
            <Star key={i} className='h-4 w-4 text-green-600 fill-green-600' />
          ))}
        </div>
        <p>
          <span className='font-semibold'>1.250</span> happy customers
        </p>
      </div>
    </div>
  )
}
