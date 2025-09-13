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
            label: "Текст",
            admin : {
                description : "Введите текст с возможностью форматирования"
            },
            editor : lexicalEditor({})
        },
        {
            name : "image",
            type : "upload",    
            label: "Изображение",
            relationTo : "media",
            admin : {
                description : "Загрузите изображение (желательно квадратное 4:4)"
            }
        },
        {
            name : "imagePosition",
            type : "select",
            label: "Позиция изображения",
            options : [
                {label : "Слева", value : "left" },
                {label : "Справа", value : "right"}
            ],
            admin: {
                description: "Выберите с какой стороны отображать изображение"
            }
        }
    ]
}
