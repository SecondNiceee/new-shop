"use server"
import { getPayload } from "payload"
import config from "@payload-config";
import { Category } from "@/payload-types";
export const getAllCategories= async ():Promise<Category[] | null>  => {
    const payload = await getPayload({config})
    try{
        const categoris = await payload.find({
            collection : "categories",
            where : {
                parent : {exists : false}
            },
            sort : "createdAt",
            limit : 0
        })
        return categoris.docs;
    }
    catch(e){
        console.log(e);
        return null
    }
    
}