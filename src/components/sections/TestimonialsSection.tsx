'use client'

import { Icons } from '@/components/Icons'
import Image from 'next/image'
import MaxWidthWrapper from '../MaxWidthWrapper'
import { Star, Check } from 'lucide-react'

export function TestimonialsSection() {
  return (
    <section className='bg-slate-100 grainy-dark py-24'>
      <MaxWidthWrapper className='flex flex-col items-center gap-16 sm:gap-32'>
        <div className='flex flex-col lg:flex-row items-center gap-4 sm:gap-6'>
          <h2 className='order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900'>
            What our{' '}
            <span className='relative px-2'>
              customers{' '}
              <Icons.underline className='hidden sm:block pointer-events-none absolute inset-x-0 -bottom-6 text-green-500' />
            </span>{' '}
            say
          </h2>
          <Image
            src='/snake-2.png'
            alt='decorative snake icon'
            width={96}
            height={96}
            className='w-24 order-0 lg:order-2'
          />
        </div>

        <div className='mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16'>
          <TestimonialCard
            text="The case feels durable and I even got a compliment on the design. Had the case for two and a half months now and the image is super clear, on the case I had before, the image started fading into yellow-ish color after a couple weeks. Love it."
            name="Jonathan"
            imageSrc="/users/user-1.png"
            highlightedText="the image is super clear"
          />

          <TestimonialCard
            text="I usually keep my phone together with my keys in my pocket and that led to some pretty heavy scratchmarks on all of my last phone cases. This one, besides a barely noticeable scratch on the corner, looks brand new after about half a year. I dig it."
            name="Josh"
            imageSrc="/users/user-4.jpg"
            highlightedText="looks brand new after about half a year"
          />
        </div>
      </MaxWidthWrapper>
    </section>
  )
}

interface TestimonialCardProps {
  text: string
  name: string
  imageSrc: string
  highlightedText: string
}

function TestimonialCard({ text, name, imageSrc, highlightedText }: TestimonialCardProps) {
  // Split text into parts based on highlighted text
  const parts = text.split(highlightedText)

  return (
    <div className='flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20'>
      <div className='flex gap-0.5 mb-2'>
        {[...Array(5)].map((_, i) => (
          <Star key={i} className='h-5 w-5 text-green-600 fill-green-600' />
        ))}
      </div>
      <div className='text-lg leading-8'>
        <p>
          {parts[0]}
          <span className='p-0.5 bg-slate-800 text-white'>{highlightedText}</span>
          {parts[1]}
        </p>
      </div>
      <div className='flex gap-4 mt-2'>
        <Image
          src={imageSrc}
          alt={`${name} profile picture`}
          width={48}
          height={48}
          className='rounded-full h-12 w-12 object-cover'
        />
        <div className='flex flex-col'>
          <p className='font-semibold'>{name}</p>
          <div className='flex gap-1.5 items-center text-zinc-600'>
            <Check className='h-4 w-4 stroke-[3px] text-green-600' />
            <p className='text-sm'>Verified Purchase</p>
          </div>
        </div>
      </div>
    </div>
  )
}
