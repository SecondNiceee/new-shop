import jsxConverters from "@/utils/jsx-converters"
import { RichText } from "@payloadcms/richtext-lexical/react"
import type React from "react"

interface ParagraphBlockProps {
  text: any // Rich text content from PayloadCMS
}

export const ParagraphBlock: React.FC<ParagraphBlockProps> = ({ text }) => {
  // Простой рендер rich text - можно расширить для более сложного форматирования
  return (
    <div className="paragraph">
      <RichText converters={jsxConverters} data={text} />
    </div>
  )
}
