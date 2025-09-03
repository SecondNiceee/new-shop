import type React from "react"
import type { JSX } from "react"

interface HeadingBlockProps {
  text: string
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  color?: string
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({ text, tag, color = "primary" }) => {
  const HeadingTag = tag as keyof JSX.IntrinsicElements
  return <HeadingTag className={color}>{text}</HeadingTag>
}
