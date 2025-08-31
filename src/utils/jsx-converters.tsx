
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type {
  DefaultNodeTypes,
  SerializedHeadingNode,
  SerializedTextNode,
} from '@payloadcms/richtext-lexical'
import {} from "@/payload-types"
import { HeadingBlock } from "@/components/blocks/HeadingBlock";
import { SubheadingBlock } from "@/components/blocks/SubheadingBlock";
import { TextWithImageBlock } from "@/components/blocks/TextWithImageBlock";
import { ParagraphBlock } from "@/components/blocks/ParagraphBlock";

type NodeTypes =
  | DefaultNodeTypes
 
const CustomTextComponent: React.FC<{
  node: SerializedTextNode
}> = ({ node }) => {
    if (!node){
        return null
    }
    if (typeof node !== 'object') {
      return null
    }
    return (<p className="text-3xl font-semibold mb-5 text-foreground">{node.text}</p>)

}

const CustomHeading: React.FC<{
  node: SerializedHeadingNode
}> = ({ node }) => {
  console.log(node);
    if (!node){
        return null;
    }
    if (typeof node !== 'object') {
      return null
    }
    switch (node.tag){
        case "h1": <h1 className="text-4xl font-bold mb-6 text-foreground">{String(node)}</h1>
        case "h2": <h1 className="text-4xl font-bold mb-6 text-foreground">{String(node)}</h1>
    }
    return <h1 className="text-4xl font-bold mb-6 text-foreground">{String(node)}</h1>
}


const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading : ({node}) => {
    return <CustomHeading node={node} />
  },
  text: ({ node }) => {
    return <CustomTextComponent node={node} />
  },
  blocks : {
    headerBlock : ({node} : {node : any}) => <HeadingBlock  text={node.fields.text}  />,
    subheader : ({node} : {node : any}) => <SubheadingBlock text={node.fields.text} /> ,
    textWithImage : ({node} : {node : any}) => <TextWithImageBlock text={node.fields.text} imagePosition={node.fields.imagePosition} image={node.fields.image}  />
    paragraph : ({node} : {node:any}) => <ParagraphBlock text={node.fields.text} />
  } 
})

export default jsxConverters
