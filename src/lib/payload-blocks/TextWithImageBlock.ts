import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { Block } from "payload";


export const TextWithImageBlock:Block = {
    slug : "textWithImage",
    labels : {
        singular : "Текст с картинкой",
        plural : "Текст с картинками"
    },
    fields : [
        {
            name : "text",
            type : "richText",
            admin : {
                description : "Текст параграфа"
            },
            editor : lexicalEditor({})
        },
        {
            name : "image",
            type : "upload",
            relationTo : "media",
            admin : {
                description : "Картинка (желательно 4:4) - квадратная то есть"
            }
        },
        {
            name : "imagePosition",
            type : "select",
            options : [
                {label : "Слева", value : "left" },
                {label : "Справа", value : "right"}
            ]
        }
    ]
}
