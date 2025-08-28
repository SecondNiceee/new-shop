import type { HeroBlock } from "../types/about-types"
import Image from "next/image"

interface HeroBlockProps {
  block: HeroBlock
}

export default function HeroBlockComponent({ block }: HeroBlockProps) {
  const { title, subtitle, backgroundImage } = block

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {backgroundImage && typeof backgroundImage === "object" && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage.url || ""}
            alt={backgroundImage.alt || ""}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div className="relative z-10 max-w-4xl px-4 mx-auto text-center text-white">
        <h1 className="mb-6 text-4xl font-bold md:text-6xl text-balance">{title}</h1>
        {subtitle && <p className="text-xl text-gray-200 md:text-2xl text-pretty">{subtitle}</p>}
      </div>
    </section>
  )
}
