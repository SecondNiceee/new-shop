import { ContactsBlock } from "@/lib/payload-blocks/ContactsBlock";
import { HeaderBlock } from "@/lib/payload-blocks/HeaderBlock";
import { ImageBlock } from "@/lib/payload-blocks/ImageBlock";
import { ImageGalleryBlock } from "@/lib/payload-blocks/ImageGalleryBlock";
import { PararaphBlock } from "@/lib/payload-blocks/ParagraphBlock";
import { TextWithImageBlock } from "@/lib/payload-blocks/TextWithImageBlock";
import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { CollectionConfig } from "payload";

export const Blogs:CollectionConfig = {
    slug : "blogs",
    admin : {
        useAsTitle : "title",
        group : "Страницы"
    },
    fields : [
        {
            name:"slug",
            type :"text",
            admin:{
                description : "SLUG на англ.языке без пробелов, для пути странички"
            },
            required : true,
            unique : true
        },
        {
            name : "title",
            type : "text",
            admin : {
                description : "Заголовок для SEO"
            },
            required : true
        },  
        {
            name : "description",
            type : "text",
            required : true,
            admin : {
                description : "Описание для SEO"
            },
            defaultValue : "Описание"
        },
        {
            name : "background",
            type: "upload",
            relationTo : "media",
            admin: {
                description : "Фоновое изображение для блога(на страничке выбора блогов)"
            },
            required : true
        },
        {
            name : "content",
            type : "richText",
            admin : {
                description : "Контент"
            },
            required : true,
            editor : lexicalEditor({
                features : ({ defaultFeatures, }) => [
                    ...defaultFeatures,
                    BlocksFeature({
                        blocks : [HeaderBlock, ImageBlock, PararaphBlock, TextWithImageBlock, ImageGalleryBlock, ContactsBlock]
                    })
                ]
            })
        }
    ]
}