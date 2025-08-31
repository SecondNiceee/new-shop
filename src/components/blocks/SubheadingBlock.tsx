import type React from "react"

interface SubheadingBlockProps {
  text: string
}
export const SubheadingBlock: React.FC<SubheadingBlockProps> = ({ text }) => {
  return <p className="text-lg md:text-xl text-gray-600 mb-4 font-medium">{text}</p>
}
