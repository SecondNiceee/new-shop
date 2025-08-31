import type React from "react"
interface HeadingBlockProps {
  text: string
}
export const HeadingBlock: React.FC<HeadingBlockProps> = ({ text }) => {
  return <h1 className={"text-4xl font-semibold text-gray-900 mb-4"}>{text}</h1>
}
