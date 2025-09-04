import type React from "react"
import Image from "next/image"
import { Media } from "@/payload-types"

interface ImageBlockProps {
  image: Media,
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ image }) => {
  return (
    <div className="relative w-full aspect-video">
      <Image className="w-full object-cover my-5" fill src={image.url || ""} alt={image.alt} />
    </div>
  )
}
