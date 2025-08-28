import type { Media } from "@/payload-types"

export interface HeroBlock {
  blockType: "hero"
  title: string
  subtitle?: string
  backgroundImage?: Media
}

export interface TextBlock {
  blockType: "textBlock"
  title?: string
  content: any // Rich text content
  alignment: "left" | "center" | "right"
}

export interface ImageBlock {
  blockType: "imageBlock"
  image: Media
  alt: string
  caption?: string
  size: "small" | "medium" | "large" | "full"
}

export interface ImageTextBlock {
  blockType: "imageTextBlock"
  image: Media
  alt: string
  title?: string
  content: any // Rich text content
  layout: "imageLeft" | "imageRight"
}

export interface StatsBlock {
  blockType: "statsBlock"
  title?: string
  stats: Array<{
    number: string
    label: string
  }>
}

export interface TeamBlock {
  blockType: "teamBlock"
  title: string
  members: Array<{
    name: string
    position: string
    photo?: Media
    description?: string
  }>
}

export type AboutBlock = HeroBlock | TextBlock | ImageBlock | ImageTextBlock | StatsBlock | TeamBlock
