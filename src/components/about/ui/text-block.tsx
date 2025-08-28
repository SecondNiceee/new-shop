import type { TextBlock } from "../types/about-types"
import { cn } from "@/lib/utils"

interface TextBlockProps {
  block: TextBlock
}

export default function TextBlockComponent({ block }: TextBlockProps) {
  const { title, content, alignment } = block

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <section className="px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {title && <h2 className={cn("text-3xl font-bold mb-8 text-balance", alignmentClasses[alignment])}>{title}</h2>}
        <div
          className={cn(
            "prose prose-lg max-w-none",
            alignmentClasses[alignment],
            alignment === "center" && "prose-center",
          )}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  )
}
