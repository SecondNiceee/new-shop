import { Block } from "payload";

export const ImageBlock:Block = {
    slug : "image",
    fields : [
        {
            type : "upload",
            name : "image",
            label : "Image",
            admin : {
                description : "Картинка"
            },
            relationTo : "media"
        }
    ]
}