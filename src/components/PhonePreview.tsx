"use client";

import { cn } from "@/lib/utils";
import { CaseColor } from "@prisma/client";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const PhonePreview = ({
  croppedImageUrl,
  color,
}: {
  croppedImageUrl: string;
  color: CaseColor;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [renderedDimensions, setRenderedDimensions] = useState({
    height: 0,
    width: 0,
  });
  const [hasError, setHasError] = useState(false);

  const handleResize = () => {
    if(!ref.current) return 
    const {width, height} = ref.current.getBoundingClientRect()
    setRenderedDimensions({width, height})
  }

  useEffect(() => {
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [ref.current])

  let caseBackgroundColor = 'bg-zinc-950'
  if(color === "blue") caseBackgroundColor = 'bg-blue-950'
  if(color === "cream") caseBackgroundColor = 'bg-gray-200'
  if(color === "rose") caseBackgroundColor = 'bg-rose-950'

  return (
    <AspectRatio ref={ref} ratio={3000 / 2001} className="relative">      <div
        className="absolute z-20 scale-[1.0352]"
        style={{
          left: renderedDimensions.width / 2 - renderedDimensions.width / (1216 / 121),
          top: renderedDimensions.height / 6.22,
        }}
      >
        {hasError ? (
          <div className={cn(
            "relative flex items-center justify-center",
            caseBackgroundColor,
            "rounded-t-[15px] rounded-b-[10px] md:rounded-t-[30px] md:rounded-b-[20px]",
            "w-full h-full min-h-[200px]"
          )}>
            <p className="text-sm text-white">Failed to load image</p>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            width={renderedDimensions.width / (3000 / 637)}
            className={cn(
              "phone-skew relative z-20",
              "rounded-t-[15px] rounded-b-[10px] md:rounded-t-[30px] md:rounded-b-[20px]", 
              caseBackgroundColor
            )}
            src={croppedImageUrl}
            onError={() => setHasError(true)}
            alt="Your custom phone case design"
          />
        )}
      </div>

      <div className="relative h-full w-full z-40">
        <Image
          className="pointer-events-none antialiased rounded-md"
          src="/clearphone.png"
          alt="Phone case preview"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          quality={90}
        />
      </div>
    </AspectRatio>
  );
};

export default PhonePreview;
