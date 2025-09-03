import type React from "react"
import Image from "next/image"
import { Media } from "@/payload-types"

interface ImageBlockProps {
  image: Media,
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ image }) => {
  return (
    <Image className="w-full object-cover max-h-[500px] my-5" fill src={image.url || ""} alt={image.alt} />
  )
}
