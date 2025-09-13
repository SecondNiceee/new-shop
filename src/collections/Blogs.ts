import { ContactsBlock } from "@/lib/payload-blocks/ContactsBlock";
import { HeaderBlock } from "@/lib/payload-blocks/HeaderBlock";
import { ImageBlock } from "@/lib/payload-blocks/ImageBlock";
import { ImageGalleryBlock } from "@/lib/payload-blocks/ImageGalleryBlock";
import { PararaphBlock } from "@/lib/payload-blocks/ParagraphBlock";
import { TextWithImageBlock } from "@/lib/payload-blocks/TextWithImageBlock";
import { isAccess } from "@/utils/accessUtils";
import { BlocksFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { CollectionConfig } from "payload";

export const Blogs:CollectionConfig = {
    slug : "blogs",
    access : {
        read : () => true,
        create : isAccess("blogs"),
        update : isAccess("blogs"),
        delete : isAccess("blogs")
    },
    admin : {
        useAsTitle : "title",
        group : "Страницы"
    },
    fields : [
        {
            name:"slug",
            type :"text",
            label: "URL-адрес",
            admin:{
                description : "SLUG на англ.языке без пробелов, для пути странички"
            },
            required : true,
            unique : true
        },
        {
            name : "title",
            type : "text",
            label: "Заголовок",
            admin : {
                description : "Заголовок для SEO"
            },
            required : true
        },  
        {
            name : "description",
            type : "text",
            label: "Описание",
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
            label: "Фоновое изображение",
            admin: {
                description : "Фоновое изображение для блога(на страничке выбора блогов)"
            },
            required : true
        },
        {
            name : "content",
            type : "richText",
            label: "Контент",
            admin : {
                description : "Контент"
            },
            required : true,
            editor : lexicalEditor({
                features : ({ defaultFeatures, }) => [
                    ...defaultFeatures,
                    BlocksFeature({
                        blocks : [HeaderBlock, ImageBlock, PararaphBlock, TextWithImageBlock, ImageGalleryBlock, ContactsBlock]
                    }),
                    HeadingFeature({
                        enabledHeadingSizes : [
                          "h3", "h4", "h5", "h6"
                        ]
                    })
                ]
            })
        }
    ]
}