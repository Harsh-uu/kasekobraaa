'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, useState } from 'react'

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string
  dark?: boolean
}

const Phone = ({ imgSrc, className, dark = false, ...props }: PhoneProps) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        'relative pointer-events-none z-50 overflow-hidden',
        className
      )}
      {...props}>
      <img
        src={
          dark
            ? '/phone-template-dark-edges.png'
            : '/phone-template-white-edges.png'
        }
        className='pointer-events-none z-50 select-none'
        alt='phone image'
      />

      <div className='absolute -z-10 inset-0'>
        <img
          className='object-cover min-w-full min-h-full'
          src={imgSrc}
          alt='overlaying phone image'
          crossOrigin="anonymous"
          onError={(e) => {
            console.error("Error loading image in Phone component:", e);
            setHasError(true);
          }}
        />
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-sm text-gray-500">Image could not be loaded</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Phone;