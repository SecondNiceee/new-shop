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
            type : "text",
            admin : {
                description : "Текст параграфа"
            }
        },
        {
            name : "image",
            type : "upload",
            relationTo : "media",
            admin : {
                description : "Картинка"
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
