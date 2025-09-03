import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { Block } from "payload";
import { HeaderBlock } from "./HeaderBlock";
import { ImageBlock } from "./ImageBlock";
import { TextWithImageBlock } from "./TextWithImageBlock";
import { ImageGalleryBlock } from "./ImageGalleryBlock";
import { ContactsBlock } from "./ContactsBlock";

export const PararaphBlock:Block = {
    slug : "paragraph",
    fields : [
        {
            type : "richText",
            name : "text",
            admin : {
                description : "Текст параграфа."
            },
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  BlocksFeature({
                    blocks : [HeaderBlock, ImageBlock, TextWithImageBlock, ImageGalleryBlock, ContactsBlock]
                  })
                ],
              }),
        }
    ]
}