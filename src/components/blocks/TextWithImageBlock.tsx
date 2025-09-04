import type React from "react"
import Image from "next/image"
import { Media } from "@/payload-types"
import { RichText } from "@payloadcms/richtext-lexical/react"

interface TextWithImageBlockProps {
  text: any // Rich text content
  image: Media,
  imagePosition: "left" | "right" 
}

export const TextWithImageBlock: React.FC<TextWithImageBlockProps> = ({ text, image, imagePosition }) => {
  const getLayoutClasses = () => {
    switch (imagePosition) {
      case "left":
        return "md:flex-row"
      case "right":
        return "md:flex-row-reverse"
  }
}

  return (
    <div className={`rich-imageWithTextBlok flex flex-col gap-6 ${getLayoutClasses()}`}>
      <div className={`md:w-1/2 w-ful self-start flex justify-center items-center shadow-lg rounded-lg p-1 md:p-4`}>
        <RichText data={text} />
      </div>

      <div className={`md:w-1/2`}>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src={image.url || "/placeholder.svg"} 
            alt={ image.alt || ""}
            fill
            className="object-cover"
            sizes="100%"
          />
        </div>
      </div>
    </div>
  )
}
