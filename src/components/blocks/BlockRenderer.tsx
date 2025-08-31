import type React from "react"
import { HeadingBlock } from "./HeadingBlock"
import { SubheadingBlock } from "./SubheadingBlock"
import { ParagraphBlock } from "./ParagraphBlock"
import { TextWithImageBlock } from "./TextWithImageBlock"
import { ImageBlock } from "./ImageBlock"

interface Block {
  [key: string]: any
}

interface BlockRendererProps {
  blocks: Block[]
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  const renderBlock = (block: Block, index: number) => {
    switch (block.type) {
      case "heading":
        return <HeadingBlock key={index} text={block.text} level={block.level} />

      case "subheading":
        return <SubheadingBlock key={index} text={block.text} />

      case "paragraph":
        return <ParagraphBlock key={index} text={block.text} />

      case "textWithImage":
        return (
          <TextWithImageBlock
            key={index}
            text={block.text}
            image={block.image}
            imagePosition={block.imagePosition}
          />
        )

      case "image":
        return <ImageBlock key={index} image={block.image}  caption={block.caption} size={block.size} />

      default:
        console.warn(`Unknown block type: ${block.blockType}`)
        return null
    }
  }

  return <div className="space-y-4">{blocks.map((block, index) => renderBlock(block, index))}</div>
}
