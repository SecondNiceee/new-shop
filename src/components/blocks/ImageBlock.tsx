import type React from "react"
import Image from "next/image"
import { Media } from "@/payload-types"

interface ImageBlockProps {
  image: Media,
  caption?: string
  size: "small" | "medium" | "large" | "full"
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ image, caption, size }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "max-w-sm mx-auto"
      case "medium":
        return "max-w-2xl mx-auto"
      case "large":
        return "max-w-4xl mx-auto"
      case "full":
        return "w-full"
      default:
        return "max-w-2xl mx-auto"
    }
  }

  return (
    <figure className={`mb-8 ${getSizeClasses()}`}>
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          src={image.url || "/placeholder.svg"}
          alt={image.alt || ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
      </div>
      {caption && <figcaption className="mt-3 text-sm text-gray-600 text-center italic">{caption}</figcaption>}
    </figure>
  )
}
