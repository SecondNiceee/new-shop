import { Block } from "payload";

export const HeaderBlock:Block = {
    slug : "headerBlock",
    fields : [
        {
            name: "text",
            type : "text",
            admin : {
                description : "Это текст заголовока"
            }
        }
    ]
}