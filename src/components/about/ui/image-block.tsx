import type { ImageBlock } from "../types/about-types"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageBlockProps {
  block: ImageBlock
}

export default function ImageBlockComponent({ block }: ImageBlockProps) {
  const { image, alt, caption, size } = block

  if (typeof image !== "object") return null

  const sizeClasses = {
    small: "max-w-md",
    medium: "max-w-2xl",
    large: "max-w-4xl",
    full: "max-w-full",
  }

  return (
    <section className="px-4 py-12">
      <div className={cn("mx-auto", sizeClasses[size])}>
        <div className="relative overflow-hidden rounded-lg aspect-video">
          <Image src={image.url || ""} alt={alt} fill className="object-cover" />
        </div>
        {caption && <p className="mt-4 text-sm text-center text-gray-600">{caption}</p>}
      </div>
    </section>
  )
}
