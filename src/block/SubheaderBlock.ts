import { Block } from "payload";

export const SubHeaderBlock:Block = {
    slug : "subheader",
    fields : [
        {
            name : "text",
            type : "text",
            admin : {
                description : "Текст подзаголовка"
            }
        }
    ]
}