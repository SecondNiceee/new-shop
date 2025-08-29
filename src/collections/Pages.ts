import {CollectionConfig} from "payload";

export const Pages:CollectionConfig ={
    slug : "pages",
    admin : {
        useAsTitle : "title"
    },
    access : {
        read : ({req : {user}}) => {
            if (user?.role === "admin"){
                return true
            }
            return {
                _status : {
                    equals : "published"
                }
            }
        }
    },
    versions : {
        drafts : {
            autosave : true
        }
    },
    fields : [
        {
            name : "slug",
            type : "text",
            admin : {
                description : "Уникальный slug странички. Не менять!"
            }
        },
        {
            name : "title",
            type : "text",
            required : true,
            admin : {
                description : "Название странички(для поииска)"
            }
        },
        {
            name : "description",
            type : "text",
            admin : {
                description : "Описание страницы (для поиска)"
            },
            required : true
        },
        {
            name : "content",
            type : "richText",
            required : true
        }
    ]
}