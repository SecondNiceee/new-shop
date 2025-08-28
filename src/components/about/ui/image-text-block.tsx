import type { ImageTextBlock } from "../types/about-types"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageTextBlockProps {
  block: ImageTextBlock
}

export default function ImageTextBlockComponent({ block }: ImageTextBlockProps) {
  const { image, alt, title, content, layout } = block

  if (typeof image !== "object") return null

  return (
    <section className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className={cn("grid gap-8 items-center", "md:grid-cols-2", layout === "imageRight" && "md:grid-cols-2")}>
          <div
            className={cn("relative aspect-video overflow-hidden rounded-lg", layout === "imageRight" && "md:order-2")}
          >
            <Image src={image.url || ""} alt={alt} fill className="object-cover" />
          </div>

          <div className={cn(layout === "imageRight" && "md:order-1")}>
            {title && <h2 className="mb-6 text-3xl font-bold text-balance">{title}</h2>}
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </div>
    </section>
  )
}
