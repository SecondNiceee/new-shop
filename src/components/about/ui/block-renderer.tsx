import type { AboutBlock } from "../types/about-types"
import HeroBlockComponent from "./hero-block"
import ImageBlockComponent from "./image-block"
import ImageTextBlockComponent from "./image-text-block"
import StatsBlockComponent from "./stats-block"
import TeamBlockComponent from "./team-block"
import TextBlockComponent from "./text-block"

interface BlockRendererProps {
  blocks: AboutBlock[]
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case "hero":
            return <HeroBlockComponent key={index} block={block} />
          case "textBlock":
            return <TextBlockComponent key={index} block={block} />
          case "imageBlock":
            return <ImageBlockComponent key={index} block={block} />
          case "imageTextBlock":
            return <ImageTextBlockComponent key={index} block={block} />
          case "statsBlock":
            return <StatsBlockComponent key={index} block={block} />
          case "teamBlock":
            return <TeamBlockComponent key={index} block={block} />
          default:
            return null
        }
      })}
    </div>
  )
}
