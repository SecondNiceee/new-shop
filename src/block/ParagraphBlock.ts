import { Block } from "payload";

export const PararaphBlock:Block = {
    slug : "paragraph",
    fields : [
        {
            type : "textarea",
            name : "text",
            admin : {
                description : "Текст параграфа."
            }
        }
    ]
}