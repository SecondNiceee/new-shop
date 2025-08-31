import type React from "react"
import Image from "next/image"
import { Media } from "@/payload-types"

interface TextWithImageBlockProps {
  text: any // Rich text content
  image: Media,
  imagePosition: "left" | "right" 
}

export const TextWithImageBlock: React.FC<TextWithImageBlockProps> = ({ text, image, imagePosition }) => {
  const renderRichText = (content: any) => {
    if (typeof content === "string") {
      return content
    }
    return JSON.stringify(content)
  }

  const getLayoutClasses = () => {
    switch (imagePosition) {
      case "left":
        return "md:flex-row"
      case "right":
        return "md:flex-row-reverse"
  }
}


  return (
    <div className={`flex flex-col gap-6 mb-8 ${getLayoutClasses()}`}>
      <div className={`md:w-1/2`}>
        <div className="prose prose-gray max-w-none">
          <div className="text-base md:text-lg leading-relaxed text-gray-700">{renderRichText(text)}</div>
        </div>
      </div>

      <div className={`md:w-1/2`}>
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image
            src={image.url || "/placeholder.svg"}
            alt={ image.alt || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  )
}
